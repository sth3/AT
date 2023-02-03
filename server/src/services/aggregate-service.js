const { poolPromise } = require('../data/events/dbIndexComponents');
const sql = require('mssql/msnodesqlv8');
const { trimTrailingWhitespace } = require('../data/utils');


const MAX_CHANGE_LENGTH = 512;

const GET_AGGREGATE = 
       `SELECT 
        M.id aID,
        M.lastUpdate aLastUpdate,
        C.no no,
        C.id id,
        C.name name,           
        C.packing packing,
        C.specificBulkWeight specificBulkWeight
        FROM [AT].[dbo].[AGGREGATE] M 
        INNER JOIN [AT].[dbo].[COMPONENT] C on C.no = M.idComponent`;




const getAllRecipes = async () => {
    const active = await GET_AGGREGATE();
    const archived = await getArchivedRecipes();
    return {
        active: active,
        archived: archived
    }
}

const getActiveRecipes = async () => {
    const pool = await poolPromise;
    const { recordset } = await pool.request()
        .query(GET_ACTIVE_RECIPES);
    const recipes = trimTrailingWhitespace(recordset);
    recipes.map(recipe => parseComponentsAndCheckValidity(recipe));
    return recipes;
}

const getRecipeByNo = async (no) => {
    const pool = await poolPromise;
    const { recordset } = await pool.request()
        .input('no', sql.Int, no)
        .query(GET_RECIPE_BY_NO);
    if (recordset.length < 0) {
        return null;
    }
    const recipe = parseComponentsAndCheckValidity(recordset[0]);

    return trimTrailingWhitespace(recipe);
}
const getRecipeByNoForOrder = async (no) => {
    const pool = await poolPromise;
    const { recordset } = await pool.request()
        .input('no', sql.Int, no)
        .query(GET_RECIPE_BY_NO_FOR_ORDER);
    if (recordset.length < 0) {
        return null;
    }
    const recipe = parseComponentsAndCheckValidity(recordset[0]);

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

const getChangesForRecipe = async (no) => {
    const pool = await poolPromise;
    const { recordset } = await pool.request()
        .input('no', sql.Int, no)
        .query(GET_CHANGES_FOR_RECIPE);
    const oldRecipe = await getRecipeByNo(no);
    for (const change of recordset) {
        change.oldRecipe = oldRecipe;
        change.newRecipe = await getRecipeByNo(change.newRecipeNo);
    }
    return trimTrailingWhitespace(recordset);
}

const getComponentsChangesForRecipe = async (no) => {
    const pool = await poolPromise;
    const { recordset } = await pool.request()
        .input('no', sql.Int, no)
        .query(GET_COMPONENTS_CHANGES_FOR_RECIPE);
    for (const change of recordset) {
        change.oldComponent = await getComponentByNo(change.oldComponentNo);
        change.newComponent = await getComponentByNo(change.newComponentNo);
    }
    return trimTrailingWhitespace(recordset);
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

const getArchivedRecipes = async () => {
    const pool = await poolPromise;
    const { recordset } = await pool.request()
        .query(GET_ARCHIVED_RECIPES);
    for (const change of recordset) {
        change.oldRecipe = await getRecipeByNo(change.oldRecipeNo);
        change.newRecipe = await getRecipeByNo(change.newRecipeNo);
    }
    return recordset;
}

const parseComponentsAndCheckValidity = (recipe) => {
    if (recipe.components) {
        recipe.components = trimTrailingWhitespace(JSON.parse(recipe.components));
    }
    recipe.isValid = true;
    for (const component of recipe.components) {
        const lastRecipeUpdate = new Date(recipe.lastUpdate);
        if (new Date(component.lastUpdate) > lastRecipeUpdate) {
            recipe.isValid = false;
            break;
        }
    }
    return recipe;
}


module.exports = {
    getAllRecipes,
    getActiveRecipes,
    getRecipeByNo,
    addRecipe,
    deleteRecipe,
    updateLastUpdate,
    updateRecipe,
    getChangesForRecipe,
    getComponentsChangesForRecipe,
    getRecipeByNoForOrder
}
