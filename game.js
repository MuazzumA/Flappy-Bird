const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext("2d");
// game container to make it blurry when we display end menu 
const gameContainer = document.getElementById('game-container');

const flappyImg = new Image();
flappyImg.src = 'assets/flappy_dunk.png';

//Game constants
const FLAP_SPEED = -5;
const BIRD_WIDTH = 40;
const BIRD_HEIGHT = 30;
const PIPE_WIDTH = 50;
const PIPE_GAP = 125;

//Bird variables 
let birdX = 50;
let birdY = 50;
let birdVelocity = 0;
let birdAcceleration = 0.1;

//Pipe variables 
let pipeX = 400; 
let pipeY = canvas.height - 200;

//score and highscore variables 
let scoreDiv = document.getElementById('score-display');
let score = 0;
let highScore = 0;

//add bool variable to check when bird passes the value increases
let scored = false;

//control bird with out space key
document.body.onkeyup = function(e) {
  if (e.code == 'Space'){
    birdVelocity = FLAP_SPEED;
  }
}

//when game over, restart game
document.getElementById('restart-button').addEventListener('click', function(){
  hideEndMenu();
  resetGame();
  loop();
})

function increaseScore() {
  //score goes up when bird passes through pipe
  if(birdX > pipeX + PIPE_WIDTH && 
    (birdY < pipeY + PIPE_GAP || 
      birdY + BIRD_HEIGHT > pipeY + PIPE_GAP) &&
      !scored) {
        score++;
        scoreDiv.innerHTML = score;
        scored = true;
      }

      //bird passes --> reset flag
      if (birdX < pipeX + PIPE_WIDTH) {
        scored = false;
      }
}

function collisionCheck() {
  //create bounding Boxes for the bird and the pipes

  const birdBox = {
    x: birdX,
    y: birdY,
    width: BIRD_WIDTH,
    height: BIRD_HEIGHT
  }

  const topPipeBox = {
    x: pipeX,
    y: pipeY - PIPE_GAP + BIRD_HEIGHT,
    width: PIPE_WIDTH,
    height: pipeY
  }

  const bottomPipeBox = {
    x: pipeX,
    y: pipeY + PIPE_GAP + BIRD_HEIGHT,
    width: PIPE_WIDTH,
    height: canvas.height - pipeY - PIPE_GAP
  }

  //checking for collision with upper pipe box 
  if(birdBox.x + birdBox.width > topPipeBox.x &&
    birdBox.x < topPipeBox.x + topPipeBox.width &&
    birdBox.y < topPipeBox.y) {
      return true;
    }

  //checking for collision with lower pipe box 
  if(birdBox.x + birdBox.width > bottomPipeBox.x &&
    birdBox.x < bottomPipeBox.x + bottomPipeBox.width &&
    birdBox.y + birdBox.height > bottomPipeBox.y){
      return true;
    }

  //checking if bird hits boundaries 
  if (birdY < 0 || birdY + BIRD_HEIGHT > canvas.height){
    return true;
  }

  return false;
}

function hideEndMenu(){
  document.getElementById('end-menu').style.display = 'none';
  gameContainer.classList.remove('backdrop-blur');
}

function showEndMenu(){
  document.getElementById('end-menu').style.display = 'block';
  gameContainer.classList.add('backdrop-blur');
  document.getElementById('end-score').innerHTML = score;
  //update high score 
  if (highScore < score) {
      highScore - score;
  }
  document.getElementById('best-score').innerHTML = highScore;
}

//we reset the values to the beginning 
function resetGame(){ 
  birdX = 50;
  birdY = 50;
  birdVelocity = 0;
  birdAcceleration = 0.1;
 
  pipeX = 400; 
  pipeY = canvas.height - 200;

  score = 0; 
   

}

function endGame(){
  showEndMenu();
}

function loop() {
  //reset ctx after every loop iteration
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.height);

  //drawing flappy bird
  ctx.drawImage(flappyImg, birdX, birdY);

  //drawing the pipes
  ctx.fillStyle = '#333';
  ctx.fillRect(pipeX, -100, PIPE_WIDTH, pipeY);
  ctx.fillRect(pipeX, pipeY + PIPE_GAP, PIPE_WIDTH, canvas.height - pipeY);

  //adding a collision check --> display end-menu
  if (collisionCheck()) {
    endGame();
    return;
  }

  //move pipes
  pipeX -= 1.5;
  //reset pipe when out of frame 
  if (pipeX < -50) {
    pipeX = 400;
    pipeY = Math.random() * (canvas.height - PIPE_GAP) + PIPE_WIDTH;

  }


  //applying gravity to the bird and let it move
  birdVelocity += birdAcceleration;
  birdY += birdVelocity;

  increaseScore()
  requestAnimationFrame(loop);
}

loop();

