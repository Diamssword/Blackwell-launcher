
const { Authenticator } = require('minecraft-launcher-core');
const msmcRefresh = require("msmc").getMCLC().refresh;
module.exports = class ProfileManager {
  constructor(failedCallback) {
    this.failedCallback = failedCallback;
    this.loadProfiles();
  }
  quickLaunch(PromiseIdsCallback, launchCallback) {
    this.autoAuth().then((res) => {
      launchCallback(res);
    }, (err) => {
      console.log(err)
      PromiseIdsCallback("mail").then((res1) => {

        this.addProfile(res1.mail, res1.pass).then((res2) => {
          launchCallback(res2);
        }, (err2) => {
          console.log(err2)
        })
      })
    });
  }
  loadProfiles() {
    this.storage=elecStorage.create("accounts");
    this.profiles = this.storage.get("profiles");
    if (!this.profiles)
      this.profiles = {}
    this.selectedProfile = this.storage.get("selected");

    if (Object.keys(this.profiles).length <= 0) {
      this.failedCallback();
      return;
    }
    if (!this.selectedProfile || !this.profiles[this.selectedProfile]) {
      this.selectedProfile = this.profiles[Object.keys(this.profiles)[0]];
      this.storage.set("selected", this.selectedProfile)
    }
  }
  saveProfiles() {
    this.storage.set("profiles", this.profiles)
    this.storage.set("selected", this.selectedProfile)
  }
  autoAuth() {
    return new Promise((resolve, reject) => {
      let profile = this.profiles[this.selectedProfile];
      let promise;
      if (profile.isMicrosoft == true)
        promise = msmcRefresh(profile,(up)=>{
          progress.total(1, 1);
          progress.title("Authentification...")
          progress.value(up.percent);
        });
      else
        promise = Authenticator.refreshAuth(profile.access_token, profile.client_token, profile);
      promise.then((success) => {

        console.log(success)
        resolve(success);
      }, (err) => {
        console.log(err)
        reject(err);
      })
    });
  }
  select(id) {
    if (this.profiles[id])
      this.selectedProfile = id;
    this.saveProfiles()

  }
  delete(id) {
   delete this.profiles[id];
      if(this.selectedProfile == id)
      {
        for(k in this.profiles)
        {
          this.selectedProfile= k;
          break;
        }
      }
    this.saveProfiles()

  }

  addProfile(mail, pass) {
    return new Promise((resolve, reject) => {
      Authenticator.getAuth(mail, pass).then((success) => {
        this.profiles[success.name] = success;
        this.selectedProfile = success.name;
        this.saveProfiles();
        resolve(success);
      }, (err) => {
        reject(err);
      })
    });
  }
  addProfileMicrosoft(profile) {
    profile.isMicrosoft = true;
    this.profiles[profile.name] = profile;
    this.selectedProfile = profile.name;
    this.saveProfiles();
  }
}

