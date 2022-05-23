const fs = require('fs');
const path = require('path');

fs.mkdir(path.join(__dirname, 'project-dist'), {recursive:true}, err=>err);
let wayCopyFolder = path.join(__dirname, 'project-dist', 'assets');
fs.mkdir(wayCopyFolder, {recursive:true}, err=>err);

const html = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));
const tempHtml = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
tempHtml.pipe(html);

const css = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));

const copyAssets  = (way, folder='')=>{
    fs.readdir(way, {withFileTypes: true}, (err, files)=>{
        if(err) return err;
        files.forEach(item=>{
            if(item.isFile()){
                fs.copyFile(way + '/' + item.name, wayCopyFolder + '/' + folder + '/' + item.name, err=>err);
            }else{
                fs.mkdir(path.join(__dirname, 'project-dist', 'assets', item.name), {recursive:true}, err=>err);
                copyAssets(way + '/' + item.name, item.name);
            }
        });
    });
};
copyAssets(path.join(__dirname, 'assets'));

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
fs.readFile(path.join(__dirname, 'template.html'), 'utf-8', async (err, data)=>{
    if(err)console.log(err);
    let templateOrg = data;
    let allTemplateTags = data.match(/{{(.*?)}}/g).map( function(val) {
        return val;
    });

    let resolve, promise = new Promise((res)=>{
        resolve = res;
    });

    allTemplateTags.forEach((item,index) => {
        let component_name = item.replace('{{', '').replace('}}', '');

        fs.readFile(path.join(__dirname, 'components', `${component_name}.html` ), 'utf-8', (err, data)=>{
            if(err)console.log(err);
            
            templateOrg = templateOrg.replace(item, data);
            
            if(allTemplateTags.length -1 === index){
                resolve(templateOrg);
            }
        }); 
    });
    promise.then(c =>{
        saveToIndex(c);
    });
});
