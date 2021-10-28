
const {ipcMain} = require("electron");
const auths= require("./authSystems");
const sendLogs = require("./logs").sendAllLogs;
const preLaunch= require("./modpack/manager").readyLaunch;

const game = require('./game');
const formatProfileForClient= require("./utils").formatProfileForClient;

ipcMain.on('open', (event, arg) => {
    if(arg=="microsoft")
    {
        auths.popupMicrosoft((profile)=>{
            global.profileManager.addProfileMicrosoft(profile);
            global.send("updateProfiles", formatProfileForClient());
          });
    }else  if(arg=="mojang")
    {
        auths.popupMojang((profile)=>{
            global.send("updateProfiles", formatProfileForClient());
          });
    }
});


ipcMain.on("requestProfiles", (data) => {
    global.send("getProfiles",   formatProfileForClient())
});
ipcMain.on("launch", (data) => {
   
    global.profileManager.quickLaunch(()=>{return new Promise((resolve)=>{
        resolve({mail:"hdiamssword@gmail.com",pass:"20hesnoqqs"});
      });},(result)=>{
        preLaunch(result)
      });
});
ipcMain.on('pickProfile', (event, arg) => {
            global.profileManager.select(arg);
});
ipcMain.on('deleteProfile', (event, arg) => {
    global.profileManager.delete(arg);
});
ipcMain.on('fetchConsole', (event, arg) => {
    sendLogs();
});