const path = require("path");
const game = require("../game");
const fs = require("fs");
const jSettings = require("../settings");
const packMan = require("../packsManager");
const javaManager = require("./javaManager");
module.exports = {
    readyLaunch,
    getForgeDlLink
}
async function readyLaunch(auths) {
    if (!fs.existsSync(path.join(global.launcherDir, "instances")))
        fs.mkdirSync(path.join(global.launcherDir, "instances"));

    let source = packMan.getPack();
    console.log(source);
    var jpath = await getJavaPath(source.minecraft);
    console.info("JAVA PATH: ", jpath);
    let rlPath = path.join(__dirname, '..', '..', 'modpack.json');
    if (!fs.existsSync(rlPath))                  //load file on compiled environement
        rlPath = path.join(process.resourcesPath, 'modpack.json')
    try {
        const loader = require("./loaderTypes/" + source.loader);
        if (loader)
            loader.load(source, (opts) => {

                if (!jpath.endsWith("java.exe"))
                    opts.javaPath = path.join(jpath, "bin", "java.exe");
                else
                    opts.javaPath = jpath;
                var ram = jSettings.get("ram")
                if (ram) {
                    if (!isNaN(ram)) {
                        opts.memory.max = ram + "G";
                    }
                }

                progress.total(1, 1);
                progress.title("Lancement!")
                progress.value(100);
                game.launch(auths, opts)
            });
    } catch (err) {
        console.log(err)
        console.log("PackLoaderException: can't find type '" + source.loader + "' loader!")
    }

}
async function getJavaPath(mc) {


    let jpath = javaManager.getPath(mc);


    let path = jSettings.get("javaPath");
    if (!path || path.length < 2)
        path = "default";
    if (path == "default") {
        jpath = await javaManager.checkJava(mc);;
        jSettings.set("javaPath", jpath);
        return jpath;
    }
    else if (path == jpath) {
        return await javaManager.checkJava(mc);
    }
    return (path);
}
function getForgeDlLink(mcVersion, forgeVersion) {

    let mc = Number.parseFloat(mcVersion.substring(2))

    if (mc <= 6) {
        return `https://maven.minecraftforge.net/net/minecraftforge/forge/${mcVersion}-${forgeVersion}/forge-${mcVersion}-${forgeVersion}-universal.zip`
    }
    if (mc < 13) {
        if (mc >= 12) {
            let fV = forgeVersion.split(".");
            let forgeV = Number.parseInt(fV[3])
            if (forgeV > 2847) //in the precise case of 1.12 last forge versions passed on installer only
            {
                return `https://maven.minecraftforge.net/net/minecraftforge/forge/${mcVersion}-${forgeVersion}/forge-${mcVersion}-${forgeVersion}-installer.jar`
            }
        }
        return `https://maven.minecraftforge.net/net/minecraftforge/forge/${mcVersion}-${forgeVersion}/forge-${mcVersion}-${forgeVersion}-universal.jar`
    }
    else {
        return `https://maven.minecraftforge.net/net/minecraftforge/forge/${mcVersion}-${forgeVersion}/forge-${mcVersion}-${forgeVersion}-installer.jar`
    }
}

