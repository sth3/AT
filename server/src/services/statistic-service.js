const { poolPromise } = require('../data/events/dbIndexComponents');
const sql = require('mssql/msnodesqlv8');
const { trimTrailingWhitespace } = require('../data/utils');


STATISTICS_HEADER = `
    SELECT 
    C.name componentN `;

STATISTICS_SP_PV_SUM = `
    ,SUM(S.componentSP) AS componentSP
    ,SUM(S.componentPV) AS componentPV `;

STATISTICS_SP_PV = `
    ,[datetime]
    ,componentSP
    ,componentPV `;

STATISTICS_FROM = `
    FROM [AT].[dbo].[STATISTICS] S
    INNER JOIN [AT].[dbo].[COMPONENT] C on C.no = S.noComponent
    INNER JOIN [AT].[dbo].[USERS] U on U.id = S.noUser
    INNER JOIN [AT].[dbo].[ORDERS] O on O.no = S.noOrder
    INNER JOIN [AT].[dbo].[RECIPE_H] RH on RH.no = S.noRecipe
    `;

STATISTICS_GROUP_BY = 
    `GROUP BY C.name `;

GROUP_BY_BODY = [
        `,S.noContainer `,
        `,U.firstName + '' + U.lastName AS UserName `,
        `,RH.id recipeID `,
        `,RH.name recipeN `, 
        `,O.id orderID `, 
        `,O.name orderN `        
]

GROUP_BY_FOOTER = [        
        `,S.noContainer `,        
        `,U.firstName, U.lastName `, 
        `,RH.id `, 
        `,RH.name `, 
        `,O.id `, 
        `,O.name `
]


const updateStatSelect = async (type, groupBy) => {    
    let queryBody = [];
    let queryBodyFooter = [];    
   
        groupBy.forEach(element => {
            queryBody.push(GROUP_BY_BODY[element]) ;
            if(type == 1) {
                queryBodyFooter.push(GROUP_BY_FOOTER[element]);        
            }     
                
        });
        
    console.log('groupBy', groupBy , 'type:', type);
    query = STATISTICS_HEADER + STATISTICS_SP_PV + queryBody.join(' ') + STATISTICS_FROM 
    if(type == 1) {
    query = STATISTICS_HEADER + STATISTICS_SP_PV_SUM + queryBody.join(' ') + STATISTICS_FROM + STATISTICS_GROUP_BY + queryBodyFooter.join(' ')
    }
    console.log(query);

        const pool = await poolPromise;
        return  pool.request()
            .query(query);
        

}

module.exports = {    
    updateStatSelect
}