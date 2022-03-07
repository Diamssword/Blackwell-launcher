
const {ipcMain} = require("electron");
const settings=elecStorage.create("javaSettings",global.launcherDir);
module.exports=settings;
ipcMain.on('settings.set', (event, arg) => {
    settings.set(arg[0],arg[1]);
    settings.save();
});