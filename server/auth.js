const uuid = require('uuid');
const userService = require('./user-service');
const { roles } = require("./user-service");
const bcrypt = require('bcryptjs');

class Session {
    constructor(username, role, expiresAt) {
        this.username = username;
        this.role = role;
        this.expiresAt = expiresAt;
    }

    isExpired() {
        return this.expiresAt < (new Date());
    }
}

const sessions = {};
const MINUTE = 60 * 1000;

const authorizationCheck = (role) => {
    return (req, res, next) => {
        // skip auth methods
        if (['login', 'refresh'].includes(req.baseUrl.replace('/api/', ''))) {
            next();
            return;
        }
        if (!req.cookies) {
            console.error('no cookies present');
            res.status(401).end();
            return;
        }
        const sessionToken = req.cookies['session_token'];
        if (!sessionToken) {
            console.error('no session token present');
            res.status(401).end();
            return;
        }
        let userSession = sessions[sessionToken];
        if (!userSession) {
            console.error('no session present');
            res.status(401).end();
            return;
        }
        // if the session has expired, return an unauthorized error, and delete the
        // session from our map
        if (userSession.isExpired()) {
            console.error('session expired');
            delete sessions[sessionToken];
            res.status(401).end();
            return;
        }

        if (!isSufficientRole(userSession.role, role)) {
            console.error('insufficient role');
            res.status(403).send({ message: 'Role ' + userSession.role + ' is not sufficient for this operation.' });
            return;
        }
        return refreshToken(req, res, next, userSession);
    }
}

const login = async (req, res) => {
    const { username, password } = req.body;
    if (!username) {
        res.status(422).send({ message: 'Username is required' });
        return;
    }

    const user = await userService.getUserByUsername(username);
    if (!user) {
        res.status(401).send({ message: 'Invalid username' });
        return;
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        res.status(401).send({ message: 'Invalid password' });
        return;
    }

    // generate a random UUID as the session token
    const sessionToken = uuid.v4();

    // set the expiry time as 5min after the current time
    const now = new Date();
    const expiresAt = new Date(+now + 5 *  MINUTE);

    await userService.updateLastLoginDate(user.id);

    // create a session containing information about the user, role and expiry time
    sessions[sessionToken] = new Session(username, user.role, expiresAt);

    res.cookie('session_token', sessionToken, { expires: expiresAt, httpOnly: true });
    res.send({ message: 'Login successful' });
}

const logout = (req, res) => {
    if (!req.cookies) {
        res.status(401).end();
        return;
    }

    const sessionToken = req.cookies['session_token']
    if (!sessionToken) {
        res.status(401).end();
        return;
    }

    delete sessions[sessionToken];

    res.cookie('session_token', '', { expires: new Date() });
    res.end();
}

const refreshToken = (req, res, next, userSession) => {
    const sessionToken = req.cookies['session_token'];
    const newSessionToken = uuid.v4()

    // renew the expiry time
    const now = new Date()
    const expiresAt = new Date(+now + 5 * MINUTE);
    sessions[newSessionToken] = new Session(userSession.username, userSession.role, expiresAt);
    delete sessions[sessionToken];

    // set the session token to the new generated value with renewed expiration time
    res.cookie('session_token', newSessionToken, { expires: expiresAt });
    next();
}

const getSession = (req) => {
    if (!req.cookies) {
        return null;
    }
    const sessionToken = req.cookies['session_token'];
    if (!sessionToken) {
        return null;
    }
    console.log('get session, any session out there? ', sessions, sessionToken, sessions[sessionToken]);
    return sessions[sessionToken];
}

const isSufficientRole = (role, requestedRole) => {
    switch (requestedRole) {
        case roles.ADMIN:
            return role === roles.ADMIN;
        case roles.TECHNOLOG:
            return role === roles.TECHNOLOG || role === roles.ADMIN;
        case roles.OPERATOR:
            return role === roles.OPERATOR || role === roles.TECHNOLOG || role === roles.ADMIN;
        default:
            return false;
    }
}

module.exports = {
    authorizationCheck,
    login,
    logout,
    refreshToken,
    getSession
};
