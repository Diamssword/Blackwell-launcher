
const util = require("../../utils");
const path = require("path");
const fs = require("fs");
const md5File = require('md5-file');
const fetch = require('node-fetch');
const FProgress = require('node-fetch-progress');
const forgeLink = require('../manager').getForgeDlLink;
var mainFile;
var route;
var forgeFile;
var syncFile;
var callback;
var md5Map = {};
var concerned = [];
/**
 * 
 * @param {*} mainFile 
 * @param {*} launchcallback with passed launchconfig
 */
module.exports ={load:(confFile, launchcallback) => {

    callback = launchcallback;
    util.fetch(confFile.url).then((res) => {
        mainFile = res;
        route = path.join(global.launcherDir, "instances", mainFile.profile.id);
        if (!fs.existsSync(route))
            fs.mkdirSync(route);
        downloadFiles();
    }, (err) => {
        console.log(err);
    })
},
get:(confFile)=>{
    return new Promise((res,rej)=>{
        util.fetch(confFile.url).then((res1) => {
            let data={
               name:res1.install.name,
               minecraft:res1.install.minecraft,
               desc:res1.install.desc,
               icon:res1.install.icon,
               id:res1.profile.id,
               url:confFile.url,
               loader:"forge"
            }
            res(data);
        }, (err) => {
            rej(err);
        })
    });
  
}
}
function downloadFiles() {
    progress.title("Checking Files...");
    progress.value(10);
    let link = forgeLink(mainFile.install.minecraft, mainFile.install.forge);
    forgeFile = 'forge-' + mainFile.install.minecraft + "-" + mainFile.install.forge + ".jar";
    if (fs.existsSync(path.join(route, forgeFile))) {
        util.fetch(mainFile.install.syncUrl).then(res => {
            syncFile = res;
            getMap();
        })
    }
    else {
        progress.title("Downloading Forge-" + mainFile.install.minecraft + "-" + mainFile.install.forge);
        fetch(link).then(res => {
            const prog = new FProgress(res, { throttle: 100 });
            prog.on("progress", (p) => { progress.value(parseInt(p.progress * 100)) })
            res.buffer().then(
                buf => {
                    fs.writeFile(path.join(route, forgeFile), buf, (err) => {
                        console.log(err)

                        util.fetch(mainFile.install.syncUrl).then(res => {
                            syncFile = res;
                            getMap();
                        })
                    });

                });

        }).catch((err) => {
            console.error("error downloading " + forgeFile);
            console.log(err)
        })
    }


}
function getMap() {
    for (k in syncFile) {
        if (syncFile[k].size == "0") {
            concerned.push(syncFile[k].name);
        }
        else {
            md5Map[syncFile[k].md5] = syncFile[k];
        }
    }
    purgeOldFile();
    for (k in concerned) {
        if (!fs.existsSync(path.join(route, concerned[k])))
            fs.mkdirSync(path.join(route, concerned[k]), { recursive: true });

    }
}
function purgeOldFile() {

    let checked = [];
    for (k in concerned) {
        let dir = path.join(route, concerned[k])

        if (fs.existsSync(dir)) {
            let files = fs.readdirSync(dir)
            for (k in files) {
                const dir2 = path.join(dir, files[k]);
                if (fs.existsSync(dir2) && fs.lstatSync(dir2).isFile()) {
                    let sum = md5File.sync(dir2)
                    if (!md5Map[sum]) {
                        fs.rm(dir2, (err) => { console.error("Could not delete " + dir2) });
                    }
                    else {
                        checked.push(sum);
                    }
                }
            }

        }
    }
    dlFiles(checked)
}
async function dlFiles(noCheckNeeded) {
    let treating = [];

    let treatingCall = () => {
        if (treating.length <= 0)
            callback(createLaunchParams(mainFile));
    }
    var totalOfFiles = Object.keys(md5Map).filter((str) => { return !noCheckNeeded.includes(str) }).length;
    var counterFiles = 0;
    progress.total(counterFiles, totalOfFiles);
    for (k in md5Map) {
        if (!noCheckNeeded.includes(k)) {
            const md5 = k;
            treating.push(md5);
            try {
                var res = await fetch(mainFile.install.syncUrl + md5Map[md5].name);
                progress.title("Téléchargement:" + md5Map[md5].name);
                const prog = new FProgress(res, { throttle: 100 });
                prog.on("progress", (p) => {
                    progress.value(parseInt(p.progress * 100));
                });
                var buf = await res.buffer();
                counterFiles++;
                progress.total(counterFiles, totalOfFiles);
                fs.writeFile(path.join(route, md5Map[md5].name), buf, (err) => {
                    if (err)
                        console.log(err)
                    treating.splice(treating.indexOf(md5), 1);
                    treatingCall();
                });
            } catch (err) {
                console.error("error downloading " + mainFile.install.syncUrl + md5Map[md5].name)
                console.log(err)
            }
        }
    }

}


function createLaunchParams(forgeInstallerData) {
    var launchParams = {
        root: route,
        memory: {

            max: forgeInstallerData.install.JVMarg.replace("-Xmx", ""),
            min: "3G"
        },
        version: {
            number: forgeInstallerData.install.minecraft,
            type: "release",
        }
    }
    if (forgeInstallerData.install.forge) {
        launchParams.forge = path.join(route, forgeFile);
    }
    return launchParams;
}