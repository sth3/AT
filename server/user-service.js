const { poolPromise } = require('./src/data/events/dbIndexComponents');
const sql = require('mssql/msnodesqlv8');
const bcrypt = require('bcryptjs');
const { trimTrailingWhitespace } = require('./src/data/utils');

const roles = {
    ADMIN: 'ADMIN',
    TECHNOLOG: 'TECHNOLOG',
    OPERATOR: 'OPERATOR'
};

const SELECT_USER_BY_ID = 'SELECT * FROM [AT].[dbo].[USERS] WHERE id = @id';
const SELECT_USER_BY_USERNAME = 'SELECT * FROM [AT].[dbo].[USERS] WHERE username = @username';
const SELECT_ALL_USERS = 'SELECT * FROM [AT].[dbo].[USERS]';
const ADD_USER = 'INSERT INTO [AT].[dbo].[USERS] ' +
    '(username, password, role, firstName, lastName) ' +
    'VALUES (@username, @password, @role, @firstName, @lastName)';
const UPDATE_USER = 'UPDATE [AT].[dbo].[USERS] ' +
    'SET username = @username, password = @password, role = @role, firstName = @firstName, ' +
    'lastName = @lastName, lastLoginDate = GETDATE() ' +
    'WHERE id = @id';
const UPDATE_LAST_LOGIN_DATE = 'UPDATE [AT].[dbo].[USERS] ' +
    'SET lastLoginDate = GETDATE() ' +
    'WHERE id = @id';
const DELETE_USER = 'DELETE FROM [AT].[dbo].[USERS] WHERE id = @id';


const getUserById = async (id) => {
    console.log('get user by id: ', id);
    const pool = await poolPromise;
    const { recordset } = await pool.request()
        .input('id', sql.Int, id)
        .query(SELECT_USER_BY_ID);
    return trimTrailingWhitespace(recordset)[0];
}

const getUserByUsername = async (username) => {
    const pool = await poolPromise;
    const { recordset } = await pool.request()
        .input('username', username)
        .query(SELECT_USER_BY_USERNAME);
    return trimTrailingWhitespace(recordset)[0];
}

const getUsers = async () => {
    const pool = await poolPromise;
    const { recordset } = await pool.request()
        .query(SELECT_ALL_USERS);
    return trimTrailingWhitespace(recordset);
}

const createUser = async (user) => {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    console.log('create user from: ', user);
    user = {
        username: user.username,
        password: user.password,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
    };
    const pool = await poolPromise;
    return pool.request()
        .input('username', user.username)
        .input('password', user.password)
        .input('role', user.role)
        .input('firstName', user.firstName)
        .input('lastName', user.lastName)
        .query(ADD_USER);
}

const deleteUser = async (id) => {
    console.log('delete user with id: ', id);
    const pool = await poolPromise;
    return pool.request()
        .input('id', sql.Int, id)
        .query(DELETE_USER);
}

const updateUser = async (user) => {
    console.log('update user: ', user);
    const pool = await poolPromise;
    return pool.request()
        .input('id', sql.Int, user.id)
        .input('username', user.username)
        .input('password', user.password)
        .input('role', user.role)
        .input('firstName', user.firstName)
        .input('lastName', user.lastName)
        .query(UPDATE_USER);
}

const updateLastLoginDate = async (id) => {
    const pool = await poolPromise;
    return pool.request()
        .input('id', sql.Int, id)
        .query(UPDATE_LAST_LOGIN_DATE);
}

module.exports = {
    getUserById,
    getUserByUsername,
    getUsers,
    createUser,
    deleteUser,
    roles,
    updateUser,
    updateLastLoginDate
}