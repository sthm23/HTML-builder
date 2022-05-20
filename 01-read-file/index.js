const fs = require('fs');
const rs = fs.createReadStream('01-read-file/text.txt', 'utf-8');
let data = '';
rs.on('data', chunk=>data += chunk);
rs.on('end', ()=>console.log(data));
rs.on('error', err=>console.log(err.message));
