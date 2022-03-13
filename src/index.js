const { app, BrowserWindow,ipcMain, systemPreferences } = require('electron');
const path = require('path');

global.launcherDir= path.join(app.getPath('appData'),".owl_launcher");
const storage =require('./backend/storage');
const settings =require('./backend/settings');
 const logger =require('./backend/logs');
 logger.init();
const formatProfileForClient =require('./backend/utils').formatProfileForClient;
require('./backend/events');
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

storage.initDefault(global.launcherDir);
require("./backend/settings")
const ProfileManager =require('./backend/auth');
let manager=new ProfileManager((err)=>{console.log(err)});
global.profileManager=manager;
manager.loadProfiles();
require("./backend/packsManager").getPacks();
require("./backend/packsManager").initCom();
const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
  }
  });
  mainWindow.setResizable(false);
  //mainWindow.setMenu(null);
  mainWindow.on('closed',()=>{
    app.quit();
  });
  if(settings.get("console"))
    logger.createWindow();
    mainWindow.moveTop();
  // and load the index.html of the app.

  mainWindow.loadFile(path.join(__dirname, './index.html'));
global.send =(channel,message)=>{ 
  mainWindow.webContents.send(channel,message)
}
global.on = (channel,callback)=>{
 ipcMain.on(channel,callback) 
}

formatProfileForClient();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
global.progress={title:(title)=>
{
    global.send("progress.title",title)
},
value:(progress)=>
{
    global.send("progress.progress",progress)
},
total:(etape,total)=>{
  global.send("progress.total",[etape,total]);
}}


