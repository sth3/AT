const { poolPromise } = require('../data/events/dbIndexComponents');
const sql = require('mssql/msnodesqlv8');
const { trimTrailingWhitespace } = require('../data/utils');
const { getRecipeByNo } = require('./recipe-service');
const { getUserById } = require('./user-service');

const GET_ORDERS = 'SELECT * FROM [AT].[dbo].[ORDERS] ';
const GET_ORDER_BY_NO = 'SELECT * FROM [AT].[dbo].[ORDERS] ' +
    'WHERE no = @no';
const ADD_ORDER = 'INSERT INTO [AT].[dbo].[ORDERS] ' +
    '   (id, name, customerName, dueDate, recipeNo, operatorId, quantity, ' +
    '   idMixer, mixingTime, idPackingMachine, idEmptyingStationBag, volumePerDose, createdAt, lastUpdate) ' +
    'VALUES (' +
    '   @id, @name, @customerName, @dueDate, @recipeNo, @operatorId, @quantity, ' +
    '   @idMixer, @mixingTime, @idPackingMachine, @idEmptyingStationBag, @volumePerDose, GETDATE(), GETDATE() ' +
    ') SELECT SCOPE_IDENTITY() as no';
const DELETE_ORDER_BY_NO = 'DELETE FROM [AT].[dbo].[ORDERS] ' +
    'WHERE no = @no';
const UPDATE_ORDER = 'UPDATE [AT].[dbo].[ORDERS] ' +
    'SET id = @id, ' +
    '   name = @name, ' +
    '   customerName = @customerName, ' +
    '   dueDate = @dueDate, ' +
    '   recipeNo = @recipeNo, ' +
    '   operatorId = @operatorId, ' +
    '   quantity = @quantity, ' +
    '   idMixer = @idMixer, ' +
    '   mixingTime = @mixingTime, ' +
    '   idPackingMachine = @idPackingMachine, ' +
    '   idEmptyingStationBag = @idEmptyingStationBag, ' +
    '   volumePerDose = @volumePerDose, ' +
    '   lastUpdate = GETDATE() ' +
    'WHERE no = @no';

const getOrders = async () => {
    const pool = await poolPromise;
    const { recordset } = await pool.request()
        .query(GET_ORDERS);
    for (let order of recordset) {
        order = trimTrailingWhitespace(order);
        if (order.recipeNo) {
            order.recipe = await getRecipeByNo(order.recipeNo);
        }
        if (order.operatorId) {
            order.operator = await getUserById(order.operatorId);
        }
    }
    return recordset;
};

const getOrdersList = async () => {
    const pool = await poolPromise;
    const { recordset } = await pool.request()
        .query(GET_ORDERS);
    return trimTrailingWhitespace(recordset);
}

const getOrderByNo = async (no) => {
    console.log('get order by no ', no, typeof no);
    const pool = await poolPromise;
    const { recordset } = await pool.request()
        .input('no', sql.Int, no)
        .query(GET_ORDER_BY_NO);
    console.log('get by no fine as well ', recordset[0]);
    if (recordset.length < 0) {
        return null;
    }
    const order = trimTrailingWhitespace(recordset[0]);
    if (order.recipeNo) {
        order.recipe = await getRecipeByNo(order.recipeNo);
    }
    if (order.operatorId) {
        order.operator = await getUserById(order.operatorId);
    }
    return order;
}

const addOrder = async (order) => {
    const pool = await poolPromise;
    const { recordset } = await pool.request()
        .input('id', order.id)
        .input('name', order.name)
        .input('customerName', order.customerName)
        .input('dueDate', order.dueDate)
        .input('recipeNo', sql.Int, order.recipeNo)
        .input('operatorId', sql.Int, order.operatorId)
        .input('quantity', sql.Real, order.quantity)
        .input('idMixer', sql.Int, order.idMixer)
        .input('mixingTime', sql.Int, order.mixingTime)
        .input('idPackingMachine', sql.Int, order.idPackingMachine)
        .input('idEmptyingStationBag', sql.Int, order.idEmptyingStationBag)
        .input('volumePerDose', sql.Int, order.volumePerDose)
        .query(ADD_ORDER);
    return recordset[0];
}

const deleteOrder = async (no) => {
    const pool = await poolPromise;
    return pool.request()
        .input('no', sql.Int, no)
        .query(DELETE_ORDER_BY_NO);
}

const updateOrder = async (no, order) => {
    const pool = await poolPromise;
    await pool.request()
        .input('no', sql.Int, no)
        .input('id', order.id)
        .input('name', order.name)
        .input('customerName', order.customerName)
        .input('dueDate', sql.Date, order.dueDate)
        .input('recipeNo', sql.Int, order.recipeNo)
        .input('operatorId', sql.Int, order.operatorId)
        .input('quantity', sql.Real, order.quantity)
        .input('idMixer', sql.Int, order.idMixer)
        .input('mixingTime', sql.Int, order.mixingTime)
        .input('idPackingMachine', sql.Int, order.idPackingMachine)
        .input('idEmptyingStationBag', sql.Int, order.idEmptyingStationBag)
        .input('volumePerDose', sql.Int, order.volumePerDose)
        .query(UPDATE_ORDER)
    return getOrderByNo(no);
}

module.exports = {
    getOrders,
    getOrdersList,
    getOrderByNo,
    addOrder,
    deleteOrder,
    updateOrder
};
