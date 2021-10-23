const {BrowserWindow} = require("electron")
const path = require("path")
const msmc = require("msmc");
function popupMicrosoft(callBackProfile) {
    msmc.getElectron().FastLaunch(
        (callback) => {
            msmc.getMCLC().getAuth(callback).then((profile)=>{callBackProfile(profile)});
        },
        (update) => {
        }
    )

}
function popupMojang(callBackProfile) {
    const authWin = new BrowserWindow({
        width: 600,
        height: 600,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
      }
      });
      global.on("loginMojang",(ev,args)=>{
          global.profileManager.addProfile(args.mail, args.mdp).then((res)=>{
              authWin.close();
              callBackProfile(res)
          });
      })
      authWin.loadFile(path.join(__dirname, "../mojangAuth.html"));
}
module.exports={popupMicrosoft:popupMicrosoft,popupMojang:popupMojang};