/* VARIABLES */
let tom,tom1, tom2, tom3, tomNormalImg, tomChasingImg;
let jerry, jerryImg;
let pits, pitImg1;
let foods, cheeseImg, cookieImg;
let walls;
let gameOver = false;
let gameWin = false;
let tomChasingDistance = 150; 


/* PRELOAD LOADS FILES */
function preload(){
  tomNormalImg = loadImage("assets/Tom..png");
  tomChasingImg = loadImage("assets/tomChasing.png");
  jerryImg = loadImage("assets/jerry.png");
  pitImg1 = loadImage("assets/pit1.png"); 
  cheeseImg = loadImage("assets/cheese.png");
  cookieImg = loadImage("assets/cookie.png");
}


/* SETUP RUNS ONCE */
function setup() {
  createCanvas(700, 700);
  background("lightyellow");
  
  // create jerry house
  jerryHouse = new Sprite();
  jerryHouse.diameter = 15;
  jerryHouse.x = 701;
  jerryHouse.y = 450;
  jerryHouse.color = "brown";
  jerryHouse.collider = "static";
  
  
  // Create walls group and add wall sprites
  walls = new Group();
  walls.add(new walls.Sprite(320, 110, 10, 220));
  walls.add(new walls.Sprite(160, 300, 320, 10));
  walls.add(new walls.Sprite(315, 439, 10, 270));
  walls.add(new walls.Sprite(200, 570, 240, 10));
  walls.add(new walls.Sprite(450, 153, 10, 305));
  walls.add(new walls.Sprite(625, 300, 170, 10));
  walls.add(new walls.Sprite(520, 610, 10, 190));
  walls.color = "brown";
  walls.collider = "static";

  
  // Create Tom sprites
  tom = new Group();
  tom.add(new tom.Sprite(tomNormalImg,random(20,315), random(20,220)));
  tom.add(new tom.Sprite(tomNormalImg,random(20,310), random(305,565)));
  tom.add(new tom.Sprite(tomNormalImg,random(455,680), random(20,295)));
  tom.scale = 0.05
  tom.rotationLock = true;


  // Create Jerry sprite
  jerry = new Sprite(700, 450 , "dynamic");
  jerry.addImage(jerryImg);
  jerry.scale = 0.03;
  jerry.rotationLock = true;

  
  // Create Pit sprites
  pits = new Group();
  for (let p = 0; p < 3; p++) {
    let pitSprite = new pits.Sprite(random(650), random(height), "static");
    pitSprite.addImage(pitImg1);
    pitSprite.scale = 0.12;
    pits.add(pitSprite);
  }

  
  // Create Food sprites
  foods = new Group();
  for (let f = 0; f < 7; f++) {
    let foodType = random() > 0.5 ? cheeseImg : cookieImg;
    let foodSprite = new foods.Sprite(random(width), random(height), "static");
    foodSprite.addImage(foodType);
    foodSprite.scale = 0.06;
    foods.add(foodSprite);
  }

  
}


/* DRAW LOOP REPEATS */
function draw() {
  background("lightyellow");

 //Game Over 
  
  if (gameOver) {
  background("lightpink")
    fill("red");
    textSize(50);
    textAlign(CENTER);
    text("Game Over", width / 2, height / 2);
    return;
  }

  // Game Win

  if (gameWin){
    background("lightgreen");
    fill("green");
    textSize(50);
    textAlign(CENTER);
    text("You WIN!", width /2, height/2);
    return;
  }

    if (keyIsPressed) {
      if (keyCode === LEFT_ARROW) {
        jerry.vel.x = -3;
      } else if (keyCode === RIGHT_ARROW) {
        jerry.vel.x = 3;
      } else if (keyCode === UP_ARROW) {
        jerry.vel.y = -3;
      } else if (keyCode === DOWN_ARROW) {
        jerry.vel.y = 3;
      } 
    }else {
      jerry.vel.x = 0;
      jerry.vel.y = 0;
    }

  // Boundary check for Jerry
  
  if (jerry.position.x < 0) jerry.position.x = 0;
  if (jerry.position.x > width) jerry.position.x = width;
  if (jerry.position.y < 0) jerry.position.y = 0;
  if (jerry.position.y > height) jerry.position.y = height;


// Tom movement 
  
  tom.forEach(tomSprite => {
    let distanceToTom = dist(jerry.position.x, jerry.position.y, tomSprite.position.x, tomSprite.position.y);
    if (distanceToTom < tomChasingDistance) {
      
      // Tom chases Jerry
      
      let direction = createVector(jerry.position.x - tomSprite.position.x, jerry.position.y - tomSprite.position.y);
      direction.normalize();
      tomSprite.vel.x = direction.x * 1;
      tomSprite.vel.y = direction.y * 1;
    } else {
      
      // Default movement for Tom
      
      if (frameCount % 60 === 0) { // Change direction every second
        tomSprite.vel.x = random(-1, 1);
        tomSprite.vel.y = random(-1, 1);
      }
    }

    // Boundary check for each Tom sprite
    
    if (tomSprite.position.x < 0 ) tomSprite.position.x = 0;
    if (tomSprite.position.x > width) tomSprite.position.x = width;
    if (tomSprite.position.y < 0 ) tomSprite.position.y = 0;
    if (tomSprite.position.y > height) tomSprite.position.y = height;
    
  });

  
  // Check for Jerry colliding with food
  
  jerry.overlaps(foods, function(collector, collected) {
    collected.remove();
  });

  // Check for Jerry colliding with Tom or pits
  
  if (jerry.overlaps(tom) || jerry.overlaps(pits)) {
    gameOver = true;
  }

  // Check for Jerry eat all the food
  
  if (foods.length == 0 && jerry.overlaps(jerryHouse)) {
    gameWin = true;
  }

  // Draw all sprites
  drawSprites();
}
