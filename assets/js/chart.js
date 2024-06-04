const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// TODO: comprendre canvas (API ou non ?)

// Used for the line draw:
ctx.padding = 10;


let xMax = canvas.height = canvas.width;
ctx.transform(1, 0, 0, -1, 0, xMax)

let slope = 1.2;
let intercept = 70;

ctx.beginPath();
ctx.moveTo(0, intercept);
ctx.lineTo(xMax, xMax * slope + intercept);
ctx.stroke();