
const {ipcMain} = require("electron");
const auths= require("./authSystems");
const sendLogs = require("./logs").sendAllLogs;
const preLaunch= require("./modpack/manager").readyLaunch;
const {BrowserWindow} =require('electron')
const path = require('path');
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
    else  if(arg=="settings")
    {
       var settingsWin = new BrowserWindow({
            width: 400,
            height: 600,
            frame: false,
            webPreferences: {
              nodeIntegration: true,
              contextIsolation: false,
          }
          });
          settingsWin.setResizable(false);
     //     settingsWin.setMenu(null);
          
          settingsWin.loadFile(path.join(__dirname, "../java_manager.html"));
          settingsWin.webContents.send("settings.get",require("../backend/settings").getAll())
    }
});


ipcMain.on("requestProfiles", (data) => {
    global.send("getProfiles",   formatProfileForClient())
});
ipcMain.on("launch", (data) => {
   
    global.profileManager.quickLaunch(()=>{return new Promise((resolve)=>{
        resolve({mail:"TODO",pass:"1234"});
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