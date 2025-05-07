const canvas = document.getElementById('sakura-canvas');
const ctx = canvas.getContext('2d');
let width, height;
let petals = [];

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function createPetal() {
  return {
    x: Math.random() * width,
    y: Math.random() * -height,
    r: Math.random() * 4 + 2,
    d: Math.random() * 1 + 0.5,
    drift: Math.random() * 2 - 1,
    angle: Math.random() * Math.PI * 2
  };
}

function drawPetal(petal) {
  ctx.beginPath();
  ctx.fillStyle = 'rgba(255, 182, 193, 0.8)';
  ctx.ellipse(petal.x, petal.y, petal.r, petal.r * 0.9, petal.angle, 0, 2 * Math.PI);
  ctx.fill();
}

function updatePetals() {
  ctx.clearRect(0, 0, width, height);
  petals.forEach((petal, i) => {
    petal.y += petal.d;
    petal.x += Math.sin(petal.angle) * 0.5 + petal.drift;
    petal.angle += 0.01;
    if (petal.y > height || petal.x < -50 || petal.x > width + 50) {
      petals[i] = createPetal();
    }
    drawPetal(petal);
  });
}

function animate() {
  updatePetals();
  requestAnimationFrame(animate);
}

for (let i = 0; i < 50; i++) petals.push(createPetal());
animate();