var trex, trex_running;
var groundImage;
var solo, soloInvisivel;
var nuvem, nuvemimagem
var cacto, cacto1, cacto2, cacto3, cacto4, cacto5, cacto6
var placar
var grupo_cactos
var grupo_nuvens
var estado_do_jogo = "play"
var gameOver
var gameOverImg
var restart
var restartImg
var morrer
var checkpoint
var pular

function preload(){
  trex_running = loadAnimation('trex1.png','trex3.png','trex4.png');
  groundImage = loadImage('ground2.png')
  nuvemimagem = loadImage('cloud.png')
  cacto6 = loadImage('obstacle6.png')
  cacto5 = loadImage('obstacle5.png')
  cacto4 = loadImage('obstacle4.png')
  cacto3 = loadImage('obstacle3.png')
  cacto2 = loadImage('obstacle2.png')
  cacto1 = loadImage('obstacle1.png')
  trex_morto = loadAnimation('trex_collided.png')
  restartImg = loadImage('restart.png')
  gameOverImg = loadImage('gameOver.png')
  morrer = loadSound('die.mp3')
  pular = loadSound('jump.mp3')
  checkpoint = loadSound('checkpoint.mp3')
}

function setup(){
  createCanvas(windowWidth,windowHeight);
  trex = createSprite(50,windowHeight-40,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("morto", trex_morto);

  solo = createSprite(200,windowHeight-20,400,10)
  solo.velocityX = -4
  solo.addImage(groundImage)
  soloInvisivel = createSprite(200,windowHeight-10,400,10)
  soloInvisivel.visible = false

  trex.scale = 0.5;
  trex.x = 50
  placar = 0

  grupo_cactos = createGroup()

  grupo_nuvens = new Group()

  gameOver = createSprite(windowWidth/2,windowHeight/2)
  gameOver.addImage(gameOverImg)
  gameOver.scale = 0.5

  restart = createSprite(windowWidth/2,windowHeight/2+40)
  restart.addImage(restartImg)
  restart.scale = 0.5
}


function draw(){
  background(220);

  text("pontuação: " + placar,windowWidth-100,70)

  if(estado_do_jogo == "play"){

    solo.velocityX = -(6 + placar/500)

    if(solo.x<0){
      solo.x = solo.width / 2
    }

    placar = placar + Math.round(frameRate()/60)

    if(placar%500==0){
      checkpoint.play()
    }

    if(touches.length>0 || keyDown("space") && trex.y>windowHeight-40){
      trex.velocityY = -10;
      pular.play()
      touches=[]
    }
   
    trex.velocityY = trex.velocityY + 0.5;
    
    nuvens()

    cactos()

    if(grupo_cactos.isTouching(trex)){
      estado_do_jogo = "end"
      morrer.play()
    }

    restart.visible = false
    gameOver.visible = false
  }
  else if(estado_do_jogo == "end"){
    solo.velocityX = 0
    grupo_cactos.setVelocityXEach(0)
    grupo_nuvens.setVelocityXEach(0)
    grupo_cactos.setLifetimeEach(-1)
    grupo_nuvens.setLifetimeEach(-1)
    
    trex.velocityY=0
    trex.changeAnimation("morto", trex_morto);

    restart.visible = true
    gameOver.visible = true
  }

  if(mousePressedOver(restart)){
    reset()
  }

  trex.collide(soloInvisivel)
  drawSprites();
}

function reset(){
  estado_do_jogo = 'play'
  grupo_cactos.destroyEach()
  grupo_nuvens.destroyEach()
  trex.changeAnimation('running',trex_running);
  placar = 0
}

function nuvens(){
  if(frameCount % 100 === 0){
    nuvem = createSprite(windowWidth,100,50,20)
    nuvem.velocityX = -(6 + placar/500)
    nuvem.y = random(20,windowHeight/2)
    nuvem.addImage(nuvemimagem)
    nuvem.scale = 0.6
    nuvem.lifetime = 800
    grupo_nuvens.add(nuvem)
  }
}

function cactos(){
  if(frameCount % 60 === 0){
    cacto = createSprite(windowWidth,windowHeight-30,20,50)
    cacto.velocityX = -(6 + placar/500)
    cacto.lifetime = 600
    
    var x = Math.round(random(1, 6))
    switch(x){
       case 1 : cacto.addImage(cacto1)
        break;
       case 2 : cacto.addImage(cacto2)
        break;
       case 3 : cacto.addImage(cacto3)
        break;
       case 4 : cacto.addImage(cacto4)
        break;
       case 5 : cacto.addImage(cacto5)
        break;
       case 6 : cacto.addImage(cacto6)
        break;
    }

    cacto.scale = 0.5

    grupo_cactos.add(cacto)
  }
}