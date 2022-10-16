"use strict";
const select = document.querySelector(".select");

////
////
////////////------Generating Canvas--------/////////////
const makeCanvas = function (x, y) {
  const canvasContainer = document.querySelector(".canvas--container");
  canvasContainer.removeChild(canvasContainer.firstChild);
  const ChildEl = `<div class="canvas"></div>`;
  canvasContainer.insertAdjacentHTML("afterbegin", ChildEl);

  const canvas = document.querySelector(".canvas");
  let html = "";
  canvas.style.width = `${(x + 1) * 30}px`;
  canvas.style.height = `${(y + 1) * 30}px`;

  for (let i = 0; i <= y; i++) {
    for (let j = 0; j <= x; j++) {
      html += `<div class='item item--${j}_${i}'><p class='level'>${j},${i}<p></div>`;
    }
  }
  canvas.insertAdjacentHTML("beforeend", html);
};

////
////
//////////////------Draw on canvas------////////////
const draw = function (x, y) {
  if (!document.querySelector(`.item--${x}_${y}`)) return;
  document.querySelector(`.item--${x}_${y}`).style.backgroundColor = "red";
};

// //////////////---First we are creating the canvas (just to show user)---////////
makeCanvas(5, 5);

//////////////------DDA Line Algo------////////////////
const dda = function (x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  let steps;

  if (Math.abs(dx) > Math.abs(dy)) steps = Math.abs(dx);
  else steps = Math.abs(dy);

  const x_inc = dx / steps;
  const y_inc = dy / steps;
  let x = x1;
  let y = y1;

  makeCanvas(x1 > x2 ? x1 : x2, y1 > y2 ? y1 : y2);

  draw(x1, y1);
  for (let i = 0; i < steps; i++) {
    x += x_inc;
    y += y_inc;
    draw(Math.round(x), Math.round(y));
  }
};

//////////////--------Bresenham's Line algorithm---------////
const BresenhamLine = function (x1, y1, x2, y2) {
  //case: when right coordinate is given first.
  // we simply interchange the coordinates
  if (x1 > x2) {
    let temp;
    temp = x1;
    x1 = x2;
    x2 = temp;

    temp = y1;
    y1 = y2;
    y2 = temp;
  }

  //case: For negative slop,
  //We are going to mirror the line to have a positive slop
  if (y1 > y2) {
    y1 = -y1;
    y2 = -y2;
  }

  const dx = x2 - x1;
  const dy = y2 - y1;

  let x = x1;
  let y = y1;

  makeCanvas(
    x1 > x2 ? x1 : x2,
    Math.abs(y1) > Math.abs(y2) ? Math.abs(y1) : Math.abs(y2)
  );

  if (dx > dy) {
    const dS = 2 * dy;
    const dT = 2 * (dy - dx);
    let di = 2 * dy - dx;
    draw(x1, Math.abs(y1));

    for (let i = 0; i < dx; i++) {
      x = x + 1;
      if (di < 0) di = di + dS;
      else {
        y = y + 1;
        di = di + dT;
      }
      draw(x, Math.abs(y));
    }
  }
  //////
  else {
    const dS = 2 * dx;
    const dT = 2 * (dx - dy);
    let di = 2 * dx - dy;
    draw(x1, Math.abs(y1));

    for (let i = 0; i < dy; i++) {
      y = y + 1;
      if (di < 0) di = di + dS;
      else {
        x = x + 1;
        di = di + dT;
      }
      draw(x, Math.abs(y));
    }
  }
};

////
////
////////-------------Bresenham Circle---------//////////////
const BresenhamCircle = function (r, h, k) {
  let x = 0;
  let y = r;
  let d = 3 - 2 * r;

  makeCanvas(h + r, k + r);

  while (x <= y) {
    draw(x + h, y + k);
    if (d < 0) d = d + 4 * x + 6;
    else {
      d = d + 4 * (x - y) + 10;
      y--;
    }
    x++;
  }
};

///
////
/////////---------APP DRAW BUTTON-----///////////////
const drawButton = document.querySelector(".btn");
drawButton.addEventListener("click", function () {
  const x1 = document.getElementById("x1").value;
  const y1 = document.getElementById("y1").value;
  const x2 = document.getElementById("x2").value;
  const y2 = document.getElementById("y2").value;
  const radius = document.getElementById("radius").value;
  const algo = document.getElementById("select-algo").value;
  const h = document.getElementById("h").value;
  const k = document.getElementById("k").value;

  const X1 = Number(x1);
  const Y1 = Number(y1);
  const X2 = Number(x2);
  const Y2 = Number(y2);
  const R = Number(radius);
  const H = Number(h);
  const K = Number(k);

  if (algo === "dda-line" && fourInputValidation(x1, y1, x2, y2))
    dda(X1, Y1, X2, Y2);
  ///
  else if (algo === "bresenham-line" && fourInputValidation(x1, y1, x2, y2))
    BresenhamLine(X1, Y1, X2, Y2);
  else if (
    algo === "bresenham-circle" &&
    oneInputValidation(radius) &&
    twoInputValidation(h, k)
  )
    BresenhamCircle(R, H, K);
  else return;
});

///
///
///

///////////////////---------Changing Select Option-----------//////////////////
select.addEventListener("change", () => {
  const fourInputForm = document.querySelectorAll(".four-input-form");
  const radiusForm = document.getElementById("radius-input-form");
  const twoInputForm = document.getElementById("two-input-form");

  document.getElementById("x1").value = "";
  document.getElementById("y1").value = "";
  document.getElementById("x2").value = "";
  document.getElementById("y2").value = "";
  document.getElementById("radius").value = "";
  document.getElementById("h").value = "";
  document.getElementById("k").value = "";

  if (select.value === "bresenham-circle") {
    fourInputForm.forEach((form) => {
      form.style.display = "none";
    });
    radiusForm.style.display = "block";
    twoInputForm.style.display = "flex";
  }
  ///
  else {
    fourInputForm.forEach((form) => {
      form.style.display = "flex";
    });
    radiusForm.style.display = "none";
    twoInputForm.style.display = "none";
  }
});

/////
/////
/////
/////
/////////////--------Input Validation--------//////////////

////
////
//////////-------Four Input-------/////////
const fourInputValidation = function (x1, y1, x2, y2) {
  let X1;
  let Y1;
  let X2;
  let Y2;

  X1 = Number(x1);
  Y1 = Number(y1);
  X2 = Number(x2);
  Y2 = Number(y2);

  if (
    isNaN(X1) ||
    isNaN(Y1) ||
    isNaN(X2) ||
    isNaN(Y2) ||
    X1 < 0 ||
    Y1 < 0 ||
    X2 < 0 ||
    Y2 < 0 ||
    x1.trim().length === 0 ||
    y1.trim().length === 0 ||
    x2.trim().length === 0 ||
    y2.trim().length === 0
  ) {
    alert("Please provide valid input");
    return false;
  }

  return true;
};

////
////
///////////---------Two Input-------/////////////
const twoInputValidation = function (x, y) {
  let X;
  let Y;
  X = Number(x);
  Y = Number(y);

  if (
    isNaN(X) ||
    isNaN(Y) ||
    X < 0 ||
    Y < 0 ||
    x.trim().length === 0 ||
    y.trim().length === 0
  ) {
    alert("Please provide valid input");
    return false;
  }
  return true;
};

/////
/////
//////////--------One Input--------////////
const oneInputValidation = function (x) {
  let X;
  X = Number(x);

  if (isNaN(X) || X <= 0 || x.trim().length === 0) {
    alert("Please provide valid input");
    return false;
  }
  return true;
};
