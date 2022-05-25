const fs = require('fs');
const fsPromise = require('fs/promises');
const path = require('path');

fs.mkdir(path.join(__dirname, 'project-dist'), {recursive:true}, err=>err);
let wayCopyFolder = path.join(__dirname, 'project-dist', 'assets');
fs.mkdir(wayCopyFolder, {recursive:true}, err=>err);


let html = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));
let htmlTempArr = [];
let i = 0;

fs.readdir(path.join(__dirname, 'components'), {withFileTypes: true}, (err, data)=>{
    if(err) console.log(err)
    data.forEach(item=>{
        if(path.extname(item.name) === '.html' && item.isFile()){
            htmlTempArr.push(item.name);
        }
    })
});
fs.readFile(path.join(__dirname, 'template.html'), 'utf-8', (err, data)=>{
    if(err) console.log(err);
    changeIndex(data);
});

function changeIndex(text, teg = htmlTempArr[0]){
    fs.readFile(path.join(__dirname, 'components', teg), 'utf-8', (err, data)=>{
        if(err) console.log(err.message);
        let changerTag = `{{${teg.split('.')[0]}}}`;
        text = text.replace(changerTag, data);
        i++
        (i === htmlTempArr.length) ? html.write(text) : changeIndex(text, htmlTempArr[i]);
    });
}

const css = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));

function folder(way, copyWay){ 
    fsPromise.rm(copyWay, {recursive: true, force: true,})
    .then(() => {
        fsPromise.mkdir(copyWay, {recursive: true});
        fsPromise.readdir(way, {withFileTypes: true})
            .then((files) => {
                files.forEach( (item)=>{
                    if (item.isFile()) {
                        fsPromise.copyFile(path.join(way, item.name), path.join(copyWay, item.name));
                    }else{
                        folder(path.join(way, item.name), path.join(copyWay, item.name));
                    }
                });
            });
    });
}

folder(path.join(__dirname, 'assets'), wayCopyFolder);

function copyStyleFiles(way){
    fs.readdir(way, {withFileTypes: true}, (err, files)=>{
        if(err) throw err;
        files.forEach(item=>{
            if(item.isFile()){
                pipingStyleFiles(item.name);
            }else{
                // console.log('Folder, not file');
            }
        });
    });
}
copyStyleFiles(path.join(__dirname, 'styles'));

function pipingStyleFiles(file){
    const rs = fs.createReadStream(path.join(__dirname, 'styles', file));
    rs.pipe(css);
    rs.on('error', err=> console.log(err));
}
