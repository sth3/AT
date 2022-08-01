'use strict';

const fs = require('fs-extra');
const { join } = require('path');

const loadSqlQueries = async folderName => {
    const filePath = join(process.cwd(), 'src', 'data', folderName);
    const files = await fs.readdir(filePath);
    const sqlFiles = files.filter(f => f.endsWith('.sql'));
    const queries = {};
    for (const sqlFile of sqlFiles) {
        const query = fs.readFileSync(join(filePath, sqlFile), { encoding: "UTF-8" });
        queries[sqlFile.replace(".sql", "")] = query;
    }
    return queries;
};

const trimTrailingWhitespace = recordSet => {
    if (typeof recordSet === 'string') {
        return recordSet.trim();
    }
    if (!Array.isArray(recordSet)) {
        return recordSet;
    }
    for (const row of recordSet) {
        for (const column in row) {
            if (row.hasOwnProperty(column) && row[column] !== null && typeof row[column] === 'string') {
                row[column] = row[column].trim();
            }
        }
    }
    return recordSet;
}

module.exports = {
    loadSqlQueries,
    trimTrailingWhitespace
};
