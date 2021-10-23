

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