
const fetc = require("node-fetch");


function fetch(url) {
    return new Promise((resolve, error) => {
        fetc(url).then(res => {
            resolve(res.json());
        }, err => {
            error(err)
        })
    });
}
function formatProfileForClient() {
    let pro = global.profileManager.profiles
    let res = { selected: global.profileManager.selectedProfile, profiles: {} }

    for (k in pro) {
        const id = k;
        res.profiles[k] = { name: pro[k].name, uuid: pro[k].uuid }


    }
    return res;

}
module.exports = { fetch, formatProfileForClient }