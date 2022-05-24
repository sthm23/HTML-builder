const fs = require('fs/promises');
const path = require('path');

const wayCopyFolder = path.join(__dirname, 'files-copy');

async function copyDir(way){ 
    fs.rm(wayCopyFolder, {recursive: true, force: true,})
    .then(() => {
        fs.mkdir(wayCopyFolder, {recursive: true});
        fs.readdir(way, {withFileTypes: true})
            .then((files) => {
                files.forEach( (item)=>{
                    if (item.isFile()) {
                        let pathItem = path.join(way, item.name);
                        let newItem = path.join(wayCopyFolder, item.name);
                        fs.copyFile(pathItem, newItem);
                    }
                });
            });
    });
}


copyDir(path.join(__dirname, 'files'));
