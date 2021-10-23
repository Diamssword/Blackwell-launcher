const https = require('https');
var request = require('request');
var fs = require('fs');
const { errorMonitor } = require('stream');
const { cp } = require('original-fs');

function fetch(url) {
    return new Promise((resolve, error) => {
        https.get(url, (res) => {
            let body = "";

            res.on("data", (chunk) => {
                body += chunk;
            });

            res.on("end", () => {
                try {
                    let json = JSON.parse(body);
                    resolve(json)
                } catch (err) {
                    error(err)
                };
            });

        }).on("error", (err) => {
            error(err)
        });
    })

}
function dlImage(url) {
    var options = {
        url: url,
        method: "get",
        encoding: null
    };
    return new Promise((resolve, error) => {
        request(options, function (err, response, body) {

            if (err) {
                error(err);
            } else {
                if (body instanceof Buffer) {
                    resolve(body)
                }
                else {
                    error("error")
                }
            }
        });
    });
}
const skinServer = "https://sessionserver.mojang.com/session/minecraft/profile/"
function getHead(uuid) {
    return new Promise((resolve) => {

        fetch(skinServer + uuid).then((rep) => {
            if (rep.properties && rep.properties[0] && rep.properties[0].value) {
                let buff = Buffer.from( rep.properties[0].value,'base64');
               let texturl=JSON.parse(buff.toString());
               if(texturl && texturl.textures && texturl.textures.SKIN && texturl.textures.SKIN.url)
               {
                   let url= texturl.textures.SKIN.url
                   dlImage(url).then((buff)=>{  resolve("data:image/png;base64,"+buff.toString("base64"))})
                   
               }
              
            }
            else
                resolve("assets/head.png");
        }).catch((err) => {
            console.log(err)
            resolve("assets/head.png");
        })
    });
}

function formatProfileForClient() {
    let pro = global.profileManager.profiles
    let res = { selected:  global.profileManager.selectedProfile, profiles: {} }
    for (k in pro) {
        const id=k;
        getHead(pro[id].uuid).then((res1)=>{
            global.send("updateIcon", {id:id,img:res1})
        })
            res.profiles[k] = { name: pro[k].name, uuid: pro[k].uuid}
        
      
    }
   return res;
   
}
module.exports = { fetch, dlImage, formatProfileForClient }