//JESSICA JOUDY
//for CSCI 169

//Phaser.js requires that any loaded elements or assets be served over a web server. 
//Simply opening index.html without a local server will cause all images or audio to not load. 
//In development, I used the Visual Studio Code liveserver extension and the node.js http-server package to test.

//CREDITS:
//@icedcitruss on picrew for base art assets used for character creation (i.e. face shapes, hair shapes, etc.)
//@szadiart on itch.io for tree backgrounds
//Phaser.js free use assets for sky background
//@hernandack on itch.io for full music
//all used under the permission to use assets for personal + commercial use with credit

//Keys for various assets:
const BG = 'bg'; //lower tree background
const TR = 'upper tree bg';
const SKY = 'sky grad';
const WITCH = 'witch char';
const DEMON = 'demon char';
const FAIRY = 'fairy char';
const MUSIC = 'song';

//mutable to alter the gamestate
let gameState = {} //the gamestate object that will hold all of our GameObjects, which are created in create()

function preload () {
  // load in image: background and characters
  //the first parameter sets the key, the second the source
  this.load.image(BG, 'assets/background6.png');
  this.load.image(TR, 'assets/background5.png');
  this.load.image(SKY, 'assets/skygradient.png');
  this.load.image(DEMON, 'assets/demon.png');
  this.load.image(WITCH, 'assets/witch.png');
  this.load.image(FAIRY, 'assets/fairy.png');

  //load in music and audio
  //this.load.audio(key, urls), ogg format for easier loading time
  //BNW loop is a 15 second cut of Brand New Wisdom.ogg
  this.load.audio(MUSIC, ['assets/BNW_loop.ogg'] );
}


function create() {
  
  //sky background
  gameState.backgroundSky = this.add.image(0, 0, SKY);
  gameState.backgroundSky.setOrigin(0,0);
  
  //create the upper tree backgrounds
  gameState.background1 = this.add.image(375, 200, TR);
  gameState.background1.setOrigin(0,0);
  gameState.background2 = this.add.image(000, 200, TR);
  gameState.background2.setOrigin(0,0);
  


  //create the lower tree backgrounds
  gameState.background3 = this.add.image(375, 220, BG);
  gameState.background3.setOrigin(0,0);
  gameState.background4 = this.add.image(100, 220, BG);
  gameState.background4.setOrigin(0,0);
  gameState.background5 = this.add.image(000, 220, BG);
  gameState.background5.setOrigin(0,0);

  const music_config = {
    mute: false,
    volume: 1,
    rate: 1,
    detune: 0,
    seek: 0,
    loop: true,
    delay: 0
  }

  //play audio on loop
  let sfx = this.sound.add(MUSIC);
  sfx.play(music_config);

  //create the game: render the first character and display the first page
  
  initializePage(this); //this = scene, create the options and narrative_background
  let firstPage = getPage(1); //load the first page
  displayPage(this, firstPage); //display the first page
  
}

function renderCharacter(scene, key) {
  if(gameState.character){
    gameState.character.destroy();
  }
  gameState.character = scene.add.image(550, 360, key);
  gameState.character.setOrigin(1, 1);
  gameState.character.setScale(.5);
}

function initializePage(scene) {
  // ensures that the narrative background and options list exist

  if (!gameState.options) {
    //if the options list does not exist, create it
    gameState.options = [];
  }

  if (!gameState.narrative_background) {
    //create the narrative bg if it does not exist already
    gameState.narrative_background = scene.add.rectangle(150, 360, 500, 170, 0x00000);
    gameState.narrative_background.setOrigin(0, 0);
  }
}

function destroyPage() {
  //destory the narrative and options if they exist

  if (gameState.narrative) {
    // destroy narrative if it exists
    gameState.narrative.destroy();
  }

  for (let option of gameState.options) {
    // destroy options if they exist
    option.optionBox.destroy();
    option.optionText.destroy();
  }
}

function displayPage(scene, page) {
  //text style object to be passed into the add.text function
  const narrativeStyle = { fill: '#ffffff', fontStyle: 'italic', align: 'center', wordWrap: { width: 340 }, lineSpacing: 8};
  
  //create the character and their words on the page
  renderCharacter(scene, page.character); //page.character is the key
  gameState.narrative = scene.add.text(250, 380, page.narrative, narrativeStyle);

  // for loop to create the boxes for each option and display player options
  for (let i=0; i<page.options.length; i++) {
    let option = page.options[i];

    const baseX = 230 + i * 130;
    const hexBlueColor = 0x75e3ff;
    //add style to the option box
    const optionBox = scene.add.rectangle(baseX, 470, 115, 40, hexBlueColor, 0);
    optionBox.strokeColor = hexBlueColor; 
    optionBox.strokeWeight = 2;
    optionBox.strokeAlpha = 1;
    optionBox.isStroked = true;
    optionBox.setOrigin(0, 0);

    //add the option text
    const optionText = scene.add.text(baseX, 480, option.option, { fontSize:14, fill: '#75e3ff', align: 'center', wordWrap: {width: 110}});
    const optionTextBounds = optionText.getBounds();

    //center the option text
    optionText.setX(optionTextBounds.x + 55 - (optionTextBounds.width / 2));
    optionText.setY(optionTextBounds.y + 10 - (optionTextBounds.height / 2));

    // add in gameplay functionality
    // using 'setInteractive' to make the option box react to the player's mouse
    optionBox.setInteractive();

    //on click
    optionBox.on('pointerup', function(){
      const newPage = this.option.nextPage;
      //if the new page exists, destroy the current page and fetch the new page
      if(newPage !== undefined){
        destroyPage();
        displayPage(scene, getPage(newPage));
      }
    }, { option });
    
    //on hover
    //change color to orange
    const hexOrangeColor = 0xff793f;
    optionBox.on('pointerover', function(){
      this.optionBox.setStrokeStyle(2, hexOrangeColor, 1);
      this.optionText.setColor('#ff793f');
    }, { optionBox, optionText });
    
    //end hover
    //back to blue
    optionBox.on('pointerout', function(){
      this.optionBox.setStrokeStyle(1, hexBlueColor , 1);
      this.optionText.setColor('#75e3ff');
    }, { optionBox, optionText });
    gameState.options.push({
      optionBox,
      optionText
    }); 
  }
}

//create the game configuration
const config = {
  type: Phaser.WEBGL,
  //the div element the game will load into
  parent: 'phaser-game',
  backgroundColor: 0x448ee4, //dark sky blue //loads in if there are asset problems
  width: 800,
  height: 600,
  scene: {
    preload,
    create,
  },
  audio: {
    disableWebAudio: true
  }
};

//phaser.js syntax to start a game
const game = new Phaser.Game(config);

function getPage(page) {

  //the array of pages that dictate the story
  //each page is an anonymous object: labelled with the character key, the page number, the narrative (text), and response options
  //can have 1, 2, or 3 player options: otherwise leaves the text box
   const pages = [
     {
      character: WITCH,
      page: 1,
      narrative: 'GIRL: Excuse me. Helloooo? What are you doing in my side of the forest?',
      options: [
        { option: 'Hello there.',   nextPage: 2 },
        { option: 'AH, WITCH!',   nextPage: 3 },
      ]
    },


    {
      character: WITCH,
      page: 2,
      narrative: 'GIRL: Oh, it\'s so nice to meet someone polite! I\'m a witch, so people usually run scared.',
      options: [
        { option: 'You don\'t seem like a witch.',   nextPage: 4 },
        { option: 'I\'m just wandering.',   nextPage: 5 },
      ]
    },

    {
      character: WITCH,
      page: 3,
      narrative: 'WITCH: Ugh, this again! How many times do I have to say it, I only practice ethical dark magic! ETHICAL!',
      options: [
        { option: 'Oops... Sorry.',     nextPage: 7 },
        { option: 'Ethical???',   nextPage: 8 },
      ]
    },

    {
      character: WITCH,
      page: 4,
      narrative: 'WITCH: I can do cool magic. Want to see?',
      options: [
        { option: 'Yes, please!',   nextPage: 10 },
        { option: 'Hmmm... no, thank you.',   nextPage: 11 },
        { option: 'AGH! Scary witch!', nextPage: 3 }
      ]
    },

    {
      character: WITCH,
      page: 5,
      narrative: 'WITCH: Well, wander somewhere else. Unless...',
      options: [
        { option: 'Unless...?',   nextPage: 4 },
        { option: 'No! You leave!',   nextPage:  6 },
      ]
    },

    {
      character: WITCH,
      page: 6,
      narrative: 'WITCH: Rude. You could learn to be nicer. \nPOOF',
      options: [
        { option: 'GAH',   nextPage: 21 },
      ]
    },

    {
      character: WITCH,
      page: 7,
      narrative: 'WITCH: That\'s much better. Still, I\'d like it if you leave soon.',
      options: [
        { option: 'Can we be friends?',   nextPage: 11 },
        { option: 'No! You leave!',   nextPage: 6 },
      ]
    },

    {
      character: WITCH,
      page: 8,
      narrative: 'WITCH: I only use locally harvested herbs and ethically sourced crystals.',
      options: [
        { option: 'Can I learn?',   nextPage: 10 },
        { option: 'Apologize and leave',   nextPage: 20 },
        { option: 'Attack! All witches are evil!', nextPage: 9}
      ]
    },

    {
      character: WITCH,
      page: 9,
      narrative: 'WITCH: That was kind of stupid. \nYOU are obliterated.',
      options: [
        { option: 'Die',   nextPage: 40 },
        
      ]
    },

    {
      character: WITCH,
      page: 10,
      narrative: 'WITCH: Why don\'t you meet my fairy friend?',
      options: [
        { option: 'Sounds good!',   nextPage: 12 },
        { option: 'No I don\'t think so',   nextPage: 5 },
      ]
    },

    {
      character: WITCH,
      page: 11,
      narrative: 'YOU stay and chat for a while, learning that this witch likes cake. She is friends with a few fairies, and likes to pet dragons.',
      options: [
        { option: 'Say goodbye to a new friend',   nextPage: 40 },
      ]
    },
    
    {
      character: FAIRY,
      page: 12,
      narrative: 'FAIRY: Hello there lovely! The dark witch sent you my way!',
      options: [
        { option: 'Greet pleasantly',   nextPage: 13 },
        { option: 'I demand you teach me magic',   nextPage: 14 },
        { option: 'Why no wings?',   nextPage: 15 },
      ]
    },

    {
      character: FAIRY,
      page: 13,
      narrative: 'FAIRY: You are so sweet! Do you want some fresh fruit?',
      options: [
        { option: 'Accept a red apple',   nextPage: 16 },
        { option: 'No fruit, only cookies.',   nextPage: 17 },
      ]
    },

    {
      character: FAIRY,
      page: 14,
      narrative: 'FAIRY: I can teach you a few spells. But at a price...',
      options: [
        { option: 'That sounds ominous',   nextPage: 18 },
        { option: 'Yessss',   nextPage: 19 },
      ]
    },

    {
      character: FAIRY,
      page: 15,
      narrative: 'FAIRY: Wings are just a myth. Want to know more about fairies?',
      options: [
        { option: 'Yes, please',   nextPage: 16 },
        { option: 'Magic!', nextPage: 14 }
      ]
    },

    {
      character: FAIRY,
      page: 16,
      narrative: 'YOU and the FAIRY chat pleasantly over apples and sweet tea. She teaches you to fly with a spell (no wings necessary)! You have made a new friend.',
      options: [
        { option: 'Stay with your new friend',   nextPage: 42 },
      ]
    },

    {
      character: FAIRY,
      page: 17,
      narrative: 'FAIRY: I only have fruit.',
      options: [
        { option: 'Accept the red apple',   nextPage: 16 },
      ]
    },

    {
      character: FAIRY,
      page: 18,
      narrative: 'YOU seem to have offended the nice FAIRY. Shame on you.',
      options: [
        { option: 'Be Ashamed',   nextPage: 42 },
      ]
    },

    {
      character: FAIRY,
      page: 19,
      narrative: 'The FAIRY teaches YOU a bunch of spells! YOU can fly now! The price YOU had to pay was FRIENDSHIP.',
      options: [
        { option: 'Hug your new bestie.',   nextPage: 42 },
      ]
    },

    {
      character: DEMON,
      page: 20,
      narrative: 'DEMON: Heh heh heh...',
      options: [
        { option: 'What are you!?!',   nextPage: 25 },
        { option: 'Hello!',   nextPage: 22 },
      ]
    },

    {
      character: DEMON,
      page: 21,
      narrative: 'DEMON: Hehehe...',
      options: [
        { option: 'Well, that was unexpected.',   nextPage: 22 },
        { option: 'DEMON! EVIL DEMON!',   nextPage: 23 },
      ]
    },

    {
      character: DEMON,
      page: 22,
      narrative: 'DEMON: Are you looking for revenge on the nasty witch that sent you my way? Look no further, for I-',
      options: [
        { option: 'Stare',   nextPage: 23 },
        { option: 'Revengeeee',   nextPage: 24 },
        { option: 'Politely refuse', nextPage: 26 }
      ]
    },

    {
      character: DEMON,
      page: 23,
      narrative: 'The DEMON frowns. YOU are cursed into the shape of a frog forever.',
      options: [
        { option: 'Be the frog.',   nextPage: 41 },
      ]
    },

    {
      character: DEMON,
      page: 24,
      narrative: 'DEMON: Heh heh heh... revenge it is, for a price...',
      options: [
        { option: 'Revengeeeeee',   nextPage: 27 },
        { option: 'That seems like a bad idea.',   nextPage: 26 },
      ]
    },

    {
      character: DEMON,
      page: 25,
      narrative: 'DEMON: Who, not what... Just because I\'m a demon doesn\'t mean I don\'t feel.',
      options: [
        { option: 'Sorry',   nextPage: 22 },
        { option: 'EVIL! EVIL DEMON!',   nextPage: 23 },
      ]
    },

    {
      character: DEMON,
      page: 26,
      narrative: 'DEMON: Oh, why are you here then? Do you want to be my friend?',
      options: [
        { option: 'Accept',   nextPage: 28 },
        { option: 'Refuse',   nextPage: 23 },
      ]
    },

    {
      character: DEMON,
      page: 27,
      narrative: 'The DEMON assures YOU that he has cursed the mean WITCH who kicked YOU out. She now has warts. YOU are forever in his debt.',
      options: [
        { option: 'Celebrate vengeance',   nextPage: 41 },
      ]
    },
    
    {
      character: DEMON,
      page: 28,
      narrative: 'YOU learn that the DEMON likes fantasy jazz and rare steak. He offers YOU some, and he doesn\'t turn YOU into a frog. so it\'s a win.',
      options: [
        { option: 'Celebrate non-froginess',   nextPage: 41 },
      ]
    },

    {
      character: WITCH,
      page: 40,
      narrative: 'THE END\nThanks for playing!',
      options: [
        { option: 'PLAY AGAIN',   nextPage: 1 },
      ]
    },

    {
      character: DEMON,
      page: 41,
      narrative: 'THE END\nThanks for playing!',
      options: [
        { option: 'PLAY AGAIN',   nextPage: 1 },
      ]
    },

    {
      character: FAIRY,
      page: 42,
      narrative: 'THE END\nThanks for playing!',
      options: [
        { option: 'PLAY AGAIN',   nextPage: 1 },
      ]
    },


   ]

  return pages.find(function(e) { if(e.page == page) return e });
}
