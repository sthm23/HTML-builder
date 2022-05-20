const {stdin, stdout} = process;
const fs = require('fs');

const output = fs.createWriteStream('02-write-file/text.txt');
stdout.write('Hello my friend, write some text\n');

stdin.on('data', data=>{
  if(data.toString() == 'exit\r\n')process.exit();
  if(process.on('SIGINT', () => process.exit()));
  output.write(data);
});

process.on('exit', (e)=>{
  if(e === 0){
    stdout.write('Goodluck!');
  }else{
    stdout.write('error ' + e);
  }
});