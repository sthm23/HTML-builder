const fs = require('fs');
const fsPromise = require('fs/promises');
const path = require('path');

fs.access(path.join(__dirname, 'project-dist'), err=>{
    if(err){
        const html = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));
        const tempHtml = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
        tempHtml.pipe(html);
        htmlCreater(path.join(__dirname, 'template.html'));
    }else{
        htmlCreater(path.join(__dirname, 'project-dist', 'index.html'));
    }
});
fs.mkdir(path.join(__dirname, 'project-dist'), {recursive:true}, err=>err);
let wayCopyFolder = path.join(__dirname, 'project-dist', 'assets');
fs.mkdir(wayCopyFolder, {recursive:true}, err=>err);



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

function saveToIndex (str)  {
    let html = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));
    html.write(str);
}
function htmlCreater(way){
    fs.readFile(way, 'utf-8', (err, data)=>{
        if(err)console.log(err);
        let templateOrg = data;
        if(!data.match(/{{(.*?)}}/g)){
            return '';
        }
        let allTemplateTags = data.match(/{{(.*?)}}/g).map( function(val) {
            return val;
        });
    
        allTemplateTags.forEach( (item,index) => {
            let component_name = item.replace('{{', '').replace('}}', '');
    
            fs.readFile(path.join(__dirname, 'components', `${component_name}.html` ), 'utf-8', (err, data)=>{
                if(err)console.log(err);
                
                templateOrg = templateOrg.replace(item, data);
                
                if(allTemplateTags.length -1 === index){
                    saveToIndex(templateOrg);
                }
            }); 
        });
    });
}

