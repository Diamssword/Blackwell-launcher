
const util = require("../../utils");
const path = require("path");
const fs = require("fs");
const md5File = require('md5-file');
const fetch = require('node-fetch');
const forgeLink = require('../manager').getForgeDlLink;
var mainFile;
var route;
var forgeFile;
var syncFile;
var callback ;
var md5Map={};
var concerned=[];
/**
 * 
 * @param {*} mainFile 
 * @param {*} launchcallback with passed launchconfig
 */
module.exports=(confFile,launchcallback)=>{

    callback=launchcallback;
    util.fetch(confFile.url).then((res)=>{
        mainFile=res;
        route =path.join(global.launcherDir,"instances",mainFile.profile.id);
        if(!fs.existsSync(route))
          fs.mkdirSync(route);
        downloadFiles()
    },(err)=>{ 
        console.log(err);
    })
}

function downloadFiles()
{
    let link =forgeLink(mainFile.install.minecraft,mainFile.install.forge);
    forgeFile ='forge-'+mainFile.install.minecraft+"-"+mainFile.install.forge+".jar";
    if(fs.existsSync(path.join(route,forgeFile)))
    {
        util.fetch(mainFile.install.syncUrl).then(res=>{
            syncFile =res;
            getMap();
        })
    }
    else
    {
        fetch(link).then(async res=>{
            res.buffer().then(buf=>{
                fs.writeFile(path.join(route,forgeFile),buf,(err)=>{
                    console.log(err)
                    
                    util.fetch(mainFile.install.syncUrl).then(res=>{
                        syncFile =res;
                        getMap();
                    })
                });
               
            })
           
        }).catch((err)=>{
            console.log("error downloading "+forgeFile );
            console.log(err)
        })
    }
    
   
}
function getMap()
{
    for(k in syncFile)
    {
        if(syncFile[k].size == "0")
        {
                concerned.push(syncFile[k].name);
        }
        else
        {
            md5Map[syncFile[k].md5]=syncFile[k];
        }
    }
    purgeOldFile();
    for(k in concerned)
    {
        if(!fs.existsSync(path.join(route,concerned[k])))
            fs.mkdirSync(path.join(route,concerned[k]),{recursive:true});

    }
}
function purgeOldFile()
{
    let checked=[];
    for(k in concerned)
    {
        let dir=path.join(route,k)
        if(fs.existsSync(dir))
        {
            let files =fs.readdirSync(dir);
            for(k in files)
            {
                let sum =md5File.sync(k)
                if(!md5Map[sum])
                {
                    fs.rm(k);
                }
                else
                {
                    checked.push(sum);
                }
            }
            
        }
    }
    dlFiles(checked)
}
function dlFiles(noCheckNeeded)
{
    let treating=[];
    
    let treatingCall=()=>{
        if(treating.length<=0)
            callback(createLaunchParams(mainFile));
    }
    for(k in md5Map)
    {
        if(!noCheckNeeded.includes(k))
        {
            const md5=k;
            treating.push(md5);
            fetch(mainFile.install.syncUrl+md5Map[md5].name).then(async res=>{
                res.buffer().then(buf=>{
                    fs.writeFile(path.join(route,md5Map[md5].name),buf,(err)=>{
                       if(err) 
                        console.log(err)
                        treating.splice(treating.indexOf(md5),1);
                        treatingCall();
                    });
                   
                })
               
            }).catch((err)=>{
                console.log("error downloading "+mainFile.install.syncUrl+md5Map[md5].name)
                console.log(err)
            })
        }
    }
  
}


function createLaunchParams(forgeInstallerData)
{
    var launchParams = {
        root:route,
        memory:{
           
            max:forgeInstallerData.install.JVMarg.replace("-Xmx",""),
            min:"1G"
        },
        version:{
            number:forgeInstallerData.install.minecraft,
            type:"release",
       },
       javaPath:"D:/Program Files/AdoptOpenJDK/jdk-8.0.232.09-hotspot/bin/java.exe" //besoin de java 8 pour la 1.12
    }
    if(forgeInstallerData.install.forge)
    {
        launchParams.forge=path.join(route,forgeFile);
    }
    return launchParams;
}