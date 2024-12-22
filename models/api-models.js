const fs = require('fs/promises')

exports.selectAllEndpoints = async ()=>{
    const jsonFile = await fs.readFile('./endpoints.json', 'utf-8')
    return JSON.parse(jsonFile)
}