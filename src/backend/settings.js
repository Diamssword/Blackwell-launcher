const logger = require("./logs");
const {ipcMain} = require("electron");
const settings=elecStorage.create("settings",global.launcherDir);
module.exports=settings;
ipcMain.on('settings.set', (event, arg) => {
    settings.set(arg[0],arg[1]);
    settings.save();
    if(arg[0]=="console")
    {
        if(arg[1]==true)
        logger.createWindow();
        else
        logger.removeWindow();
    }
});
ipcMain.on('settings.get', (event, arg) => {
   event.reply("settings.get",require("../backend/settings").getAll())
});