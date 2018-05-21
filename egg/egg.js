'use strict';

var bootState = {
  init: function() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.scale.refresh();
  },

  preload: function() {
    game.load.image('progressbar', 'assets/images/progressbar.png');
    game.load.bitmapFont('engeexpa', 'assets/fonts/engeexpa.png', 'assets/fonts/engeexpa.fnt');
  },

  create: function() {
    game.stage.backgroundColor = '#000';
    game.state.start('load');
  }
};

var loadState = {
  preload: function() {
    bitmapTextCentered(150, 'engeexpa', 'Loading...', 30);

    var progressBar = game.add.sprite(game.world.centerX, 200, 'progressbar');
    progressBar.anchor.setTo(0.5, 0.5);
    game.load.setPreloadSprite(progressBar);

    game.load.bitmapFont('zerothre', 'assets/fonts/zerothre.png', 'assets/fonts/zerothre.fnt');
    game.load.bitmapFont('record', 'assets/fonts/record.png', 'assets/fonts/record.fnt');
    game.load.bitmapFont('instructions', 'assets/fonts/instructions.png', 'assets/fonts/instructions.fnt');

    game.load.image('title', 'assets/images/title.png');
    game.load.image('walls', 'assets/images/walls.png');
    game.load.image('grounds', 'assets/images/grounds.png');
    game.load.image('summary', 'assets/images/summary.png');
    game.load.image('menu', 'assets/images/menu.png');
    game.load.image('cursor', 'assets/images/cursor.png');
    game.load.image('hud', 'assets/images/hud.png');
    game.load.image('arrowleft', 'assets/images/arrow-left.png');
    game.load.image('arrowright', 'assets/images/arrow-right.png');
    game.load.image('creativecommons', 'assets/images/cc-by-nc-sa-88x31.png');

    game.load.spritesheet('hero', 'assets/images/character.png', 32, 32);
    game.load.spritesheet('capsules', 'assets/images/capsules.png', 32, 32);
    game.load.spritesheet('viruses', 'assets/images/viruses.png', 32, 32);
    game.load.spritesheet('changers', 'assets/images/changers.png', 32, 32);
    game.load.spritesheet('transformation', 'assets/images/transformation.png', 32, 32);

    // SFX
    game.load.audio('capture', 'assets/sounds/capture.mp3');
    game.load.audio('changer', 'assets/sounds/changer.mp3');
    game.load.audio('walking', 'assets/sounds/walking.mp3');
    game.load.audio('option', 'assets/sounds/cursor.mp3');
    game.load.audio('select', 'assets/sounds/select.mp3');
    game.load.audio('win', 'assets/sounds/win.mp3');
    game.load.audio('blocked', 'assets/sounds/blocked.mp3');

    // BGM
    game.load.audio('main', 'assets/sounds/main.mp3', 0.75, true);
    game.load.audio('finish', 'assets/sounds/finish.mp3', 0.75);
    game.load.audio('track1', 'assets/sounds/track1.mp3', 0.75, true);
    game.load.audio('track2', 'assets/sounds/track2.mp3', 0.75, true);
    game.load.audio('track3', 'assets/sounds/track3.mp3', 0.75, true);
    game.load.audio('track4', 'assets/sounds/track4.mp3', 0.75, true);
    game.load.audio('track5', 'assets/sounds/track5.mp3', 0.75, true);
    game.load.audio('track6', 'assets/sounds/track6.mp3', 0.75, true);

    for (var i=1; i<=game.global.totalLevels; i++) {
      game.load.tilemap(i.toString(), 'assets/maps/' + i.toString() + '.json', null, Phaser.Tilemap.TILED_JSON);
    }
  },

  create: function() {
    game.state.start('menu');
  }
};


var menuState = {
  create: function() {
    game.sound.stopAll();
    game.add.image(0, 0, 'title');
    var licenseImage = game.add.image(game.world.centerX, 425, 'creativecommons');
    licenseImage.scale.setTo(0.8, 0.8);
    licenseImage.anchor.set(0.5);

    bitmapTextCentered(350, uiFonts.TITLE, 'Press ENTER to start', 28);

    var licenseLabel = game.add.text(80, 450,
      'Created by Wil Alvarez. Music by David Senabre.\nLicensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International.',
      {font: '12px Arial', fill: '#fff', align: 'center'});
    //licenseLabel.anchor.set(0.5);
    licenseLabel.x = Math.round(licenseLabel.x);

    var storage = new Storage();

    this.currentLevel = parseInt(storage.read('level.current'));
    if (this.enableLevelSelection()) {
      this.level = this.currentLevel;
      this.selectLabel = game.add.bitmapText(190, 280, uiFonts.TITLE, 'Select level', 30);
      this.arrowLeft = game.add.sprite(375, 290, 'arrowleft');
      this.arrowRight = game.add.sprite(455, 290, 'arrowright');
      this.levelLabel = game.add.bitmapText(408, 285, uiFonts.TITLE, '00', 30);

      var moveLeft = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
      var moveRight = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
      moveLeft.onDown.add(this.decreaseLevel, this);
      moveRight.onDown.add(this.increaseLevel, this);
    }

    var enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    enterKey.onDown.addOnce(this.start, this);
    this.bgmSound = game.add.audio('main');
    this.bgmSound.play();
  },

  enableLevelSelection: function() {
    return this.currentLevel !== null && this.currentLevel > 1;
  },

  decreaseLevel: function() {
    this.level -= 1;
    if (this.level < 1) this.level = 1;
  },

  increaseLevel: function() {
    this.level += 1;
    if (this.level > this.currentLevel) this.level = this.currentLevel;
  },

  start: function() {
    if (this.enableLevelSelection()) {
      game.global.level = this.level;
      game.state.start('play');
    } else {
      game.state.start('intro');
    }
  },

  update: function() {
    if (this.enableLevelSelection()) {
      var level = this.level.toString();
      this.levelLabel.setText(level);
      if (this.level === this.currentLevel) {
        this.arrowLeft.revive();
        this.arrowRight.kill();
      } else if (this.level === 1) {
        this.arrowLeft.kill();
        this.arrowRight.revive();
      } else {
        this.arrowLeft.revive();
        this.arrowRight.revive();
      }
    }
  }
};


var tileSize = 32;
var colorVariant = {
  RED: 'red',
  BLUE: 'blue',
  GREEN: 'green'
};
var DIRECTION = {
  DOWN: 'down',
  UP: 'up',
  LEFT: 'left',
  RIGHT: 'right'
};
var uiFonts = {
  TITLE: 'engeexpa',
  HUD: 'zerothre',
  RECORD: 'record',
  INSTRUCTIONS: 'instructions'
};

function findCapsule(x, y) {
  return _find(x, y, groups.capsules);
}

function findVirus(x, y) {
  return _find(x, y, groups.viruses);
}

function findChanger(x, y) {
  return _find(x, y, groups.changers);
}

function _find(x, y, group) {
  var rtn = null;
  group.forEachAlive(function(v) {
    if (v.x === x && v.y === y) rtn = v;
  });
  return rtn;
}

function humanizeTime(time) {
  if (time === undefined || time === null) return "--";

  time = time / 1000;
  var min = Math.floor(time / 60).toString();
  var sec = Math.ceil(time % 60).toString();
  if (min.length === 1) min = "0" + min
  if (sec.length === 1) sec = "0" + sec
  return min + ':' + sec;
}

function deleteStats() {
  var storage = new Storage();
  storage.delete('level.current');
  for (var i=1; i<=game.global.totalLevels; i++) {
    var bestMovesKey = ['level', i, 'moves'].join('.');
    var bestTimeKey = ['level', i, 'time'].join('.');
    storage.delete(bestMovesKey);
    storage.delete(bestTimeKey);
  }
}


var AudioPool = function(keys) {
  this.keys = keys;
  this.sounds = []
  this.index = 0;

  for(var i=0; i<this.keys.length; i++) {
    this.sounds.push(game.add.audio(this.keys[i]));
  }
};

AudioPool.prototype.constructor = AudioPool;

AudioPool.prototype.randomPlay = function(loop, volume) {
  var volume = (volume === undefined) ? 1.0 : volume
  var loop = (loop === undefined) ? false : loop
  this.index = Math.floor(Math.random() * this.keys.length);

  this.sounds[this.index].play('', 0, 1, volume, loop);
};

AudioPool.prototype.stop = function() {
  this.sounds[this.index].stop();
};

AudioPool.prototype.resume = function() {
  this.sounds[this.index].play();
};


var Storage = function() {
  // Check for support
  try {
    this.enabled = 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    this.enabled = false;
  }
};

Storage.prototype.constructor = Storage;

Storage.prototype.save = function(key, value) {
  if (!this.enabled) return null;
  var i = localStorage.setItem(key, value);
};

Storage.prototype.read = function(key) {
  if (!this.enabled) return null;
  return localStorage.getItem(key);
};

Storage.prototype.delete = function(key) {
  if (!this.enabled) return null;
  localStorage.removeItem(key);
};

var introState = {
  create: function() {
    bitmapTextCentered(150, uiFonts.TITLE, 'Planet Earth has been infected by hundreds of', 26);
    bitmapTextCentered(180, uiFonts.TITLE, 'viruses. To save the world you must capture', 26);
    bitmapTextCentered(210, uiFonts.TITLE, 'them using cryogenic capsules.', 26);
    bitmapTextCentered(250, uiFonts.TITLE, 'The future of humanity is in your hands...', 26);
    bitmapTextCentered(450, uiFonts.TITLE, 'Press ENTER to continue', 18);

    var enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    enterKey.onDown.addOnce(this.start, this);
  },

  start: function() {
    game.state.start('play');
  }
};

/*
chg1 = red
chg2 = blue
chg3 = green
*/
var playState = {
  create: function() {
    this.map = null;
    this.player = null;
    this.sceneDelay = 500;
    this.muted = false;
    this.bgmPool = new AudioPool(['track1', 'track2', 'track3', 'track4', 'track5', 'track6']);
    game.sound.stopAll();
    this.bgmPool.randomPlay(true);

    game.global.moves = 0;
    game.global.time = 0;

    groups.viruses = game.add.group();
    groups.capsules = game.add.group();
    groups.changers = game.add.group();
    groups.hud = game.add.group();

    groups.viruses.enableBody = true;
    groups.capsules.enableBody = true;
    groups.changers.enableBody = true;

    this.map = game.add.tilemap(game.global.level.toString());
    this.map.addTilesetImage('walls', 'walls');
    this.map.addTilesetImage('grounds', 'grounds');
    groups.walls = this.map.createLayer('Walls');
    this.map.createLayer('Grounds');
    this.map.setCollisionBetween(1, 18, true, 'Walls');

    var self = this;
    this.map.objects['Capsules'].forEach(function(e) {
      var y = e.y - self.map.tileHeight;
      var cap = new Capsule(e.x, y, e.properties.type, self.map);
    });

    this.map.objects['Changers'].forEach(function(e) {
      var y = e.y - self.map.tileHeight;
      var chg = new Changer(e.x, y, e.properties.type);
    });

    this.map.objects['Viruses'].forEach(function(e) {
      var y = e.y - self.map.tileHeight;
      var virus = new Virus(e.x, y, e.properties.type);
    });

    game.world.bringToTop(groups.walls);
    game.world.bringToTop(groups.capsules);
    game.world.bringToTop(groups.viruses);
    game.world.bringToTop(groups.changers);

    var e = this.map.objects['Hero'][0];
    var y = e.y - this.map.tileHeight;
    var facing = e.properties.facing || DIRECTION.DOWN;
    var variant = e.properties.color;
    this.player = new Hero(e.x, y, variant, facing, this.map);

    //Ingame menu shortcuts
    this.quitKey = game.input.keyboard.addKey(Phaser.Keyboard.Q);
    this.quitKey.onUp.add(this.quitGame, this);

    this.restartKey = game.input.keyboard.addKey(Phaser.Keyboard.R);
    this.restartKey.onUp.add(this.restartGame, this);

    this.muteKey = game.input.keyboard.addKey(Phaser.Keyboard.M);
    this.muteKey.onUp.add(this.muteGame, this);

    //groups.walls.debug = true;
    this.pausedGame = false;
    this.pauseKey = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
    this.pauseKey.onUp.add(this.togglePause, this);

    this.ingameMenu = new IngameMenu(this);
    this.hud = new HUD();
    this.tutorial = new Tutorial(this.player);
  },

  update: function() {
    this.hud.update();
    this.tutorial.update();
    game.global.time += game.time.elapsed;
    if (groups.viruses.length === 0) {
      this.sceneDelay -= game.time.elapsed;
      if (this.sceneDelay <= 0) {
        if (game.global.level === game.global.totalLevels) {
          game.state.start('win');
        } else {
          game.state.start('summary');
        }
      }
    }
  },

  pauseUpdate: function() {
    if (this.pausedGame) {
      this.ingameMenu.update();
    }
  },

  togglePause: function() {
    this.pausedGame = !this.pausedGame;
    if (this.pausedGame) {
      this.ingameMenu.show();
    } else {
      this.ingameMenu.hide();
    }
    game.paused = this.pausedGame;
  },

  restartGame: function() {
    game.state.start('play');
  },

  quitGame: function() {
    game.state.start('menu');
  },

  muteGame: function() {
    this.muted = !this.muted;

    if (this.muted) {
      this.bgmPool.stop();
    } else {
      this.bgmPool.resume();
    }
  },

  //render: function() {
  //  game.debug.body(this.player);
  //  game.debug.bodyInfo(this.player, 10, 20);
  //}
};

// This object renders on-screen information for level 1 and 2 (tutorial levels)
var Tutorial = function(player) {
  this.fontSize = 20;
  this.yLabel = 20;
  this.step = 0;
  this.player = player;

  if (game.global.level === 1) {
    this.tutorialLabel = bitmapTextCentered(this.yLabel, uiFonts.TITLE, 'Capture the red virus with the red capsule', this.fontSize);
  } else if (game.global.level === 2) {
    this.tutorialLabel = bitmapTextCentered(this.yLabel, uiFonts.TITLE, 'Change to the proper suit to capture the viruses', this.fontSize);
  }
};

Tutorial.prototype.constructor = Tutorial;

Tutorial.prototype.update = function() {
  if (game.global.level > 2) return;

  if (game.global.level === 1) {
    if (groups.viruses.length === 1 && this.step === 0) {
      this.step = 1;
      this.tutorialLabel.destroy();
      this.tutorialLabel = bitmapTextCentered(this.yLabel, uiFonts.TITLE, 'Now change to the green suit to capture the green virus', this.fontSize);
    }
  } else if (game.global.level === 2) {
    if (this.player.variant !== colorVariant.GREEN && this.step === 0) {
      this.step = 1;
      this.tutorialLabel.destroy();
      this.tutorialLabel = bitmapTextCentered(this.yLabel, uiFonts.TITLE, 'Now go capture those filthy viruses', this.fontSize);
    }
  }
};


var IngameMenu = function(play) {
  this.play = play;
  this.option = 0;

  this.cursorSound = game.add.audio('option');
  this.selectSound = game.add.audio('select');

  this.pauseKeyUp = game.input.keyboard.addKey(Phaser.Keyboard.UP);
  this.pauseKeyDown = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
  this.pauseKeyEnter = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
};

IngameMenu.prototype.constructor = IngameMenu;

IngameMenu.prototype.update = function() {
  if (this.option === 0) {
      this.cursor.y = 165;
  } else if (this.option === 1) {
      this.cursor.y = 225;
  } else if (this.option === 2) {
      this.cursor.y = 285;
  }
};

IngameMenu.prototype.show = function() {
  this.option = 0;

  this.mask = game.add.graphics(game.camera.x, game.camera.y);
  this.mask.beginFill(0x000000, 1);
  this.mask.drawRect(game.camera.x, game.camera.y, game.width, game.height);
  this.mask.alpha = 0.5;
  this.mask.endFill();

  this.menuBg = game.add.sprite(195, 100, 'menu');
  this.cursor = game.add.sprite(243, 165, 'cursor');
  this.continueLabel = bitmapTextCentered(160, 'engeexpa', 'Continue', 30);
  this.restartLabel = bitmapTextCentered(220, 'engeexpa', 'Restart', 30);
  this.quitLabel = bitmapTextCentered(280, 'engeexpa', 'Quit', 30);

  this.pauseKeyUp.onDown.add(this.moveCursorUp, this);
  this.pauseKeyDown.onDown.add(this.moveCursorDown, this);
  this.pauseKeyEnter.onDown.add(this.executeMenuOption, this);
};

IngameMenu.prototype.hide = function() {
  this.mask.destroy();
  this.menuBg.destroy();
  this.continueLabel.destroy();
  this.restartLabel.destroy();
  this.quitLabel.destroy();
  this.cursor.destroy();

  this.pauseKeyUp.onDown.removeAll();
  this.pauseKeyDown.onDown.removeAll();
  this.pauseKeyEnter.onDown.removeAll();
};

IngameMenu.prototype.moveCursorDown = function() {
  this.cursorSound.play();
  this.option += 1;
  if (this.option > 2) this.option = 0;
};

IngameMenu.prototype.moveCursorUp = function() {
  this.cursorSound.play();
  this.option -= 1;
  if (this.option < 0) this.option = 2;
};

IngameMenu.prototype.executeMenuOption = function() {
  this.selectSound.play();

  if (this.option === 1) {
    game.state.start('play');
  } else if (this.option === 2) {
    game.state.start('menu');
  }
  this.play.togglePause();
};


var summaryState = {
  create: function() {
    var storage = new Storage();
    //game.add.image(0, 0, 'summary');
    bitmapTextCentered(90, 'engeexpa', 'STAGE CLEARED', 38);

    var bestMovesKey = ['level', game.global.level, 'moves'].join('.');
    var bestTimeKey = ['level', game.global.level, 'time'].join('.');

    var bestMoves = storage.read(bestMovesKey);
    var bestTime = storage.read(bestTimeKey);

    // Score
    var movesFont = uiFonts.TITLE;
    var timeFont = uiFonts.TITLE;
    if (bestMoves === null || game.global.moves < bestMoves) {
      movesFont = uiFonts.RECORD;
      bitmapTextCentered(330, uiFonts.RECORD, 'You have set a new moves record!', 25);
      storage.save(bestMovesKey, game.global.moves);
    }
    if (bestTime === null || game.global.time < bestTime) {
      timeFont = uiFonts.RECORD;
      bitmapTextCentered(360, uiFonts.RECORD, 'You have set a new time record!', 25);
      storage.save(bestTimeKey, game.global.time);
    }
    game.add.bitmapText(235, 170, uiFonts.TITLE, 'Your moves:', 25);
    game.add.bitmapText(385, 170, movesFont, game.global.moves.toString(), 25);
    game.add.bitmapText(240, 200, uiFonts.TITLE, 'Best moves:', 25);
    game.add.bitmapText(385, 200, uiFonts.TITLE, bestMoves || '--', 25);
    game.add.bitmapText(240, 230, uiFonts.TITLE, 'Your time:', 25);
    game.add.bitmapText(370, 230, timeFont, humanizeTime(game.global.time), 25);
    game.add.bitmapText(245, 260, uiFonts.TITLE, 'Best time:', 25);
    game.add.bitmapText(370, 260, uiFonts.TITLE, humanizeTime(bestTime) || '--', 25);

    bitmapTextCentered(439, 'engeexpa', 'Press ENTER to play next level', 18);

    var enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    enterKey.onDown.addOnce(this.next, this);
    game.sound.stopAll();
    this.bgmSound = game.add.audio('finish');
    this.bgmSound.play();

    game.global.level += 1;
    storage.save('level.current', game.global.level);
  },

  next: function() {
    game.state.start('play');
  }
};

var winState = {
  create: function() {
    bitmapTextCentered(90, 'engeexpa', 'You won!', 38);
    // Score
    bitmapTextCentered(170, 'engeexpa', 'Congratulations! You have saved the earth from', 25);
    bitmapTextCentered(200, 'engeexpa', 'the infectors invasion through ' + game.global.level + ' levels. You', 25);
    bitmapTextCentered(230, 'engeexpa', 'are a smart and true warrior but be careful...', 25);
    bitmapTextCentered(280, 'engeexpa', 'They could be back', 25);

    bitmapTextCentered(439, 'engeexpa', 'Press ENTER to go to the menu', 18);

    var enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    enterKey.onDown.addOnce(this.exit, this);
    game.sound.stopAll();
    this.bgmSound = game.add.audio('win');
    this.bgmSound.play();
  },

  exit: function() {
    game.state.start('menu');
  }
};

var HUD = function() {
  Phaser.Sprite.call(this, game, 0, 416, 'hud', 0);

  var textSize = 26;
  var y = 435;
  this.fixedToCamera = true;
  this.levelLabel = game.add.bitmapText(35, y, uiFonts.HUD, 'Level: ' + game.global.level.toString(), textSize);
  game.add.bitmapText(230, y, uiFonts.HUD, 'Moves: ', textSize);
  this.movesLabel = game.add.bitmapText(340, y, uiFonts.HUD, game.global.moves.toString(), textSize);
  game.add.bitmapText(515, y, uiFonts.HUD, 'x', textSize);
  this.virusesLabel = game.add.bitmapText(550, y, uiFonts.HUD, groups.viruses.length.toString(), textSize);

  this.menuLabel = bitmapTextCentered(400, uiFonts.INSTRUCTIONS, 'Press ESC for menu', 14);

  groups.hud.add(this);
};

HUD.prototype = Object.create(Phaser.Sprite.prototype);
HUD.prototype.constructor = HUD;

HUD.prototype.update = function() {
  this.movesLabel.setText(game.global.moves.toString());
  this.virusesLabel.setText(groups.viruses.length.toString());
};


var game = new Phaser.Game(640, 480, Phaser.AUTO, 'game');
game.global = {
  level: 1,
  moves: 0,
  time: 0,
  totalLevels: 21
}
var debug = false;
var groups = {};

game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('intro', introState);
game.state.add('play', playState);
game.state.add('summary', summaryState);
game.state.add('win', winState);

game.state.start('boot');



function bitmapTextCentered(y, font, text, size) {
  var label = game.add.bitmapText(0, y, font, text, size);
  label.updateTransform();
  label.x = (game.width - label.width) / 2;
  return label;
}


var Hero = function(x, y, variant, facing, map) {
  Phaser.Sprite.call(this, game, x, y, 'hero', 0);

  this.map = map;
  this.walking = false;
  this.variant = variant;
  this.direction = facing;
  this.cursors = game.input.keyboard.createCursorKeys();

  var t = this;
  var i = -1;
  [colorVariant.RED, colorVariant.BLUE, colorVariant.GREEN].forEach(function (color) {
    [DIRECTION.DOWN, DIRECTION.LEFT, DIRECTION.RIGHT, DIRECTION.UP].forEach(function (dir) {
      var arr = [];
      for (var j=0; j < 3 ; ++j) {
        arr.push(++i);
      }
      t.animations.add(t.getAnimName(dir, color), arr, 12, true);
    })
  });

  this.changerSound = game.add.audio('changer');
  this.walkingSound = game.add.audio('walking');
  this.blockedSound = game.add.audio('blocked');

  this.render();
  game.add.existing(this);
};

Hero.prototype = Object.create(Phaser.Sprite.prototype);
Hero.prototype.constructor = Hero;

Hero.prototype.changeColor = function(newColor) {
  this.variant = newColor;
};

Hero.prototype.update = function() {
  if (!this.walking) {
    this.checkMovement();
    this.checkChanger();
  }
};

Hero.prototype.move = function(xDir, yDir) {
  var newX, newY;

  if (yDir) {
    this.direction = (yDir > 0) ? 'down' : 'up';
    newX = this.x;
    newY = this.y + Math.floor(tileSize * yDir)
  } else if (xDir) {
    this.direction = (xDir > 0) ? 'right' : 'left';
    newX = this.x + Math.floor(tileSize * xDir);
    newY = this.y;
  }

  // TODO: Change the frame but do not move
  if (this.isWalkable(newX, newY)) {
    var capsule = findCapsule(newX, newY);
    if ((capsule === null) || (capsule.variant === this.variant && capsule.move(this.direction))) {
      this.walking = true;
      this.walkingSound.play();
      this.animations.play(this.getAnimName());

      var tween = game.add.tween(this);
      tween.to({
        x: newX,
        y: newY
      }, 200, Phaser.Easing.Linear.None, true);

      tween.onComplete.add(function(){
        this.walking = false;
        game.global.moves += 1;
        this.render();
      }, this);
    } else {
      this.blockedSound.play();
    }
  } else {
    this.blockedSound.play();
  }
};

Hero.prototype.render = function() {
  this.animations.stop();
  this.animations.getAnimation(this.getAnimName(this.direction, this.variant)).frame = 0;
};

Hero.prototype.isWalkable = function(x, y) {
  return !this.map.hasTile(x / 32, y / 32, 'Walls');
};

Hero.prototype.getAnimName = function(direction, color) {
  if (!direction && !color) {
    return this.direction + '-' + this.variant;
  } else {
    return direction + '-' + color;
  }
}

Hero.prototype.checkMovement = function() {
  var xDir = (this.cursors.left.isDown ? -1 : (this.cursors.right.isDown ? 1: 0));
  var yDir = (this.cursors.up.isDown ? -1 : (this.cursors.down.isDown ? 1: 0));
  if (yDir !== 0) {
    this.move(null, yDir);
  } else if (xDir !== 0) {
    this.move(xDir, null);
  }
};

Hero.prototype.checkChanger = function() {
  var self = this;
  var chg = findChanger(this.x, this.y);

  if (chg !== null && chg.variant !== this.variant) {
    var transf = new Transformation(this.x, this.y);
    this.changerSound.play();
    this.variant = chg.variant;
    this.animations.stop();
    this.animations.getAnimation(this.getAnimName()).frame = 0;
  }
};


var Transformation = function(x, y) {
  Phaser.Sprite.call(this, game, x, y, 'transformation', 0);

  var anim = this.animations.add('main', [0, 1, 2, 3, 4], 20, false);
  anim.onComplete.add(function() {
    this.kill();
  }, this);
  this.animations.play('main');
  game.add.existing(this);
};

Transformation.prototype = Object.create(Phaser.Sprite.prototype);
Transformation.prototype.constructor = Transformation;

Transformation.prototype.update = function() {
  if (!this.alive) this.destroy();
};


var Capsule = function(x, y, type, map) {
  Phaser.Sprite.call(this, game, x, y, 'capsules', 0);

  this.map = map;
  this.variant = type;
  this.moving = false;
  this.blocked = false;
  if (type === colorVariant.RED) {
    this.frame = 0;
  } else if (type === colorVariant.BLUE) {
    this.frame = 1;
  } else if (type === colorVariant.GREEN) {
    this.frame = 2;
  }
  this.animations.add('capture', [3, 4, 3, 4, 3, 4, 5], 20, false);
  this.captureSound = this.game.add.audio('capture');
  groups.capsules.add(this);
};

Capsule.prototype = Object.create(Phaser.Sprite.prototype);
Capsule.prototype.constructor = Capsule;

Capsule.prototype.update = function() {
  if (!this.moving) {
    var virus = findVirus(this.x, this.y);
    if (virus && virus.variant === this.variant) {
      virus.kill();
      this.capture();
    }
  }
};

Capsule.prototype.capture = function() {
  this.blocked = true;
  this.captureSound.play();
  this.animations.play('capture');
};

Capsule.prototype.move = function(direction) {
  var newX = this.x, newY = this.y;
  if (direction === DIRECTION.UP) {
    newY -= tileSize;
  } else if (direction === DIRECTION.DOWN) {
    newY += tileSize;
  } else if (direction === DIRECTION.LEFT) {
    newX -= tileSize;
  } else if (direction === DIRECTION.RIGHT) {
    newX += tileSize;
  }
  if (this.isMovable(newX, newY)) {
    this.moving = true;
    var tween = game.add.tween(this);
    tween.to({
      x: newX,
      y: newY
    }, 100, Phaser.Easing.Linear.None, true);
    tween.onComplete.add(function(){
      this.moving = false;
      this.animations.stop();
    }, this);
  }
  return this.moving;
};

Capsule.prototype.isMovable= function(x, y) {
  var isWall = this.map.hasTile(x / 32, y / 32, 'Walls');
  var isCapsule = findCapsule(x, y);
  var isChanger = findChanger(x, y);
  var virus = findVirus(x, y);
  var isVirus = (virus && virus.variant !== this.variant) ? true : false;
  return (!isWall && !isCapsule && !isVirus && !isChanger && !this.blocked);
};

var Virus = function(x, y, type) {
  Phaser.Sprite.call(this, game, x, y, 'viruses', 0);

  this.variant = type;
  if (type === colorVariant.RED) {
    this.frame = 0;
  } else if (type === colorVariant.BLUE) {
    this.frame = 1;
  } else if (type === colorVariant.GREEN) {
    this.frame = 2;
  }

  if (type === colorVariant.RED) {
    this.animations.add('main', [0, 3, 6, 9], 12, true);
  } else if (type === colorVariant.BLUE) {
    this.animations.add('main', [1, 4, 7, 10], 12, true);
  } else if (type === colorVariant.GREEN) {
    this.animations.add('main', [2, 5, 8, 11], 12, true);
  }
  this.animations.play('main');
  groups.viruses.add(this);
};

Virus.prototype = Object.create(Phaser.Sprite.prototype);
Virus.prototype.constructor = Virus;

Virus.prototype.update = function() {
  if (!this.alive) {
    this.destroy();
  }
};

var Changer = function(x, y, type) {
  Phaser.Sprite.call(this, game, x, y, 'changers', 0);

  this.variant = type;
  if (type === colorVariant.RED) {
    this.frame = 0;
  } else if (type === colorVariant.BLUE) {
    this.frame = 1;
  } else if (type === colorVariant.GREEN) {
    this.frame = 2;
  }
  groups.changers.add(this);
};

Changer.prototype = Object.create(Phaser.Sprite.prototype);
Changer.prototype.constructor = Changer;

