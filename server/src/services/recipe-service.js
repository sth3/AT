const { poolPromise } = require('../data/events/dbIndexComponents');
const sql = require('mssql/msnodesqlv8');
const { trimTrailingWhitespace } = require('../data/utils');

const GET_RECIPES = 'SELECT * FROM [AT].[dbo].[RECIPE_H]';
const GET_ALL_RECIPES = 'SELECT DISTINCT R.no no, ' +
    '   R.id id,' +
    '   R.name name,' +
    '   R.lastUpdate lastUpdate,' +
    '   (SELECT C.no no,' +
        '   C.id id,' +
        '   C.name name,' +
        '   C.lastUpdate lastUpdate,' +
        '   M.componentSP componentSP' +
    '   FROM [AT].[dbo].[RECIPE_B] M ' +
    '   INNER JOIN [AT].[dbo].[COMPONENT] C on C.no = M.componentNo' +
    '   WHERE M.recipeNo = R.no ' +
    '   FOR JSON PATH) components ' +
    'FROM [AT].[dbo].[RECIPE_H] R ' +
    'LEFT JOIN [AT].[dbo].[RECIPE_B] M ON R.no = M.recipeNo '
const GET_RECIPE_BY_NO = 'SELECT * FROM [AT].[dbo].[RECIPE_H] WHERE no = @no';
const ADD_RECIPE = 'INSERT INTO [AT].[dbo].[RECIPE_H] ' +
    '(id, name) ' +
    'VALUES (@id, @name) ' +
    'SELECT SCOPE_IDENTITY() as no';
const DELETE_RECIPE = 'DELETE FROM [AT].[dbo].[RECIPE_H] WHERE no = @no';
const UPDATE_LAST_UPDATE = 'UPDATE [AT].[dbo].[RECIPE_H] ' +
    'SET lastUpdate = GETDATE() ' +
    'WHERE no = @no';

const getAllRecipes = async () => {
    const pool = await poolPromise;
    let { recordset } = await pool.request()
        .query(GET_ALL_RECIPES);
    recordset = trimTrailingWhitespace(recordset);
    recordset.forEach(recipe => {
        recipe.components = trimTrailingWhitespace(JSON.parse(recipe.components));
    })
    return recordset;
}

const getRecipeByNo = async (no) => {
    const pool = await poolPromise;
    const { recordset } = await pool.request()
        .input('no', sql.Int, no)
        .query(GET_RECIPE_BY_NO);
    return trimTrailingWhitespace(recordset)[0];
}

const deleteRecipe = async (no) => {
    const pool = await poolPromise;
    return pool.request()
        .input('no', sql.Int, no)
        .query(DELETE_RECIPE);
}

const addRecipe = async (recipe) => {
    const pool = await poolPromise;
    const { recordset } = await pool.request()
        .input('id', recipe.id)
        .input('name', recipe.name)
        .query(ADD_RECIPE);
    return recordset[0];
}

const updateLastUpdate = async (no) => {
    const pool = await poolPromise;
    return pool.request()
        .input('no', sql.Int, no)
        .query();
}

const updateRecipe = async (no, recipe, userId) => {
    console.log('updateRecipe', recipe, userId);
    await deleteRecipe(no);
    const newRecipeNo = await addRecipe(recipe);
    console.log('newRecipeNo', newRecipeNo);
    const newRecipe = await getRecipeByNo(newRecipeNo.no);
    console.log('newRecipe', newRecipe);

}


module.exports = {
    getAllRecipes,
    getRecipeByNo,
    addRecipe,
    deleteRecipe,
    updateLastUpdate,
    updateRecipe
}
