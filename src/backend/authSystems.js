const {BrowserWindow} = require("electron")
const path = require("path")
const msmc = require("msmc");
const fetch = require("node-fetch");
//msmc's testing enviroment sometimes runs into this issue that it can't load node fetch
msmc.setFetch(fetch)
function popupMicrosoft(callBackProfile) {
    msmc.fastLaunch("electron",
        (update) => {

        },"select_account",
    ).then(  (callback) => {
        callBackProfile(msmc.getMCLC().getAuth(callback))
    },(err)=>{
        console.log(err)
    })

}
function popupMojang(callBackProfile) {
    const authWin = new BrowserWindow({
        width: 400,
        height: 600,
        frame: false,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
      }
      });
      authWin.setResizable(false);
      authWin.setMenu(null);
      global.on("loginMojang",(ev,args)=>{
          global.profileManager.addProfile(args.mail, args.mdp).then((res)=>{
              authWin.close();
              callBackProfile(res)
          });
      })
      authWin.loadFile(path.join(__dirname, "../mojangAuth.html"));
}
module.exports={popupMicrosoft:popupMicrosoft,popupMojang:popupMojang};