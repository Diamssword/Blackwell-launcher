const mc = require("minecraft-launcher-core").Client;
const path = require("path");
const fs = require("fs");
module.exports={launch:launch}

function launch(auth,opts)
{
    if(!fs.existsSync(path.join(global.launcherDir,"instances")))
        fs.mkdirSync(path.join(global.launcherDir,"instances"))
    
    if(!fs.existsSync(opts.root))
        fs.mkdirSync(opts.root);

    opts.authorization=auth;

    let launcher=new mc();
    launcher.launch(opts);
    
    launcher.on('debug', (e) => console.log(e));
    launcher.on('data', (e) => console.log(e));
}