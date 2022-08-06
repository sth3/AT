const { poolPromise } = require('../data/events/dbIndexComponents');
const sql = require('mssql/msnodesqlv8');
const { trimTrailingWhitespace } = require('../data/utils');

const GET_COMPONENTS = 'SELECT * FROM [AT].[dbo].[COMPONENT]';
const GET_COMPONENT_BY_NO = 'SELECT * FROM [AT].[dbo].[COMPONENT] WHERE no = @no';
const ADD_COMPONENT = 'INSERT INTO [AT].[dbo].[COMPONENT] ' +
    '(id, name) ' +
    'VALUES (@id, @name) ' +
    'SELECT SCOPE_IDENTITY() as no';
const ADD_CHANGE = 'INSERT INTO [AT].[dbo].[COMPONENTS_CHANGES] ' +
    '(oldComponentNo, newComponentNo, userId, change) ' +
    'VALUES (@oldComponentNo, @newComponentNo, @userId, @change)';
const UPDATE_LAST_UPDATE = 'UPDATE [AT].[dbo].[COMPONENT] ' +
    'SET lastUpdate = GETDATE() ' +
    'WHERE no = @no';

const DELETE_COMPONENT = 'DELETE FROM [AT].[dbo].[COMPONENT] WHERE no = @no';



const getAllComponents = async () => {
    const pool = await poolPromise;
    const { recordset } = await pool.request()
        .query(GET_COMPONENTS);
    return trimTrailingWhitespace(recordset);
}

const getComponentByNo = async (no) => {
    const pool = await poolPromise;
    const { recordset } = await pool.request()
        .input('no', sql.Int, no)
        .query(GET_COMPONENT_BY_NO);
    return trimTrailingWhitespace(recordset)[0];
}

const updateLastUpdate = async (no) => {
    const pool = await poolPromise;
    return pool.request()
        .input('no', sql.Int, no)
        .query(UPDATE_LAST_UPDATE);
}

const addComponent = async (component) => {
    const pool = await poolPromise;
    const { recordset } = await pool.request()
        .input('id', component.id)
        .input('name', component.name)
        .query(ADD_COMPONENT);
    return recordset[0];
}

const updateComponent = async (no, component, userId) => {
    console.log('updateComponent', component, userId);
    await updateLastUpdate(no);
    const oldComponent = await getComponentByNo(no);
    console.log('oldComponent', oldComponent);
    const newComponentNo = await addComponent(component);
    console.log('newComponentNo', newComponentNo);
    const newComponent = await getComponentByNo(newComponentNo.no);
    console.log('newComponent', newComponent);
    const change = getChange(oldComponent, newComponent);
    console.log('change', change);
    const pool = await poolPromise;
    await pool.request()
        .input('oldComponentNo', sql.Int, oldComponent.no)
        .input('newComponentNo', sql.Int, newComponent.no)
        .input('userId', sql.Int, userId)
        .input('change', sql.NVarChar, change)
        .query(ADD_CHANGE);
    return newComponent;
}

const deleteComponent = async (no) => {
    const pool = await poolPromise;
    return pool.request()
        .input('no', sql.Int, no)
        .query(DELETE_COMPONENT);
}

const getChange = (oldComponent, newComponent) => {
    if (oldComponent.id !== newComponent.id) {
        return `id: ${oldComponent.id} -> ${newComponent.id}`;
    }
    if (oldComponent.name !== newComponent.name) {
        return `name: ${oldComponent.name} -> ${newComponent.name}`;
    }
    return 'unknown change';
}

module.exports = {
    getAllComponents,
    getComponentByNo,
    addComponent,
    updateComponent,
    deleteComponent,
}
