const fs = require('fs');
const path = require('path');

const searchFile = (way)=>{
    fs.readdir(way, {withFileTypes: true}, (err, files)=>{
        if(err) return console.log(err);
        files.forEach(item=>{
            if(item.isFile()){
                let str = '';
                let fileName = item.name.split('.')[0];
                let fileExtensions = path.extname(item.name).split('.').join('');
                fs.stat(path.join(way, item.name), true, (err, data)=>{
                    if(err) return console.log(err);
                    let fileSize = data.size;
                    str = fileName + ' - ' + fileExtensions + ' - ' + fileSize + 'byt';
                    return console.log(str);
                });             
            }else{
                // console.log('Это папка ' + item.name);
            }
        });
    });
};
searchFile(path.join(__dirname, 'secret-folder'));
