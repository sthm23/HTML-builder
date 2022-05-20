const fs = require('fs');
const path = require('path');
const bundle = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));
// const bundleTest = fs.createWriteStream(path.join(__dirname, 'test-files', 'bundle.css')); ////для тестового стиля 

const mergeFiles = (way)=>{
    fs.readdir(way, {withFileTypes: true}, (err, files)=>{
        if(err) return err;
        files.forEach(item=>{
            if(item.isFile() && path.extname(item.name) === '.css'){
                readFile(item.name);
                // readTestFile(item.name); //для тестового стиля 
            }else{
                // console.log('Это папка ' + item.name);
            }
        });
    });
};
mergeFiles('05-merge-styles/styles');
// mergeFiles('05-merge-styles/test-files/styles'); //для тестового стиля 

function readFile(file){
    const rs = fs.createReadStream(path.join(__dirname + '/styles/' + file), 'utf-8');
    rs.pipe(bundle);
    rs.on('error', err=>console.log(err));
}
/*
//для тестового стиля 
function readTestFile(file){
    const rsTest = fs.createReadStream(path.join(__dirname + '/test-files/styles/' + file), 'utf-8');
    rsTest.pipe(bundleTest);
    rsTest.on('error', err=>console.log(err));
}
*/

console.log('Merging files were done!');