const roles = {
    ADMIN: 'ADMIN',
    TECHNOLOG: 'TECHNOLOG',
    OPERATOR: 'OPERATOR'
};
const longAgo = new Date('2022-07-31T00:00:00.000Z');
const today = new Date();
const users = [
    { id: 1, username: 'admin', password: 'admin', role: roles.ADMIN,
        firstName: 'Ad', lastName: 'Min',
        registrationDate: longAgo, lastLoginDate: today },
    { id: 2, username: 'technolog', password: 'technolog', role: roles.TECHNOLOG,
        firstName: 'Techno', lastName: 'Log',
        registrationDate: longAgo, lastLoginDate: today },
    { id: 3, username: 'operator', password: 'operator', role: roles.OPERATOR,
        firstName: 'Opera', lastName: 'Tor',
        registrationDate: longAgo, lastLoginDate: today }
]

const getUserById = (id) => {
    console.log('get user by id: ', id);
    return users.find(user => user.id === id);
}

const getUserByUsername = (username) => {
    return users.find(user => user.username === username);
}

const getUsers = () => {
    return users;
}

const createUser = (user) => {
    console.log('create user from: ', user);
    user = {
        id: users.length + 1,
        username: user.username,
        password: user.password, // todo hash this for DB
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        registrationDate: new Date(),
        lastLoginDate: new Date(),
    }
    users.push(user);
}

const deleteUser = (id) => {
    users.splice(users.findIndex(user => user.id === id), 1);
}

module.exports = {
    getUserById,
    getUserByUsername,
    getUsers,
    createUser,
    deleteUser,
    roles
}
