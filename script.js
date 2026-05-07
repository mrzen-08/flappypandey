const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

/* ================= IMAGES ================= */

const bg = new Image();
bg.src = "assets/background.png";

const birdImg = new Image();
birdImg.src = "assets/bird.png";

const pipeImg = new Image();
pipeImg.src = "assets/pipe.png";

const coinImg = new Image();
coinImg.src = "assets/coin.png";

const coinImg1 = new Image();
coinImg1.src = "assets/coin1.png";

/* ================= SOUNDS ================= */

const pipeHit = new Audio("assets/pipehit.mp3");

const dialogue = new Audio("assets/dialogue.mp3");
const dialogue1 = new Audio("assets/dialogue1.mp3");

const song = new Audio("assets/song.mp3");

song.loop = true;
song.volume = 0.5;

/* ================= GAME VARIABLES ================= */

let score = 0;

let gameStarted = false;
let gameOver = false;

let bird = {

  x: 100,
  y: 200,

  width: 300,
  height: 300,

  gravity: 0.6,
  velocity: 0,

  lift: -14

};

let pipes = [];
let coins = [];

/* ================= BUTTONS ================= */

const startBtn =
document.getElementById("startBtn");

const restartBtn =
document.getElementById("restartBtn");

const gameOverBox =
document.getElementById("gameOverBox");

/* ================= START GAME ================= */

startBtn.addEventListener("click", () => {

  gameStarted = true;

  startBtn.style.display = "none";

  song.play();

});

/* ================= RESTART ================= */

restartBtn.addEventListener("click", () => {

  location.reload();

});

/* ================= TOUCH CONTROL ================= */

document.addEventListener(
  "touchstart",
  (e) => {

    e.preventDefault();

    if(gameStarted && !gameOver){

      bird.velocity = bird.lift;

    }

  },
  { passive:false }
);

/* ================= CREATE PIPES ================= */

function createPipe(){

  if(!gameStarted || gameOver) return;

  let gap = 1000;

  let topHeight =
    Math.random() *
    (canvas.height - gap - 100)
    + 50;

  pipes.push({

    x: canvas.width,

    top: topHeight,

    bottom:
      canvas.height -
      topHeight -
      gap,

    width: 40

  });

}

/* BIG DISTANCE BETWEEN PIPES */

setInterval(createPipe, 5000);

/* ================= CREATE COINS ================= */

function createCoin(){

  if(!gameStarted || gameOver) return;

  let type =
    Math.random() < 0.5 ? 1 : 2;

  coins.push({

    x: canvas.width,

    y:
      Math.random() *
      (canvas.height - 350),

    size: 300,

    type: type

  });

}

setInterval(createCoin, 5000);

/* ================= RANDOM DIALOGUES ================= */

setInterval(() => {

  if(!gameStarted || gameOver) return;

  let randomDialogue =
    Math.random() < 0.5
    ? dialogue
    : dialogue1;

  randomDialogue.currentTime = 0;

  randomDialogue.play();

}, 10000);

/* ================= GAME OVER ================= */

function endGame(){

  if(gameOver) return;

  gameOver = true;

  /* STOP ALL AUDIO */

  song.pause();
  song.currentTime = 0;

  dialogue.pause();
  dialogue.currentTime = 0;

  dialogue1.pause();
  dialogue1.currentTime = 0;

  /* PLAY PIPE HIT */

  pipeHit.currentTime = 0;
  pipeHit.play();

  /* SHOW GAME OVER SCREEN */

  setTimeout(() => {

    gameOverBox.style.display = "flex";

  }, 500);

}

/* ================= UPDATE ================= */

function update(){

  if(!gameStarted || gameOver) return;

  bird.velocity += bird.gravity;

  bird.y += bird.velocity;

  /* FLOOR */

  if(
    bird.y + bird.height >
    canvas.height
  ){

    bird.y =
      canvas.height -
      bird.height;

    endGame();

  }

  /* CEILING */

  if(bird.y < 0){

    bird.y = 0;

  }

  /* PIPES */

  pipes.forEach(pipe => {

    pipe.x -= 3;

    /* COLLISION */

    if(

      bird.x <
      pipe.x + pipe.width &&

      bird.x + bird.width >
      pipe.x &&

      (

        bird.y < pipe.top ||

        bird.y + bird.height >
        canvas.height - pipe.bottom

      )

    ){

      endGame();

    }

    /* SCORE */

    if(pipe.x + pipe.width === bird.x){

      score++;

    }

  });

  /* COINS */

  coins.forEach((coin,index) => {

    coin.x -= 3;

    if(

      bird.x <
      coin.x + coin.size &&

      bird.x + bird.width >
      coin.x &&

      bird.y <
      coin.y + coin.size &&

      bird.y + bird.height >
      coin.y

    ){

      if(coin.type === 1){

        score += 1;

      }else{

        score += 5;

      }

      coins.splice(index,1);

    }

  });

}

/* ================= DRAW ================= */

function draw(){

  ctx.drawImage(

    bg,

    0,
    0,

    canvas.width,
    canvas.height

  );

  /* BIRD */

  ctx.drawImage(

    birdImg,

    bird.x,
    bird.y,

    bird.width,
    bird.height

  );

  /* PIPES */

  pipes.forEach(pipe => {

    ctx.drawImage(

      pipeImg,

      pipe.x,
      0,

      pipe.width,
      pipe.top

    );

    ctx.drawImage(

      pipeImg,

      pipe.x,
      canvas.height - pipe.bottom,

      pipe.width,
      pipe.bottom

    );

  });

  /* COINS */

  coins.forEach(coin => {

    let img =
      coin.type === 1
      ? coinImg
      : coinImg1;

    ctx.drawImage(

      img,

      coin.x,
      coin.y,

      coin.size,
      coin.size

    );

  });

  /* SCORE */

  ctx.fillStyle = "white";

  ctx.font = "60px Arial";

  ctx.fillText(

    "Score: " + score,

    20,
    70

  );

}

/* ================= GAME LOOP ================= */

function gameLoop(){

  ctx.clearRect(

    0,
    0,

    canvas.width,
    canvas.height

  );

  update();

  draw();

  requestAnimationFrame(gameLoop);

}

gameLoop();