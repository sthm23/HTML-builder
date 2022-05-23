const fs = require('fs');
const path = require('path');
const bundle = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));

const mergeFiles = (way)=>{
    fs.readdir(way, {withFileTypes: true}, (err, files)=>{
        if(err) return err;
        files.forEach(item=>{
            if(item.isFile() && path.extname(item.name) === '.css'){
                readFile(item.name);
            }else{
                // console.log('Это папка ' + item.name);
            }
        });
    });
};
mergeFiles(path.join(__dirname, 'styles'));

function readFile(file){
    const rs = fs.createReadStream(path.join(__dirname, 'styles', file), 'utf-8');
    rs.pipe(bundle);
    rs.on('error', err=>console.log(err));
}
