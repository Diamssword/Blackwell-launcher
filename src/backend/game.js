const mc = require("minecraft-launcher-core").Client;
module.exports={launch:launch}

function launch(auth)
{
    let opts = {
        clientPackage: null,
        // We use a custom funtion here to emulate the authentication library, this should be nearly 100% compatible  
        authorization: auth,
        root: "./minecraft",
        version: {
            number: "1.14",
            type: "release"
        },
        memory: {
            max: "6G",
            min: "4G"
        }
    }
    let launcher=new mc();
    console.log("Starting")
    launcher.launch(opts);
    
    launcher.on('debug', (e) => console.log(e));
    launcher.on('data', (e) => console.log(e));
}