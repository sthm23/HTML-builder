const fs = require('fs');
const path = require('path');

const wayCopyFolder = path.join(__dirname, 'files-copy/');
fs.mkdir(wayCopyFolder, {recursive:true}, err=>err);

const copyDir  = (way)=>{
    fs.readdir(way, {withFileTypes: true}, (err, files)=>{
        if(err) return err;
        files.forEach(item=>{
            if(item.isFile()){
                fs.copyFile(way + '/' + item.name, wayCopyFolder+item.name, err=>err);
            }else{
                // console.log('Это папка ' + item.name);
            }
        });
    });
};
copyDir ('04-copy-directory/files');