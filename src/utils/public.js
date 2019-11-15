// 防抖
export function _debounce(fn, delay) {
  var delay = delay || 200;
  var timer;
  return function() {
    var th = this;
    var args = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(function() {
      timer = null;
      fn.apply(th, args);
    }, delay);
  };
}
function Rect(x, y, w, h) {
  return { x: x, y: y, width: w, height: h };
}
function Point(x, y) {
  return { x: x, y: y };
}
// 图标文字
export function _getTextCanvas(text) {
  let width = 4000,
    height = 1200,
    r = 200;
  var rect = Rect(0, 0, width, height);
  var ptA = Point(rect.x + r, rect.y);
  var ptB = Point(rect.x + rect.width, rect.y);
  var ptC = Point(rect.x + rect.width, rect.y + rect.height);
  var ptD = Point(rect.x, rect.y + rect.height);
  var ptE = Point(rect.x, rect.y);

  let canvas = document.createElement("canvas");
  canvas.width = width + 400;
  canvas.height = height + 400;
  let ctx = canvas.getContext("2d");
  let arrText = text;
  ctx.strokeStyle = "#000000";
  ctx.fillStyle = "#4c66c799";
  ctx.lineJoin = "round";
  ctx.lineWidth = 40;
  // ctx.strokeRect(0, 0, width, height);
  ctx.beginPath();
  ctx.moveTo(ptA.x, ptA.y);
  ctx.arcTo(ptB.x, ptB.y, ptC.x, ptC.y, r);
  ctx.arcTo(ptC.x, ptC.y, ptD.x, ptD.y, r);
  ctx.arcTo(ptD.x, ptD.y, ptE.x, ptE.y, r);
  ctx.arcTo(ptE.x, ptE.y, ptA.x, ptA.y, r);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // ctx.fillRect(r, r, width - 2 * r, height - 2 * r);
  ctx.font = 400 + 'px " bold';
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(arrText, width / 2, height / 2);
  // ctx.fillText(arrText[1], width/2,height/2 + 300)
  return canvas;
}
