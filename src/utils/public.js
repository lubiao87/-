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
export function _getTextCanvas(text, w, h, R) {
  let width = 4000 || w,
    height = 1200 || h,
    r = 200 || R;
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
// ctx：Canvas绘图环境
// fromX, fromY：起点坐标（也可以换成 p1 ，只不过它是一个数组）
// toX, toY：终点坐标 (也可以换成 p2 ，只不过它是一个数组)
// theta：三角斜边一直线夹角
// headlen：三角斜边长度
// width：箭头线宽度
// color：箭头颜色
export function _drawArrow(w, h) {
  let canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  let x1 = w - 400 + 0,
    y1 = h - 400 + 0,
    x2 = w - 400 + 400,
    y2 = h - 400 + 0,
    x3 = w - 400 + 200,
    y3 = h - 400 + 400,
    color = "#4c66c799",
    type = "fill";
  let ctx = canvas.getContext("2d");
  ctx.lineWidth = w / 4; //设置线宽

  ctx.beginPath(); //开始绘制路径
  ctx.moveTo(w / 2, 0); //移动至起始点
  ctx.lineTo(w / 2, h - 400); //移动至终点
  ctx.strokeStyle = color;
  ctx.stroke(); //绘制
  // ctx.closePath();

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x3, y3);
  ctx[type + "Style"] = color;
  ctx.closePath();
  ctx[type]();
  return canvas;
}
