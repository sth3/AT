const { poolPromise } = require('../data/events/dbIndexComponents');
const sql = require('mssql/msnodesqlv8');
const { trimTrailingWhitespace } = require('../data/utils');
const { getRecipeByNoForOrder } = require('./recipe-service');
const { getUserById } = require('./user-service');

const GET_ORDERS = 'SELECT * FROM [AT].[dbo].[ORDERS] WHERE [done] = @done ';

const GET_ORDER_BY_NO = 'SELECT * FROM [AT].[dbo].[ORDERS] ' +
    'WHERE no = @no';
const ADD_ORDER = 'INSERT INTO [AT].[dbo].[ORDERS] ' +
    '   (id, name, customerName, dueDate, recipeNo, operatorId, quantity, ' +
    '   idMixer, mixingTime, idPackingMachine, idEmptyingStationBag, volumePerDose, done, BigBagDone, LiquidDone, ADSDone, MicroDone, createdAt, lastUpdate) ' +
    'VALUES (' +
    '   @id, @name, @customerName, @dueDate, @recipeNo, @operatorId, @quantity, ' +
    '   @idMixer, @mixingTime, @idPackingMachine, @idEmptyingStationBag, @volumePerDose, @done, @BigBagDone, @LiquidDone, @ADSDone, @MicroDone, GETDATE(), GETDATE() ' +
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
    '   done = 0, ' +
    '   BigBagDone = @BigBagDone, ' +
    '   LiquidDone = @LiquidDone, ' +
    '   ADSDone = @ADSDone, ' +
    '   MicroDone = @MicroDone, ' +
    '   lastUpdate = GETDATE() ' +
    'WHERE no = @no';
const ADD_PACKING = 'INSERT INTO [AT].[dbo].[PACKING_ORDERS] ' +
    '(recipeNo, componentNo, orderNo, packing ,packingWeight) ' +
    'VALUES ';
const ADD_DOSE = 'INSERT INTO [AT].[dbo].[QUANTITY_PER_DOSE] ' +
    '(orderNo, recipeNo, componentNo,  quantityDose, quantityBag, quantityBigBag, quantityADS, quantityLiquid, quantityMicro) ' +
    'VALUES ';
const DELETE_PACKING_ORDERS_BY_NO = 'DELETE FROM [AT].[dbo].[PACKING_ORDERS] ' +
    'WHERE orderNo = @no';
const DELETE_DOSES= 'DELETE FROM [AT].[dbo].[QUANTITY_PER_DOSE] ' +
    'WHERE orderNo = @no';


const getOrders = async (done) => {
    const pool = await poolPromise;
    const { recordset } = await pool.request()
        .input('done', sql.Int, done)
        .query(GET_ORDERS);
    for (let order of recordset) {
        order = trimTrailingWhitespace(order);
        if (order.recipeNo) {
            order.recipe = await getRecipeByNoForOrder(order.recipeNo, order.no);
            console.log('getOrders ' + JSON.stringify(order));
        }
        if (order.operatorId) {
            order.operator = await getUserById(order.operatorId);
        }
    }
    return recordset;
};

const getOrdersList = async (done) => {
    const pool = await poolPromise;
    const { recordset } = await pool.request()
    .input('done', sql.Int, done)
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
        order.recipe = await getRecipeByNoForOrder(order.recipeNo , order.no);
    }
    if (order.operatorId) {
        order.operator = await getUserById(order.operatorId);
    }
    return order;
}

const addOrder = async (order) => {
    console.log('order', order)
    const pool = await poolPromise;
    const { recordset } = await pool.request()
        .input('id', order.id.toUpperCase())
        .input('name', order.name.toUpperCase())
        .input('customerName', order.customerName.toUpperCase())
        .input('dueDate', order.dueDate)
        .input('recipeNo', sql.Int, order.recipeNo)
        .input('operatorId', sql.Int, order.operatorId)
        .input('quantity', sql.Real, order.quantity)
        .input('idMixer', sql.Int, order.idMixer)
        .input('mixingTime', sql.Int, order.mixingTime)
        .input('idPackingMachine', sql.Int, order.idPackingMachine)
        .input('idEmptyingStationBag', sql.Int, order.idEmptyingStationBag)
        .input('volumePerDose', sql.Int, order.volumePerDose)
        .input('done', sql.Int, 0)
        .input('BigBagDone', sql.Int, order.BigBagDone)
        .input('LiquidDone', sql.Int, order.LiquidDone)
        .input('ADSDone', sql.Int, order.ADSDone)
        .input('MicroDone', sql.Int, order.MicroDone)
        .query(ADD_ORDER);
    const orderNo = recordset[0].no;
    await addPacking(orderNo, order.packing);
    await addOrderDose(orderNo, order.doses);
    return recordset[0];
}
const addPacking = async (orderNo, packing) => {
    let query = ADD_PACKING;
    packing.packingOrder.forEach((value, index) => {
        
        console.log("🚀 ~ file: order-service.js:135 ~ packing.packingOrder.forEach ~ packing.packingType", value.packingType)
        query += `(${packing.recipeNo}, ${packing.componentNo[index]}, ${orderNo},${value.packingType},${value.packingWeight})`;
        if (index < packing.packingOrder.length - 1) {
            query += ', ';
        }
    })
    console.log('query', query);
    const pool = await poolPromise;
    return pool.request()
        .query(query);
}
const addOrderDose = async (orderNo, doses) => {
    let query = ADD_DOSE;
    doses.forEach((value, index) => {
        query += `(${orderNo},${value.recipeNo}, ${value.componentNo}, ${value.quantityDose},${value.quantityBag},${value.quantityBigBag.toFixed(3)},${value.quantityADS.toFixed(3)},${value.quantityLiquid.toFixed(3)},${value.quantityMicro.toFixed(3)})`;
        if (index < doses.length - 1) {
            query += ', ';
        }
    })
    console.log('query', query);
    const pool = await poolPromise;
    return pool.request()
        .query(query);
}

const deleteOrder = async (no) => {
    await deletePacking(no);
    await deleteDoses(no);
    const pool = await poolPromise;
    return pool.request()
        .input('no', sql.Int, no)
        .query(DELETE_ORDER_BY_NO);

}

const deletePacking = async (no) => {
    const pool = await poolPromise;
    return pool.request()
        .input('no', sql.Int, no)
        .query(DELETE_PACKING_ORDERS_BY_NO);
}
const deleteDoses = async (no) => {
    const pool = await poolPromise;
    return pool.request()
        .input('no', sql.Int, no)
        .query(DELETE_DOSES);
}

const updateOrder = async (no, order) => {
    console.log('no', no);
    console.log('order', order);
    await deletePacking(no);
    await addPacking(no, order.packing);
    await deleteDoses(no);
    await addOrderDose(no, order.doses);

    const pool = await poolPromise;
    await pool.request()
        .input('no', sql.Int, no)
        .input('id', order.id.toUpperCase())
        .input('name', order.name.toUpperCase())
        .input('customerName', order.customerName.toUpperCase())
        .input('dueDate', sql.Date, order.dueDate)
        .input('recipeNo', sql.Int, order.recipeNo)
        .input('operatorId', sql.Int, order.operatorId)
        .input('quantity', sql.Real, order.quantity)
        .input('idMixer', sql.Int, order.idMixer)
        .input('mixingTime', sql.Int, order.mixingTime)
        .input('idPackingMachine', sql.Int, order.idPackingMachine)
        .input('idEmptyingStationBag', sql.Int, order.idEmptyingStationBag)
        .input('volumePerDose', sql.Int, order.volumePerDose)
        .input('BigBagDone', sql.Int, order.BigBagDone)
        .input('LiquidDone', sql.Int, order.LiquidDone)
        .input('ADSDone', sql.Int, order.ADSDone)
        .input('MicroDone', sql.Int, order.MicroDone)
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
