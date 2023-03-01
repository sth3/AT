const { poolPromise } = require("../data/events/dbIndexComponents");
const sql = require("mssql/msnodesqlv8");
const { trimTrailingWhitespace } = require("../data/utils");

const GET_ALL_COMPONENTS = "SELECT * FROM [AT].[dbo].[COMPONENT]";
// const GET_ACTIVE_COMPONENTS = 'SELECT CO.* FROM [AT].[dbo].[COMPONENT] CO ' +
//     'WHERE CO.no NOT IN ' +
//     '   (SELECT CH.oldComponentNo ' +
//     '   FROM [AT].[dbo].[COMPONENTS_CHANGES] CH)';
const GET_ACTIVE_COMPONENTS = `
    SELECT DISTINCT C.*,	   
    S.packingType packingType,
    S.packingWeight packingWeight
    FROM [AT].[dbo].[COMPONENT] C 
    LEFT JOIN [AT].[dbo].[COMPONENTS_SPECIFICATION] S ON S.no = C.no 
    WHERE C.no NOT IN 
    (SELECT CH.oldComponentNo 
    FROM [AT].[dbo].[COMPONENTS_CHANGES] CH)`;
const GET_ARCHIVED_COMPONENTS =
  "SELECT CH.id, CH.change, CH.date, " +
  "CONCAT(LTRIM(RTRIM(U.firstName)), ' ', LTRIM(RTRIM(U.lastName))) as 'user', " +
  "CH.oldComponentNo, CH.newComponentNo " +
  "FROM [AT].[dbo].[COMPONENTS_CHANGES] CH " +
  "JOIN [AT].[dbo].[COMPONENT] CO ON CH.oldComponentNo = CO.no " +
  "JOIN [AT].[dbo].[USERS] U ON U.id = CH.userId";
const GET_COMPONENT_BY_NO =
` SELECT DISTINCT C.*,	   
  S.packingType packingType,
  S.packingWeight packingWeight
  FROM [AT].[dbo].[COMPONENT] C 
  LEFT JOIN [AT].[dbo].[COMPONENTS_SPECIFICATION] S ON S.no = C.no 
  WHERE C.no  = @no`;
const ADD_COMPONENT =
  "INSERT INTO [AT].[dbo].[COMPONENT] " +
  "(id, name, specificBulkWeight) " +
  "VALUES (@id, @name , @specificBulkWeight) " +
  "SELECT SCOPE_IDENTITY() as no";
const ADD_PACKING =
  "INSERT INTO [AT].[dbo].[COMPONENTS_SPECIFICATION] " +
  "(no, packingWeight, packingType) " +
  "VALUES (@no, @packingWeight , @packingType) ";
const ADD_CHANGE =
  "INSERT INTO [AT].[dbo].[COMPONENTS_CHANGES] " +
  "(oldComponentNo, newComponentNo, userId, change) " +
  "VALUES (@oldComponentNo, @newComponentNo, @userId, @change)";
const UPDATE_LAST_UPDATE =
  "UPDATE [AT].[dbo].[COMPONENT] " +
  "SET lastUpdate = GETDATE() " +
  "WHERE no = @no";
const DELETE_COMPONENT = "DELETE FROM [AT].[dbo].[COMPONENT] WHERE no = @no";

const UPDATE_COMPONENT_PACKING = 'UPDATE [AT].[dbo].[COMPONENTS_SPECIFICATION] ' +
    'SET packingWeight = @packingWeight, ' +
    '   packingType = @packingType ' +  
    'WHERE no = @no';

const getAllComponents = async () => {
  const active = await getActiveComponents();
  const archived = await getArchivedComponents();
  return {
    active,
    archived,
  };
};

const getActiveComponents = async () => {
  const pool = await poolPromise;
  const { recordset } = await pool.request().query(GET_ACTIVE_COMPONENTS);
  return trimTrailingWhitespace(recordset);
};

const getComponentByNo = async (no) => {
  const pool = await poolPromise;
  const { recordset } = await pool
    .request()
    .input("no", sql.Int, no)
    .query(GET_COMPONENT_BY_NO);
  return trimTrailingWhitespace(recordset)[0];
};

const updateLastUpdate = async (no) => {
  const pool = await poolPromise;
  return pool.request().input("no", sql.Int, no).query(UPDATE_LAST_UPDATE);
};

const addComponent = async (component) => {
  const pool = await poolPromise;
  const { recordset } = await pool
    .request()
    .input("id", component.id.toUpperCase())
    .input("name", component.name.toUpperCase())

    .input("specificBulkWeight", component.specificBulkWeight)
    .query(ADD_COMPONENT);
  return recordset[0];
};
const addPacking = async (component, no) => {
  const pool = await poolPromise;
  const { recordset } = await pool
    .request()
    .input("no", no)
    .input("packingWeight", component.packingWeight)
    .input("packingType", component.packingType)
    .query(ADD_PACKING);
  //return recordset[0];
};

const updateComponent = async (no, component, userId) => {
  console.log("updateComponent", component, userId);
  await updateLastUpdate(no);
  const oldComponent = await getComponentByNo(no);
  console.log("oldComponent", oldComponent);
  const newComponentNo = await addComponent(component);
  console.log("newComponentNo", newComponentNo);
  const newComponent = await getComponentByNo(newComponentNo.no);
  console.log("newComponent", newComponent);
  const change = getChange(oldComponent, newComponent).join(", ");
  console.log("change", change);
  const pool = await poolPromise;
  await pool
    .request()
    .input("oldComponentNo", sql.Int, oldComponent.no)
    .input("newComponentNo", sql.Int, newComponent.no)
    .input("userId", sql.Int, userId)
    .input("change", sql.NVarChar, change)
    .query(ADD_CHANGE);
  return newComponent;
};
const updateComponentPacking = async (no, component) => {
  console.log("updateComponent", component);
  const pool = await poolPromise;
    await pool.request()
        .input('no', sql.Int, no)
        .input('packingType', component.packingType)
        .input('packingWeight', component.packingWeight)        
        .query(ADD_PACKING)
    return getComponentByNo(no);
};

const deleteComponent = async (no) => {
  const pool = await poolPromise;
  return pool.request().input("no", sql.Int, no).query(DELETE_COMPONENT);
};

const getChange = (oldComponent, newComponent) => {
  const changes = [];
  if (oldComponent.id !== newComponent.id) {
    changes.push(`id: ${oldComponent.id} -> ${newComponent.id}`);
  }
  if (oldComponent.name !== newComponent.name) {
    changes.push(`meno: ${oldComponent.name} -> ${newComponent.name}`);
  }

  if (oldComponent.specificBulkWeight !== newComponent.specificBulkWeight) {
    changes.push(
      `Špecifická objemová hmotnosť: ${oldComponent.specificBulkWeight.toFixed(
        3
      )}kg -> ${newComponent.specificBulkWeight.toFixed(3)}kg`
    );
  }
  if (changes.length === 0) {
    changes.push("unknown change");
  }
  return changes;
};

const getArchivedComponents = async () => {
  const pool = await poolPromise;
  const { recordset } = await pool.request().query(GET_ARCHIVED_COMPONENTS);
  for (const change of recordset) {
    change.oldComponent = await getComponentByNo(change.oldComponentNo);
    change.newComponent = await getComponentByNo(change.newComponentNo);
  }
  return recordset;
};

module.exports = {
  getAllComponents,
  getActiveComponents,
  getComponentByNo,
  addComponent,
  updateComponent,
  deleteComponent,
  addPacking,
  updateComponentPacking,
};
