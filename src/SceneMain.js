export default class SceneMain extends Phaser.Scene {
  constructor() {
    super('SceneMain');
  }
  preload(){
    // Load images and sounds

    //Music
    this.load.audio('bgm', ['assets/audio/bgm.ogg',
      'assets/audio/bgm.wav']);
    this.load.audio('jumpFx', ['assets/audio/jump.ogg',
      'assets/audio/jump.wav']);

    // Area
    this.load.image('bg', 'assets/playfield/bg.png');
    this.load.image('area', 'assets/playfield/area.png');

    //Player
    this.load.spritesheet('player-idle', 'assets/player/player-idle.png', {frameWidth: 80, frameHeight: 80});
    this.load.spritesheet('player-run', 'assets/player/player-run.png', {frameWidth: 80, frameHeight: 80});
    this.load.spritesheet('player-shoot', 'assets/player/player-run-shot.png', {frameWidth: 80, frameHeight: 80});
    this.load.spritesheet('player-jump', 'assets/player/player-jump.png', {frameWidth: 80, frameHeight: 80});
    
    //Bullet
    this.load.spritesheet('shot', 'assets/fx/shot.png', {frameWidth: 6, frameHeight: 4});

    //Enemy
      this.load.spritesheet('monster-idle', 'assets/monster/crab-idle.png', {frameWidth:48, frameHeight: 32});
      this.load.spritesheet('monster-walk', 'assets/monster/crab-walk.png', {frameWidth:48, frameHeight: 32});
  }
  create(){
    // Define our objects
    
    //
    this.timerToActive = 0;
    //Banyaknya enemy yang telah di spawn
    this.spawn = 0;
    //Set inisiasi wave
    this.wave = 1;
    //Inisiasi score
    this.score = 0;
    
    //inisiasi music
    this.jumpFx = this.sound.add('jumpFx', {
      loop: false
    });
    this.bgm = this.sound.add('bgm', {
      loop: true
    });
    this.bgm.play();

    // Area
    this.add.image(0, 0, 'bg').setOrigin(0,0);
    this.add.image(0, 0, 'area').setOrigin(0,0);

    //Membuat Text
    this.scoreText = this.add.text(16, 16, "SCORE: 0", {
      fontSize: '40px',
      fill: '#fff'
    });

    this.waveText = this.add.text(640-16, 16, "WAVE: 0", {
      fontSize: '40px',
      fill: '#fff',
    });

    this.waveText.setOrigin(1, 0);

    //Player
    this.player = this.physics.add.sprite(320, 300, 'player-idle');
    this.player.setCollideWorldBounds(true);
    this.player.setGravityY(400);

    this.player.setSize(32,80);

    //Bullet
    this.bullet = this.physics.add.group();

    //Enemy groups
    this.monsters = this.physics.add.group();

    //Check Shooting
    this.isShooting = false; 

    //Platforms
    this.floor = this.physics.add.sprite(0, 480).setOrigin(0,0);
    this.floor.displayWidth = 640;
    this.floor.displayHeight = 60;
    this.floor.setCollideWorldBounds(true);
    this.floor.body.immovable = true;

    this.floor2 = this.physics.add.sprite(0, 480).setOrigin(0,0);
    this.floor2.displayWidth = 125;
    this.floor2.displayHeight = 160;
    this.floor2.setCollideWorldBounds(true);
    this.floor2.body.immovable = true;

    this.floor3 = this.physics.add.sprite(640, 480).setOrigin(0,0);
    this.floor3.displayWidth = 80;
    this.floor3.displayHeight = 155;
    this.floor3.setCollideWorldBounds(true);
    this.floor3.body.immovable = true;

    //Input Keys
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKeys = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    //Animation
    this.anims.create({
        key: 'p-idle',
        frames: this.anims.generateFrameNumbers('player-idle', {start: 0, end: 3}),
        framerate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'p-run',
        frames: this.anims.generateFrameNumbers('player-run', {start: 0, end: 9}),
        framerate: 10,
        repeat: -1
    });

    this.anims.create({
      key: 'p-shoot',
      frames: this.anims.generateFrameNumbers('player-shoot', {start: 0, end: 9 }),
      framerate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'p-shooti',
      frames: this.anims.generateFrameNumbers('player-shoot', {start: 1, end: 1 }),
      repeat: 0
    });

    this.anims.create({
      key: 'p-jump',
      frames: this.anims.generateFrameNumbers('player-jump', {start: 0, end: 5}),
      framerate: 10,
      repeat: 0
    });

    this.anims.create({
      key: 'shooting',
      frames: this.anims.generateFrameNumbers('shot', {start: 0, end: 1}),
      framerate: 10,
      repeat: 0
    });
  
    this.anims.create({
      key: 'crab-idle',
      frames: this.anims.generateFrameNumbers('monster-idle', {start: 0,end: 3}),
      framerate: 8,
      repeat: -1
    });

    this.anims.create({
      key: 'crab-walk',
      frames: this.anims.generateFrameNumbers('monster-walk', {start: 0,end: 3}),
      framerate: 8,
      repeat: -1
    });

    //Collider
    this.physics.add.collider(this.player, this.floor);
    this.physics.add.collider(this.player, this.floor2);
    this.physics.add.collider(this.player, this.floor3);
    
    this.physics.add.collider(this.monsters, this.floor);
    this.physics.add.collider(this.monsters, this.floor2);
    this.physics.add.collider(this.monsters, this.floor3);

    //Overlap
    this.physics.add.overlap(this.bullet, this.monsters, this.enemyDead.bind(this));
  
    //this.player.anims.play('p-idle', true);
    //this.player.anims.play('p-run', true);
    //this.player.anims.play('p-shoot', true);
    //this.player.anims.play('p-jump', true);
  }

  enemyDead(bullet, enemy){
    bullet.destroy();
    enemy.destroy();
    this.score += 10;
    console.log("Score: " + this.score);
    this.scoreText.text = "SCORE: " + this.score;
  }

  timeSpawn(timer){
    this.timerToActive--;
    if (this.timerToActive < 0){
      this.spawnEnemy();
      this.timerToActive = timer;
    }
  }
    
  currentWave(wave){
    switch(wave){
      case 1:
        return 5;
      case 2:	
        return 7;
      case 3:
        return 10;
    }
  }

    spawnEnemy(){
      console.log("spawned | " + this.wave);
      if(this.spawn != this.currentWave(this.wave)){
        var rand = Phaser.Math.Between(0,1);
        if (rand == 1){
          var crabMonster = this.monsters.create(100,300, 'monster-idle');
          crabMonster.anims.play('crab-walk');
        }else{
          var crabMonster = this.monsters.create(550,300, 'monster-idle');
          crabMonster.anims.play('crab-walk');
        }
      }
        else if(this.spawn == this.currentWave(this.wave) && this.monsters.countActive(true) == 0){
          this.wave++;
          this.spawn = 0;
          this.waveText.text = "WAVE: " + this.wave; 
      }
     
      this.spawn++;
    }

  doShoot(arah) {
    if (this.isShooting == false) {
      if (arah == true) {
        var peluru = this.bullet.create(this.player.x+20, this.player.y+15, 'shot');
        peluru.anims.play('shooting');
        peluru.body.setVelocityX(-450);
      } else {
        var peluru = this.bullet.create(this.player.x-20, this.player.y+15, 'shot');
        peluru.anims.play('shooting');
        peluru.body.setVelocityX(450);
      }
      this.isShooting = true;
      this.time.addEvent({
        delay: 250,
        callback: () => {
          this.isShooting = false;
        }
      })
    } 
  }
  
  update(){
    // Running loop
    // Running

    this.timeSpawn(180);

    if (this.player.body.touching.Down) {
      if(this.cursors.left.isDown) {
        this.player.flipX = true;
        this.player.setVelocityX(-160);
      } else if (this.cursors.right.isDown) {
        this.player.flipX = false;
        this.player.setVelocityX(160);
      } else {
        this.player.setVelocityX(0);
      }
    } else if(this.spaceKeys.isDown && this.player.body.touching.down){
      if(this.cursors.left.isDown){
        this.player.flipX = true;
        this.player.setVelocityX(-160);
        this.player.anims.play('p-shoot', true);
      }else if (this.cursors.right.isDown) {
        this.player.flipX = false;
        this.player.setVelocityX(160);
        this.player.anims.play('p-shoot', true);
      }else {
        this.player.setVelocityX(0);
        this.player.anims.play('p-shooti', true);
      }
      this.doShoot(this.player.flipX);
    }else {
      if (this.cursors.left.isDown) {
        this.player.flipX = true;
        this.player.setVelocityX(-160);
        this.player.anims.play('p-run', true);
      }else if (this.cursors.right.isDown) {
        this.player.flipX = false;
        this.player.setVelocityX(160);
        this.player.anims.play('p-run', true);
        }else {
          this.player.setVelocityX(0);
          this.player.anims.play('p-idle',true);
        }
      }
      
    //Jump
      if (this.cursors.up.isDown && this.player.body.touching.down) {
        this.player.setVelocityY(-330);
        this.player.anims.play('p-jump', true);
        this.jumpFx.play();
      }
    
    this.monsters.children.each(enemy => {
      if (this.player.x < enemy.x){
          enemy.body.setGravityY(400);
          enemy.flipX = false;
          enemy.setVelocityX (-30);
      }else{
          enemy.body.setGravityY(400);
          enemy.flipX = true;
          enemy.setVelocityX(30);
      }
    });
  }
}