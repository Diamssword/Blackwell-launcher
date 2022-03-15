const settings = require("./settings");
const path = require('path');
const fs = require('fs');
const { ipcMain } = require("electron");
const PACKS = [];
var INSTALLED = [];
module.exports = { getPacks: getPacks, initCom: initCom,getPack:getPack };
function getPacks() {
    let addiPacks = settings.get("packs");
     INSTALLED = settings.get("packsInstalled");
    if (!INSTALLED)
        settings.set("packsInstalled", INSTALLED = []);
    let rlPath = path.join(__dirname, '..', 'modpack.json');
    if (!fs.existsSync(rlPath))                  //load file on compiled environement
        rlPath = path.join(process.resourcesPath, 'modpack.json')
    let source = JSON.parse(fs.readFileSync(rlPath));
    if (addiPacks) {
        source = source.concat(addiPacks);
        source = source.filter((v, i1, a) => {
            for (i = 0; i < a.length; i++) {
                if (i != i1 && v.id == a[i].id) {
                    return false;
                }
            }
            return true;

        })
    }
    var flag=source.length<2;
    for (k in source) {
        try {
            const loader = require("./modpack/loaderTypes/" + source[k].type);
            if (loader) {
                loader.get(source[k]).then((val) => {
                    for (l in INSTALLED) {
                        if (INSTALLED[l] == val.id) {
                            val.dir = INSTALLED[l];
                            break;
                        }
                    }
                    PACKS.push(val);
                    if(flag)
                    {
                        if(INSTALLED.indexOf(val.id)==-1)
                        {
                        INSTALLED.push(val.id);
                        settings.set("packsInstalled", INSTALLED);  
                        settings.set("packSelected",val.id);
                        settings.save()
                        }
                    }
                    refresh();
                })
            }
        } catch (err) {
            console.log(err)
            console.log("PackLoaderException: can't find type '" + source.type + "' loader!")
        }
    }
}
function getPack()
{
    let pid=settings.get("packSelected");
    for(k in PACKS)
    {
        if (pid == PACKS[k].id) {
            return PACKS[k];

        }
    }    
    for(k in PACKS)
    {
        if (INSTALLED[0] == PACKS[k].id) {
            return PACKS[k];

        }
    }    
}
function getInstalleds()
{
    let p=[];
    for(k in PACKS)
    {
        for (l in INSTALLED) {
            if (INSTALLED[l] == PACKS[k].id) {
                p.push(PACKS[k]);
                break;
            }
        }
    }
    return p;
}
var Window;
function initCom(window) {
    Window = window;
    ipcMain.on("selectPack",(ev,ob)=>{
        settings.set("packSelected", ob);
        settings.save();
    })
    ipcMain.on("getSelectPack",(ev)=>{
      
        ev.reply("getSelectPack",getInstalleds(),INSTALLED);
    });
    ipcMain.on("getPacks", (ev, ob) => {
        ev.reply("getPacks", PACKS)
    })
    ipcMain.on("installPack", (ev, ob) => {
        for (k in PACKS) {
            if (PACKS[k].id = ob) {
                INSTALLED.push(PACKS[k].id);
                settings.set("packsInstalled", INSTALLED);
                settings.set("packSelected", ob);
                settings.save();
                break;
            }
        }
        refresh();
    })
    ipcMain.on("deletePack", (ev, ob) => {
        if(INSTALLED.indexOf(ob)>-1)
        {
        INSTALLED.splice(INSTALLED.indexOf(ob), 1)
        settings.set("packsInstalled", INSTALLED);
        }
        if (settings.get("packSelected") == ob)
            settings.set("packSelected", undefined);
        settings.save();
        route = path.join(global.launcherDir, "instances", ob);
        fs.rmSync(route, { recursive: true, force: true });
        refresh();
    })
}
function refresh() {
  
    if (Window)
        Window.webContents.send("getPacks", PACKS);
    global.send("getSelectPack",getInstalleds(), settings.get("packSelected"));
    
}
