const canvas = document.querySelector("canvas");
const ctx = canvas.getContext('2d');

// for intro motion
let mouseMoved = false;

const pointer = {
  x: .5 * window.innerWidth,
  y: .5 * window.innerHeight };

const params = {
  pointsNumber: 40,
  widthFactor: .3,
  mouseThreshold: .6,
  spring: .4,
  friction: .5 };


const trail = new Array(params.pointsNumber);
for (let i = 0; i < params.pointsNumber; i++) {
  trail[i] = {
    x: pointer.x,
    y: pointer.y,
    dx: 0,
    dy: 0 };

}

window.addEventListener("click", e => {
  updateMousePosition(e.pageX, e.pageY);
});
window.addEventListener("mousemove", e => {
  mouseMoved = true;
  updateMousePosition(e.pageX, e.pageY);
});
window.addEventListener("touchmove", e => {
  mouseMoved = true;
  updateMousePosition(e.targetTouches[0].pageX, e.targetTouches[0].pageY);
});

function updateMousePosition(eX, eY) {
  pointer.x = eX;
  pointer.y = eY;
}

setupCanvas();
update(0);
window.addEventListener("resize", setupCanvas);


function update(t) {

  // for intro motion
  if (!mouseMoved) {
    pointer.x = (.5 + .3 * Math.cos(.002 * t) * Math.sin(.005 * t)) * window.innerWidth;
    pointer.y = (.5 + .2 * Math.cos(.005 * t) + .1 * Math.cos(.01 * t)) * window.innerHeight;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  trail.forEach((p, pIdx) => {
    const prev = pIdx === 0 ? pointer : trail[pIdx - 1];
    const spring = pIdx === 0 ? .4 * params.spring : params.spring;
    p.dx += (prev.x - p.x) * spring;
    p.dy += (prev.y - p.y) * spring;
    p.dx *= params.friction;
    p.dy *= params.friction;
    p.x += p.dx;
    p.y += p.dy;
  });

  ctx.beginPath();
  ctx.moveTo(trail[0].x, trail[0].y);

  for (let i = 1; i < trail.length - 1; i++) {
    const xc = .5 * (trail[i].x + trail[i + 1].x);
    const yc = .5 * (trail[i].y + trail[i + 1].y);
    ctx.quadraticCurveTo(trail[i].x, trail[i].y, xc, yc);
    ctx.lineWidth = params.widthFactor * (params.pointsNumber - i);
    ctx.stroke();
  }
  ctx.lineTo(trail[trail.length - 1].x, trail[trail.length - 1].y);
  ctx.stroke();

  window.requestAnimationFrame(update);
}

function setupCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}const width = 1200
const height = 1000
const padding = 30

const dataset = []					//Initialize empty array
const numDataPoints = 1000			
const deg = 360 / numDataPoints
const radius = 500


for (let i = 0; i < numDataPoints; i++) {					
    const newNumber1 = Math.floor(Math.random() * radius);	
    const newNumber2 = Math.floor(Math.random() * radius);	
    //dataset.push([newNumber1, newNumber2]);					
    dataset.push(newNumber1)
}
    
console.log(dataset)

const svg = d3.select(".mini-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "canvas")
        .style("filter", "url(#gooey)")
        .append("g")
            .attr("class", "goey-circles")

const xPosition = document.querySelector(".canvas").clientWidth / 2
const yPosition = document.querySelector(".canvas").clientHeight / 2 

const colorQuantize = d3.scaleQuantize()
    .domain([0, radius])
    .range(["#fee5d9","#fcbba1","#fc9272","#fb6a4a","#ef3b2c","#cb181d","#99000d"]);

//Make a gooey object
const defs = svg.append('defs');
const filter = defs.append('filter').attr('id','gooey');
filter.append('feGaussianBlur')
    .attr('in','SourceGraphic')
    .attr('stdDeviation','7')
    .attr('result','blur');
filter.append('feColorMatrix')
    .attr('in','blur')
    .attr('mode','matrix')
    .attr('values','1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7')
    .attr('result','gooey');
filter.append('feBlend')
    .attr('in','SourceGraphic')
    .attr('in2','gooey')

function circleTransition() { 

    const timeCircle = svg.selectAll("circle")
        .data(dataset).enter()
        .append("circle")
        .attr("cx", xPosition)
        .attr("cy", yPosition)
        .attr("fill", d => colorQuantize(d))
        .attr("opacity", .5)

    repeat()
    
    function repeat() {
      timeCircle
        .attr("r", 0)
        .transition().duration(3000)
        .attr("r", 7)    
        .attr('cx', (d,i) => Math.round(xPosition + d * Math.cos(i))) 
        .attr('cy', (d,i) => Math.round(yPosition + d * Math.sin(i)))
        // .attr("transform", (d,i) => "rotate(" + i * .005 +")") 
        .transition().duration(1000)
        .attr("r", 15)
        //.on("end", repeat)   // when the transition finishes start again
    }

    svg.append("circle")
        .attr("fill", colorQuantize(5))
        .attr("cx", xPosition)
        .attr("cy", yPosition)
        .attr("r", 10)


};

circleTransition()
    
    




