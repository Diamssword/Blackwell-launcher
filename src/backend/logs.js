const fs = require('fs');
const path = require('path');
const { Readable } = require("stream");
const { BrowserWindow, app } = require('electron');
const Convert = require('ansi-to-html');
const convert = new Convert();
var window;
var readStream = new Readable();
readStream._read = () => { }

var writingStream;

function sendAllLogs() {
    
   // window.send("consoleIn", convert.toHtml(fs.readFileSync(path.join(__dirname, "..", "logs.txt")).toString()));
}
function removeWindow()
{
    if(window)
    {
        window.destroy();
    }
}
function createWindow() {
    window = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    })
    window.menuBarVisible=false;
    window.loadFile(path.join(__dirname, '..', 'console.html'));


    readStream.on('data', (write) => { window.webContents.send('consoleIn', convert.toHtml(write.toString())); })

}
function initLogger() {
    process.stdout._orig_write = process.stdout.write;
    process.stdout.write = (data) => {
        let alt=coloring(data)
        readStream.push(alt);
      process.stdout._orig_write(alt);
    }
    process.stderr._orig_write = process.stderr.write;
    process.stderr.write = (data) => {
        let alt=coloring(data,true)
        readStream.push(alt);
      process.stderr._orig_write(alt);
    }
  
}
function coloring(data,stderr) {
    if(stderr)
    {
      return "\x1b[31m"+data+"\x1b[0m";
    }
    if(data.includes("/INFO]"))
    {
        return "\x1b[34m"+data+"\x1b[0m";
    }
    if(data.includes("/WARN]"))
    {
        return "\x1b[33m"+data+"\x1b[0m";
    }

    if(data.includes("/ERROR]"))
    {
        return "\x1b[31m"+data+"\x1b[0m";
    }
    return  "\x1b[32m"+data+"\x1b[0m";
}

function getFileStream() {
    if (!writingStream) {

        let p = path.join(__dirname, "../logs.txt");
        if (fs.existsSync(p)) {
            fs.unlinkSync(p);
        }
        writingStream = fs.createWriteStream(p, { flags: 'a' })
    }
    return writingStream;
}
module.exports = { init: initLogger, readStream: readStream, createWindow: createWindow, sendAllLogs,removeWindow:removeWindow }
