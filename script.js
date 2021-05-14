'use strict';

const canvas = document.getElementById('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var ctx = canvas.getContext('2d');

let score = 0;
let level = 1;
let asteroids = [];
let bullets = [];

let shipRadius = 12;
let shipSpeed = 4;
let shipLives = 3;

let asteroidRadius = 30;
let initialAsteroidsAmaunt = 5;

let bulletWidth = 2;
let bulletHeight = 2;
let bulletSpeed = 8;
let bulletRadius = 2;

const ship = {
  x: ctx.canvas.width / 2,
  y: ctx.canvas.height / 2,
  angle: 90 / 180 * Math.PI,
  acceleratingX: 0,
  acceleratingY: 0,
  speed: shipSpeed,
  radius: shipRadius,
  lives: shipLives,
};

let keys = {
  KeyW: false,
  KeyD: false,
  KeyA: false,
  KeyS: false,
  Space: false
};

for (let i = 0; i < initialAsteroidsAmaunt; i++) {
  asteroids.push(new Asteroid());
}

function Asteroid(x, y, radius) {
  this.x = x || Math.random() * ctx.canvas.width;
  this.y = y || Math.random() * ctx.canvas.height;
  this.radius = radius || asteroidRadius;
  this.velocityX = (Math.random() - 0.5) * 8;
  this.velocityY = (Math.random() - 0.5) * 8;

  this.createAsteroid = function() {
    if (this.x > ctx.canvas.width) {
      this.x = 0;
    }
  
    if (this.x < 0) {
      this.x = ctx.canvas.width;
    }
  
    if(this.y > ctx.canvas.height) {
      this.y = 0;
    }
  
    if (this.y < 0) {
      this.y = ctx.canvas.height;
    }
  
    ctx.strokeStyle = 'White';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0 / 180 * Math.PI, 360 / 180 * Math.PI, false);
    ctx.stroke();
  }

  this.move = function() {
    this.x += this.velocityX;
    this.y += this.velocityY;
    ctx.strokeStyle = 'White';

    this.createAsteroid();
  }
}

function Bullet(angle) {
  this.x = ship.x;
  this.y = ship.y;
  this.id = Math.random();
  this.angle = angle;
  this.width = bulletWidth;
  this.height = bulletHeight;
  this.speed = bulletSpeed;
  this.radius = bulletRadius;

  this.createBullet = function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();
  }

  this.fire = function() {
    this.x += Math.cos(this.angle) * this.speed;
    this.y -= Math.sin(this.angle) * this.speed;

    this.createBullet();
  }
};

window.addEventListener('keydown', (event) => {
  if (event.code === "KeyD") {
    keys.KeyD = true;
  }

  if (event.code === "KeyA") {
    keys.KeyA = true;
  }

  if (event.code === "KeyW") {
    keys.KeyW = true;
  }

  if (event.code === "Space") {
    keys.Space = true;
    bullets.push(new Bullet(ship.angle));
  }
})

window.addEventListener('keyup', (event) => {
  if (event.code === "KeyW") {
    keys.KeyW = false;
  }

  if (event.code === "KeyD") {
    keys.KeyD = false;
  }

  if (event.code === "KeyA") {
    keys.KeyA = false;
  }

  if (event.code === "Space") {
    keys.Space = false;
  }
})

function distanceBetweenPoints(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function update() {
  ctx.font = '20px Times New Roman';
  ctx.fillStyle = 'White';
  ctx.fillText(`Score: ${score}`, 5, 30);

  ctx.font = '20px Times New Roman';
  ctx.fillStyle = 'White';
  ctx.fillText(`Level: ${level}`, 120, 30);

  ctx.font = '20px Times New Roman';
  ctx.fillStyle = 'White';
  ctx.fillText(`Lives: ${ship.lives}`, 245, 30);

  ctx.font = '20px Times New Roman';
  ctx.fillStyle = 'White';
  ctx.fillText(`Controls: W, A, S, D - to move, Space - to fire`, 370, 30);

  if (ship.lives === 0) {
    ctx.font = '20px Times New Roman';
    ctx.fillStyle = 'White';
    ctx.fillText(`Game 0ver`, ctx.canvas.width / 2 - 100 / 2, ctx.canvas.height / 2, 100);
    setTimeout(() => {
      ship.lives = 3;
      ship.x = ctx.canvas.width / 2;
      ship.y = ctx.canvas.height / 2;
      ship.angle = 90 / 180 * Math.PI;
      ship.acceleratingX = 0;
      ship.acceleratingY = 0;
      ship.speed = shipSpeed;
      ship.radius = shipRadius;
      initialAsteroidsAmaunt = 5;
      score = 0;
      level = 1;
    }, 2000)
  } else {

    if (asteroids.length === 0) {
      level++;
      for (let i = 0; i < initialAsteroidsAmaunt + level; i++) {
        asteroids.push(new Asteroid());
      }
    }

    for (let i = 0; i < asteroids.length; i++) {
      if (distanceBetweenPoints(ship.x, ship.y, asteroids[i].x, asteroids[i].y) < ship.radius + asteroids[i].radius) {
        if (ship.lives !== 0) {
          ship.lives -= 1;
          asteroids.splice(i, 1);
          score -= 10;
        } 
      }

      bullets = bullets.filter(bullet => {
        if (
          distanceBetweenPoints(
            bullet.x, bullet.y, asteroids[i].x, asteroids[i].y
          ) < bullet.radius + asteroids[i].radius
        ) {
          if (asteroids[i].radius < asteroidRadius) {
            asteroids.splice(i, 1);
          } else {
            asteroids.push(new Asteroid(asteroids[i].x, asteroids[i].y, 15));
            asteroids.push(new Asteroid(asteroids[i].x, asteroids[i].y, 15));
            asteroids.splice(i, 1);
          }
          score += 10;
          return;
        }

        return bullet;
      });
    }

    if (keys.KeyD) {
      ship.angle = ship.angle + (-ship.speed / 180 * Math.PI);
    }

    if (keys.KeyA) {
      ship.angle = ship.angle + (ship.speed / 180 * Math.PI);
    }

    if (keys.KeyW) {
      ship.acceleratingX += Math.cos(ship.angle) * ship.speed * 0.1;
      ship.acceleratingY -= Math.sin(ship.angle) * ship.speed * 0.1;
    }
    ship.x += ship.acceleratingX * 0.1;
    ship.y += ship.acceleratingY * 0.1;

    if (ship.x > ctx.canvas.width) {
      ship.x = 0;
    }

    if (ship.x < 0) {
      ship.x = ctx.canvas.width;
    }

    if(ship.y > ctx.canvas.height) {
      ship.y = 0;
    }

    if (ship.y < 0) {
      ship.y = ctx.canvas.height;
    }

    ctx.strokeStyle = 'White';
    ctx.beginPath();
    ctx.moveTo(
      ship.x + 4/3 * ship.radius * Math.cos(ship.angle),
      ship.y - 4/3 * ship.radius * Math.sin(ship.angle)
    );
    ctx.lineTo(
      ship.x - ship.radius * (2/3 * Math.cos(ship.angle) + Math.sin(ship.angle)),
      ship.y + ship.radius * (2/3 * Math.sin(ship.angle) - Math.cos(ship.angle))
    );
    ctx.lineTo(
      ship.x - ship.radius * (2/3 * Math.cos(ship.angle) - Math.sin(ship.angle)),
      ship.y + ship.radius * (2/3 * Math.sin(ship.angle) + Math.cos(ship.angle))
    );
    ctx.closePath();
    ctx.stroke();
    
    
    //center
    ctx.fillStyle = "red";
    ctx.fillRect(ship.x - 3/2, ship.y - 3/2, 3, 3);
  }
}

function init() {
  requestAnimationFrame(init);

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  asteroids.map(asteroid => asteroid.move());
  bullets.map(bul => bul.fire());
  update();
}

init();
