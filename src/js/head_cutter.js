
function getImageFromUUID(uuid,callback)
{
  let url= Math.random()>0.5?"assets/alex.png":"assets/steve.png"
  getJson(`https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`,(res,err)=>{
  if(!err)
  {
    if(res.properties)
    {
      for(k in res.properties)
      {
        if(res.properties[k].name =="textures")
        {        
         
          let text=readB64(res.properties[k].value);
          if(text.textures && text.textures.SKIN &&text.textures.SKIN.url)
          {
            url=text.textures.SKIN.url;
          }
          break;
        }
      }
    }
    extractHeadFromSkin(url,callback)
  }
  else
  {
    extractHeadFromSkin(url,callback)
  }

  });
}
function readB64(string)
{
 return JSON.parse(Buffer.from(string,'base64'));
}
function getJson(url, callback)
{
  fetch(url)
.then(res => res.json())
.then(out =>
  callback(out))
.catch(err => callback(undefined,err));
}
function extractHeadFromSkin(img,callback)
{
var canvas = document.createElement("canvas")
var ctx = canvas.getContext("2d");
canvas.width=64;
canvas.height=64;
var image = new Image();
image.onload = function() {
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(image, 8, 8,8,8,0,0,64,64);
  ctx.drawImage(image, 40, 8,8,8,0,0,64,64);
  callback(canvas.toDataURL())
};
image.src = img
}