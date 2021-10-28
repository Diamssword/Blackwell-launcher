const path = require("path");
const fs = require('fs');
global.elecStorage = {
    create:create,
    get: get,
    set: set,
}
module.exports={

    initDefault:initDefault
}
function create(file,storageDir)
{
    return new StorageInstance(file,storageDir);
}

var settings;
function initDefault(launcherdir)
{
    settings=create("settings",launcherdir);
}
function get(key) {
    return settings.get(key);
}
function set(key, value) {
    settings.set(key,value);
}
class StorageInstance {
    constructor(file,launcherDir) {
    this.storage={};
    this.file=this.load(launcherDir?launcherDir:global.launcherDir,file);
    }
    load(launcherdir,file) {
  
            let f1 = path.join(launcherdir, file+".json")
        if (!fs.existsSync(launcherdir))
            fs.mkdirSync(launcherdir);
        if (fs.existsSync(f1)) {
            var res = fs.readFileSync(f1);
            this.storage = JSON.parse(res);
        }
        return f1;
    }

    save()
    {
        fs.writeFileSync(this.file, JSON.stringify(this.storage,undefined,3));
    }
    get(key)
    {
        return this.storage[key];
    }
    set(key,value)
    {
        this.storage[key]=value;
        this.save();
    }
}