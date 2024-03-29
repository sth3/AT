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

STATISTICS_DATETIME = `
    ,CONCAT(month(S.datetime), '.', year(S.datetime)) as datetime `;

STATISTICS_FROM = `
    FROM [AT].[dbo].[STATISTICS] S
    INNER JOIN [AT].[dbo].[COMPONENT] C on C.no = S.noComponent
    INNER JOIN [AT].[dbo].[USERS] U on U.id = S.noUser
    INNER JOIN [AT].[dbo].[ORDERS] O on O.no = S.noOrder
    INNER JOIN [AT].[dbo].[RECIPE_H] RH on RH.no = S.noRecipe
    `;

STATISTICS_GROUP_BY = 
    `GROUP BY C.name `;

STATISTICS_GROUP_BY_MONTH = 
    `GROUP BY C.name 
    ,MONTH(S.datetime), YEAR(S.datetime)`;


GROUP_BY_BODY = [
        `,S.noContainer `,
        `,U.firstName + '' + U.lastName AS UserName `,
        `,RH.id recipeID `,
        `,RH.name recipeN `, 
        `,O.id orderID `, 
        `,O.name orderN `,
        `,S.station station`        
]

GROUP_BY_FOOTER = [        
        `,S.noContainer `,        
        `,U.firstName, U.lastName `, 
        `,RH.id `, 
        `,RH.name `, 
        `,O.id `, 
        `,O.name `,
        `,S.station`
]

ORDER_BY = `ORDER BY MONTH(S.datetime), YEAR(S.datetime) `
   
	


const updateStatSelect = async (type, groupBy) => {    
    let queryBody = [];
    let queryBodyFooter = [];    
   
        groupBy.forEach(element => {
            queryBody.push(GROUP_BY_BODY[element]) ;
            if(type > 0) {
                queryBodyFooter.push(GROUP_BY_FOOTER[element]);        
            }     
                
        });
        
    console.log('groupBy', groupBy , 'type:', type);

    query = STATISTICS_HEADER + STATISTICS_SP_PV + queryBody.join(' ') + STATISTICS_FROM 
    if(type == 1) {
    query = STATISTICS_HEADER + STATISTICS_SP_PV_SUM + queryBody.join(' ') + STATISTICS_FROM + STATISTICS_GROUP_BY + queryBodyFooter.join(' ')
    }
    else if(type == 2) {
        query = STATISTICS_HEADER + STATISTICS_SP_PV_SUM + STATISTICS_DATETIME  + queryBody.join(' ') + STATISTICS_FROM + STATISTICS_GROUP_BY_MONTH + queryBodyFooter.join(' ') + ORDER_BY
    }
    console.log(query);

        const pool = await poolPromise;
        const recordset   =  pool.request()
        .query(query)
        
        return recordset;
        

}

module.exports = {    
    updateStatSelect
}