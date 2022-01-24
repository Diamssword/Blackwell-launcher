const {app} = require("electron");
const path = require("path");
const util = require("../utils");
const game = require("../game");
const fs= require("fs");
const { off } = require("process");
var mainFile;
module.exports={
    readyLaunch,
    getForgeDlLink
}
async function readyLaunch(auths)
{
    if(!fs.existsSync(path.join(global.launcherDir,"instances")))
    fs.mkdirSync(path.join(global.launcherDir,"instances"));
    let jpath= await getJavaPath();
    console.log(jpath);
    let rlPath=path.join(__dirname, '..','..','modpack.json');
    if(!fs.existsSync(rlPath))                  //load file on compiled environement
       rlPath= path.join(process.resourcesPath, 'modpack.json')
    let source=JSON.parse(fs.readFileSync(rlPath));
    try{
    const loader =require("./loaderTypes/"+source.type);
    if(loader)
    loader(source,(opts)=>{
        
        opts.javaPath=path.join(jpath,"bin","java.exe");
        game.launch(auths,opts)
    });
    }catch(err)
    {
        console.log(err)
        console.log("PackLoaderException: can't find type '"+source.type+"' loader!")
    }
    
}
function getJavaPath()
{
    return new Promise((res,err)=>{
        let path=global.elecStorage.get("java_path");
        if(!path)
        path="default";
        if(path =="default")
        {
            require('find-java-home')(function(err1, home){
                if(err1)
                return res()
                res(home);
                
              });
        }
        else
        {
            res(path);
        }
    })
   
   
}
function getForgeDlLink(mcVersion,forgeVersion)
{

    let mc =Number.parseFloat(mcVersion.substring(2))
    
    if(mc<=6)
    {
        return `https://maven.minecraftforge.net/net/minecraftforge/forge/${mcVersion}-${forgeVersion}/forge-${mcVersion}-${forgeVersion}-universal.zip`
    }
    if(mc<13)
    {
        if(mc>=12)
        {
            let fV = forgeVersion.split(".");
            let forgeV =Number.parseInt(fV[3])
            if(forgeV >2847) //in the precise case of 1.12 last forge versions passed on installer only
            {
                return `https://maven.minecraftforge.net/net/minecraftforge/forge/${mcVersion}-${forgeVersion}/forge-${mcVersion}-${forgeVersion}-installer.jar`
            }
        }
        return `https://maven.minecraftforge.net/net/minecraftforge/forge/${mcVersion}-${forgeVersion}/forge-${mcVersion}-${forgeVersion}-universal.jar`
    }
    else
    {
        return `https://maven.minecraftforge.net/net/minecraftforge/forge/${mcVersion}-${forgeVersion}/forge-${mcVersion}-${forgeVersion}-installer.jar`
    }
}

