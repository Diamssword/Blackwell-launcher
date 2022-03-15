const path = require("path");
const fs = require("fs");
const process = require('process');
const FProgress = require('node-fetch-progress');
const fetch = require('node-fetch');
const yauzl = require('yauzl');
const unzip = require('../unziper');
module.exports = { checkJava: checkJava,getPath:getPath };
async function checkJava(mcversion) {
    return new Promise(async(res,rej)=>{
        progress.total(1, 3);
        progress.title("Verification de Java!")
        progress.value(100);
        fs.mkdir(path.join(global.launcherDir, "java"), () => { })
    
        var pj = getPath(mcversion);
        if (!fs.existsSync(pj)) {
            progress.title("Telechargement de Java " + dirpaths[jdkvers(mcversion)]);
            let fetched = await fetch(dlLink(jdkvers(mcversion))).catch(err => { console.log(err) })
            const prog = new FProgress(fetched, { throttle: 100 });
            prog.on("progress", (p) => { progress.value(parseInt(p.progress * 100)) })
            let buf = await fetched.buffer();
            progress.title("Decompression de Java");
            progress.value(0);
            yauzl.fromBuffer(buf, {lazyEntries:true},(err, zip) => {
                unzip(zip, path.join(global.launcherDir, "java"),()=>{
                    res(pj);
                });
            })
        }
        else
            res(pj);
    });
   
}


function dlLink(jdk) {
    var os = process.platform;
    if (platforms[os]) {
        if (platforms[os][jdk])
            return platforms[os][jdk];
    }
    console.error(os + " is not supported for java-auto install!");
    return;
}
function jdkvers(mcVersion)
{
    let mc = Number.parseFloat(mcVersion.substring(2));
    if (mc >= 17) {
       return "17";
    }
    return "8";
}
function getPath(mcVersion) {
  
    var os = process.platform;
    var pj = path.join(global.launcherDir, "java", dirpaths[jdkvers(mcVersion)]);
    if (os == "win32")
        pj = path.join(pj, "bin", "java.exe");
    else if (os == "darwin")
        pj = path.join(pj, "Contents", "Home", "bin", "java");
    else
        pj = path.join(pj, "bin", "java");
    return pj

}
const dirpaths = {
    17: "jdk-17.0.2",
    8: "jdk8u322-b06"
}
const platforms = {
    win32: {
        17: "https://download.java.net/java/GA/jdk17.0.2/dfd4a8d0985749f896bed50d7138ee7f/8/GPL/openjdk-17.0.2_windows-x64_bin.zip",
        8: "https://github.com/adoptium/temurin8-binaries/releases/download/jdk8u322-b06/OpenJDK8U-jdk_x64_windows_hotspot_8u322b06.zip"
    },
    darwin: {
        17: "https://download.java.net/java/GA/jdk17.0.2/dfd4a8d0985749f896bed50d7138ee7f/8/GPL/openjdk-17.0.2_macos-aarch64_bin.tar.gz",  //macOS
        8: "https://github.com/adoptium/temurin8-binaries/releases/download/jdk8u322-b06/OpenJDK8U-jdk_x64_mac_hotspot_8u322b06.tar.gz"
    },
    linux: {
        17: "https://download.java.net/java/GA/jdk17.0.2/dfd4a8d0985749f896bed50d7138ee7f/8/GPL/openjdk-17.0.2_linux-x64_bin.tar.gz",
        8: "https://github.com/adoptium/temurin8-binaries/releases/download/jdk8u322-b06/OpenJDK8U-jdk_x64_linux_hotspot_8u322b06.tar.gz"
    },
};
