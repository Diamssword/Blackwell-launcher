global.elecStorage={
load:load,
get:get,
set:set
}
const fs=require('fs');
var storage={};
function load()
{
    if(fs.existsSync("storage.json"))
    {
var res= fs.readFileSync("storage.json");
storage=JSON.parse(res);
}
}
function get(key)
{
    return storage[key];
}
function set(key,value)
{
    storage[key]= value;
    save();
}
function save()
{
    fs.writeFileSync("storage.json",JSON.stringify(storage));
}