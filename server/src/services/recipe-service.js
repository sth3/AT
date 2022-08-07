const { poolPromise } = require('../data/events/dbIndexComponents');
const sql = require('mssql/msnodesqlv8');
const { trimTrailingWhitespace } = require('../data/utils');

const MAX_CHANGE_LENGTH = 512;
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
const GET_RECIPE_BY_NO = 'SELECT DISTINCT R.no no, ' +
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
    'LEFT JOIN [AT].[dbo].[RECIPE_B] M ON R.no = M.recipeNo ' +
    'WHERE R.no = @no';
const ADD_RECIPE = 'INSERT INTO [AT].[dbo].[RECIPE_H] ' +
    '(id, name) ' +
    'VALUES (@id, @name) ' +
    'SELECT SCOPE_IDENTITY() as no';
const DELETE_RECIPE = 'DELETE FROM [AT].[dbo].[RECIPE_H] WHERE no = @no';
const UPDATE_LAST_UPDATE = 'UPDATE [AT].[dbo].[RECIPE_H] ' +
    'SET lastUpdate = GETDATE() ' +
    'WHERE no = @no';
const ADD_COMPONENTS_TO_RECIPE = 'INSERT INTO [AT].[dbo].[RECIPE_B] ' +
    '(recipeNo, componentNo, componentSP) ' +
    'VALUES ';
const DELETE_COMPONENTS_MAPPING = 'DELETE FROM [AT].[dbo].[RECIPE_B] ' +
    'WHERE recipeNo = @recipeNo';
const ADD_RECIPE_CHANGE = 'INSERT INTO [AT].[dbo].[RECIPES_CHANGES] ' +
    '(oldRecipeNo, newRecipeNo, userId, change) ' +
    'VALUES (@oldRecipeNo, @oldRecipeNo, @userId, @change)';


const getAllRecipes = async () => {
    const pool = await poolPromise;
    let { recordset } = await pool.request()
        .query(GET_ALL_RECIPES);
    recordset = trimTrailingWhitespace(recordset);
    recordset.forEach(recipe => {
        if (!recipe.components) {
            return;
        }
        recipe.components = trimTrailingWhitespace(JSON.parse(recipe.components));
    })
    return recordset;
}

const getRecipeByNo = async (no) => {
    const pool = await poolPromise;
    const { recordset } = await pool.request()
        .input('no', sql.Int, no)
        .query(GET_RECIPE_BY_NO);
    if (recordset.length < 0) {
        return null;
    }
    const recipe = recordset[0];
    if (recipe.components) {
        recipe.components = trimTrailingWhitespace(JSON.parse(recipe.components));
    }
    return trimTrailingWhitespace(recipe);
}

const deleteRecipe = async (no) => {
    await deleteComponentsMapping(no);
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
    const recipeNo = recordset[0].no;
    await addComponentsToRecipe(recipeNo, recipe.components);
    return recipeNo;
}

const updateLastUpdate = async (no) => {
    const pool = await poolPromise;
    return pool.request()
        .input('no', sql.Int, no)
        .query();
}

const updateRecipe = async (no, recipe, userId) => {
    console.log('updateRecipe', recipe, userId);
    const oldRecipe = await getRecipeByNo(no);
    console.log('oldRecipe', oldRecipe);
    const newRecipeNo = await addRecipe(recipe);
    console.log('newRecipeNo', newRecipeNo);
    const newRecipe = await getRecipeByNo(newRecipeNo);
    console.log('newRecipe', newRecipe);
    let change = getChange(oldRecipe, newRecipe).join(', ');
    if (change.length >= MAX_CHANGE_LENGTH) {
        change = change.substring(0, MAX_CHANGE_LENGTH - 3) + '...';
    }
    console.log('change: ', change);
    await addRecipeChange(oldRecipe.no, newRecipeNo.no, userId, change);
    return newRecipe;
}

const addComponentsToRecipe = async (recipeNo, components) => {
    let query = ADD_COMPONENTS_TO_RECIPE;
    components.forEach((component, index) => {
        query += `(${recipeNo}, ${component.no}, ${component.componentSP})`;
        if (index < components.length - 1) {
            query += ', ';
        }
    })
    const pool = await poolPromise;
    return pool.request()
        .query(query);
}

const deleteComponentsMapping = async (recipeNo) => {
    const pool = await poolPromise;
    return pool.request()
        .input('recipeNo', sql.Int, recipeNo)
        .query(DELETE_COMPONENTS_MAPPING);
}

const addRecipeChange = async (oldRecipeNo, newRecipeNo, userId, change) => {
    const pool = await poolPromise;
    return pool.request()
        .input('oldRecipeNo', sql.Int, oldRecipeNo)
        .input('newRecipeNo', sql.Int, newRecipeNo)
        .input('userId', sql.Int, userId)
        .input('change', sql.NVarChar, change)
        .query(ADD_RECIPE_CHANGE);
}

const getChange = (oldRecipe, newRecipe) => {
    const changes = [];
    if (oldRecipe.id !== newRecipe.id) {
        changes.push(`id: ${oldRecipe.id} -> ${newRecipe.id}`);
    }
    if (oldRecipe.name !== newRecipe.name) {
        changes.push(`name: ${oldRecipe.name} -> ${newRecipe.name}`);
    }
    oldRecipe.components.forEach(oldC => {
        const newC = newRecipe.components.find(newC => newC.no === oldC.no);
        if (!newC) {
            changes.push(`component ${oldC.name} removed`);
        } else if (oldC.componentSP !== newC.componentSP) {
            changes.push(`component ${oldC.name} - componentSP: ${oldC.componentSP} -> ${newC.componentSP}`);
        }
    })
    newRecipe.components
        .filter(newC => !oldRecipe.components.some(oldC => oldC.no === newC.no))
        .forEach(newC => changes.push(`component ${newC.name} added`));
    if (changes.length === 0) {
        changes.push('unknown change')
    }
    return changes;
}


module.exports = {
    getAllRecipes,
    getRecipeByNo,
    addRecipe,
    deleteRecipe,
    updateLastUpdate,
    updateRecipe
}
