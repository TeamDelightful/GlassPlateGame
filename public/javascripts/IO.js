//TODOs
//to be able to drag the tiles of the connection palete to cards to attempt to add connection
//  add drag properties to palete tiles
//  add listener (or whatever works) to cards to find the tile being dropped on it
//  move palete tile back to its spot
//  check if move is valid
//  if is, make the move
//to be able to click the dice and attempt to turn them to another side (ie make a challenge, permit, ect)
//  pop up menu near die of actions to make with the die
//  select items on the dropdown
//  attempt to make the action
//  set the card.dieState to correct value




let type = "WebGL";
if (!PIXI.utils.isWebGLSupported()) {
    type = "canvas";
}

PIXI.utils.sayHello(type);


//layout variables
let layout = {
    cardSize: 600,
    tileSize: 60,
    boardSize: 1500
}

let lastUpdateDelta = 0;



const PIXIapp = new PIXI.Application({
    width: layout.boardSize,
    height: layout.boardSize,
    antialias: true,
    transparent: false,
    resolution: 1
});




//document.body.replaceChild(app.view,              use this to replace a canvas html element once we figure out how to do that

let ticker = PIXI.Ticker.shared;
ticker.autoStart = false;
ticker.stop();

//card representated by
//{
//  name:string, (must be exactly as in the card's image)
//  connections: [redbool,greenbool,bluebool,yellowbool],
//  dieState: string ("blank", okay", "permit", or "challenge")
//}

let colors = {
    drkpurple: 0xB38BFC,
    drkgreen: 0x53FCA2,
    drkblue: 0x7EB2FC,
    drkyellow: 0xFFE76E,
    drkpink: 0xFF8ADD,
    drkaqua: 0x8AEFFF,
    drkorange: 0xFFB98A,
    superdrkpurple: 0x5B03FF,
    superdrkgreen: 0x04D164,
    superdrkblue: 0x026AFA,
    superdrkyellow: 0xFAD000,
    superdrkpink: 0xFC03B6,
    superdrkaqua: 0x03DAFC,
    superdrkorange: 0xFC6500
}

//to be pulled from gamestate code
let cards;


function pixiStart(boardState){

  cards = boardState;


  cards.forEach(load);
  PIXI.Loader.shared.load(setup);
  document.getElementById("divBoard").appendChild(PIXIapp.view);
};

function load(item){
  if(PIXI.Loader.shared.resources["../images/4x4x150cards/" + item.name + ".png"] === undefined){
    PIXI.Loader.shared.add("../images/4x4x150cards/" + item.name + ".png");
  }
}

function sendState(){

  let board = []

  cards.forEach((item) => {
    board.push(
      {
          name: item.name,
          connections: item.connections,
          dieState: item.dieState,
      }
    )
  });


  const gameDataOut = {
    "method": "play",
    "playerId": playerId,
    "gameId": gameId,
    "boardState": board
  }

  console.log(gameDataOut)

  ws.send(JSON.stringify(gameDataOut));
}



//load all textures here, then setup is called


//interface for adding connections
let connectPalate = null;

function setup() { //sets all cards up with their default states

    cards.forEach(cardSetup);

    let rowCount = Math.floor(layout.boardSize / layout.cardSize);

    let currentCard = 0;

    while(currentCard < cards.length){
        cards[currentCard].container.position.set(layout.boardSize * ((currentCard % rowCount) * 2 + 1)  / (rowCount * 2),
                                                  layout.boardSize * (((Math.floor(currentCard / rowCount)) * 2) + 1) / (rowCount * 2) );


        currentCard++;
    }

    ticker.add(function (time) {
               for (let i = 0; i < cards.length; i++){
                   switch (cards[i].dieState) {
                       case "blank":
                           cards[i].container.getChildAt(6).text = "";
                           break;
                       case "okay":
                           cards[i].container.getChildAt(6).text = "O";
                           break;

                       case "permit":
                           cards[i].container.getChildAt(6).text = "P";
                           break;

                       case "challenge":
                           cards[i].container.getChildAt(6).text = "C";
                           break;

                       default:
                           console.log("Die state not recognied");
                   }

                   cards[i].container.getChildAt(1).visible = cards[i].connections[0];
                   cards[i].container.getChildAt(2).visible = cards[i].connections[1];
                   cards[i].container.getChildAt(3).visible = cards[i].connections[2];
                   cards[i].container.getChildAt(4).visible = cards[i].connections[3];
               }
            }); //card state update from internal, every frame

    ticker.add(function (time) {
        if (lastUpdateDelta += ticker.deltaMS > 10){
            //update from network or state machine
            lastUpdateDelta = 0;
        }
    }); //10 ms resolution updates from statemachine or network

    setupPalate();

    ticker.start();


}


function setupPalate(){
    connectPalate = new PIXI.Container();
    connectPalate.height = layout.tileSize * 14;
    connectPalate.width = layout.tileSize;
    connectPalate.zIndex = 3;
    connectPalate.position.set(layout.boardSize - layout.tileSize, layout.boardSize / 2 - 2 * layout.tileSize);
    connectPalate.addChild(
        new PIXI.Graphics().beginFill(0xB38BFC).drawRect(0,0,layout.tileSize,layout.tileSize).endFill(),
        new PIXI.Graphics().beginFill(0x53FCA2).drawRect(0,0,layout.tileSize,layout.tileSize).endFill(),
        new PIXI.Graphics().beginFill(0x7EB2FC).drawRect(0,0,layout.tileSize,layout.tileSize).endFill(),
        new PIXI.Graphics().beginFill(0xFFE76E).drawRect(0,0,layout.tileSize,layout.tileSize).endFill(),
        new PIXI.Graphics().beginFill(0xFF8ADD).drawRect(0,0,layout.tileSize,layout.tileSize).endFill(),
        new PIXI.Graphics().beginFill(0x8AEFFF).drawRect(0,0,layout.tileSize,layout.tileSize).endFill(),
        new PIXI.Graphics().beginFill(0xFFB98A).drawRect(0,0,layout.tileSize,layout.tileSize).endFill(),
        new PIXI.Graphics().beginFill(0x5B03FF).drawRect(0,0,layout.tileSize,layout.tileSize).endFill(),
        new PIXI.Graphics().beginFill(0x04D164).drawRect(0,0,layout.tileSize,layout.tileSize).endFill(),
        new PIXI.Graphics().beginFill(0x026AFA).drawRect(0,0,layout.tileSize,layout.tileSize).endFill(),
        new PIXI.Graphics().beginFill(0xFAD000).drawRect(0,0,layout.tileSize,layout.tileSize).endFill(),
        new PIXI.Graphics().beginFill(0xFC03B6).drawRect(0,0,layout.tileSize,layout.tileSize).endFill(),
        new PIXI.Graphics().beginFill(0x03DAFC).drawRect(0,0,layout.tileSize,layout.tileSize).endFill(),
        new PIXI.Graphics().beginFill(0xFC6500).drawRect(0,0,layout.tileSize,layout.tileSize).endFill()

    );

    connectPalate.getChildAt(0).interactive = true;
    connectPalate.getChildAt(0).buttonMode = true;
    connectPalate.getChildAt(0).zIndex = 5;
    connectPalate.getChildAt(0).color = colors.drkpurple;
    connectPalate.getChildAt(0).on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove);

    connectPalate.getChildAt(1).interactive = true;
    connectPalate.getChildAt(1).buttonMode = true;
    connectPalate.getChildAt(1).zIndex = 5;
    connectPalate.getChildAt(1).color = colors.drkgreen;
    connectPalate.getChildAt(1).on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove);

    connectPalate.getChildAt(2).interactive = true;
    connectPalate.getChildAt(2).buttonMode = true;
    connectPalate.getChildAt(2).zIndex = 5;
    connectPalate.getChildAt(2).color = colors.drkblue;
    connectPalate.getChildAt(2).on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove);

    connectPalate.getChildAt(3).interactive = true;
    connectPalate.getChildAt(3).buttonMode = true;
    connectPalate.getChildAt(3).zIndex = 5;
    connectPalate.getChildAt(3).color = colors.drkyellow;
    connectPalate.getChildAt(3).on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove);
        
    connectPalate.getChildAt(4).interactive = true;
    connectPalate.getChildAt(4).buttonMode = true;
    connectPalate.getChildAt(4).zIndex = 5;
    connectPalate.getChildAt(4).color = colors.drkpink;
    connectPalate.getChildAt(4).on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove); 
        
    connectPalate.getChildAt(5).interactive = true;
    connectPalate.getChildAt(5).buttonMode = true;
    connectPalate.getChildAt(5).zIndex = 5;
    connectPalate.getChildAt(5).color = colors.drkaqua;
    connectPalate.getChildAt(5).on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove);  

    connectPalate.getChildAt(6).interactive = true;
    connectPalate.getChildAt(6).buttonMode = true;
    connectPalate.getChildAt(6).zIndex = 5;
    connectPalate.getChildAt(6).color = colors.drkorange;
    connectPalate.getChildAt(6).on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove); 

    connectPalate.getChildAt(7).interactive = true;
    connectPalate.getChildAt(7).buttonMode = true;
    connectPalate.getChildAt(7).zIndex = 5;
    connectPalate.getChildAt(7).color = colors.superdrkpurple;
    connectPalate.getChildAt(7).on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove); 

    connectPalate.getChildAt(8).interactive = true;
    connectPalate.getChildAt(8).buttonMode = true;
    connectPalate.getChildAt(8).zIndex = 5;
    connectPalate.getChildAt(8).color = colors.superdrkgreen;
    connectPalate.getChildAt(8).on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove); 
        
    connectPalate.getChildAt(9).interactive = true;
    connectPalate.getChildAt(9).buttonMode = true;
    connectPalate.getChildAt(9).zIndex = 5;
    connectPalate.getChildAt(9).color = colors.superdrkblue;
    connectPalate.getChildAt(9).on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove); 
        
    connectPalate.getChildAt(10).interactive = true;
    connectPalate.getChildAt(10).buttonMode = true;
    connectPalate.getChildAt(10).zIndex = 5;
    connectPalate.getChildAt(10).color = colors.superdrkyellow;
    connectPalate.getChildAt(10).on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove); 
        
    connectPalate.getChildAt(11).interactive = true;
    connectPalate.getChildAt(11).buttonMode = true;
    connectPalate.getChildAt(11).zIndex = 5;
    connectPalate.getChildAt(11).color = colors.superdrkpink;
    connectPalate.getChildAt(11).on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove); 
        
    connectPalate.getChildAt(12).interactive = true;
    connectPalate.getChildAt(12).buttonMode = true;
    connectPalate.getChildAt(12).zIndex = 5;
    connectPalate.getChildAt(12).color = colors.superdrkaqua;
    connectPalate.getChildAt(12).on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove);   
        
    connectPalate.getChildAt(13).interactive = true;
    connectPalate.getChildAt(13).buttonMode = true;
    connectPalate.getChildAt(13).zIndex = 5;
    connectPalate.getChildAt(13).color = colors.superdrkorange;
    connectPalate.getChildAt(13).on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove); 
        

    connectPalate.getChildAt(0).position.set(0,0);
    connectPalate.getChildAt(0).home_x = connectPalate.getChildAt(0).x;
    connectPalate.getChildAt(0).home_y = connectPalate.getChildAt(0).y;

    connectPalate.getChildAt(1).position.set(0,layout.tileSize * 1);
    connectPalate.getChildAt(1).home_x = connectPalate.getChildAt(1).x;
    connectPalate.getChildAt(1).home_y = connectPalate.getChildAt(1).y;

    connectPalate.getChildAt(2).position.set(0,layout.tileSize * 2);
    connectPalate.getChildAt(2).home_x = connectPalate.getChildAt(2).x;
    connectPalate.getChildAt(2).home_y = connectPalate.getChildAt(2).y;

    connectPalate.getChildAt(3).position.set(0,layout.tileSize * 3);
    connectPalate.getChildAt(3).home_x = connectPalate.getChildAt(3).x;
    connectPalate.getChildAt(3).home_y = connectPalate.getChildAt(3).y;
    
    connectPalate.getChildAt(4).position.set(0,layout.tileSize * 4);
    connectPalate.getChildAt(4).home_x = connectPalate.getChildAt(4).x;
    connectPalate.getChildAt(4).home_y = connectPalate.getChildAt(4).y;

    connectPalate.getChildAt(5).position.set(0,layout.tileSize * 5);
    connectPalate.getChildAt(5).home_x = connectPalate.getChildAt(5).x;
    connectPalate.getChildAt(5).home_y = connectPalate.getChildAt(5).y;

    connectPalate.getChildAt(6).position.set(0,layout.tileSize * 6);
    connectPalate.getChildAt(6).home_x = connectPalate.getChildAt(6).x;
    connectPalate.getChildAt(6).home_y = connectPalate.getChildAt(6).y;
    
    connectPalate.getChildAt(7).position.set(0,layout.tileSize * 7);
    connectPalate.getChildAt(7).home_x = connectPalate.getChildAt(7).x;
    connectPalate.getChildAt(7).home_y = connectPalate.getChildAt(7).y;

    connectPalate.getChildAt(8).position.set(0,layout.tileSize * 8);
    connectPalate.getChildAt(8).home_x = connectPalate.getChildAt(8).x;
    connectPalate.getChildAt(8).home_y = connectPalate.getChildAt(8).y;
    
    connectPalate.getChildAt(9).position.set(0,layout.tileSize * 9);
    connectPalate.getChildAt(9).home_x = connectPalate.getChildAt(9).x;
    connectPalate.getChildAt(9).home_y = connectPalate.getChildAt(9).y;

    connectPalate.getChildAt(10).position.set(0,layout.tileSize * 10);
    connectPalate.getChildAt(10).home_x = connectPalate.getChildAt(10).x;
    connectPalate.getChildAt(10).home_y = connectPalate.getChildAt(10).y;

    connectPalate.getChildAt(11).position.set(0,layout.tileSize * 11);
    connectPalate.getChildAt(11).home_x = connectPalate.getChildAt(11).x;
    connectPalate.getChildAt(11).home_y = connectPalate.getChildAt(11).y;
    
    connectPalate.getChildAt(12).position.set(0,layout.tileSize * 12);
    connectPalate.getChildAt(12).home_x = connectPalate.getChildAt(12).x;
    connectPalate.getChildAt(12).home_y = connectPalate.getChildAt(12).y;

    connectPalate.getChildAt(13).position.set(0,layout.tileSize * 13);
    connectPalate.getChildAt(13).home_x = connectPalate.getChildAt(13).x;
    connectPalate.getChildAt(13).home_y = connectPalate.getChildAt(13).y;


    PIXIapp.stage.addChild(connectPalate);
}


function cardSetup(item){
    item.container = new PIXI.Container();
    item.container.height = 600;
    item.container.width = 600;
    item.container.pivot.set(layout.cardSize/2,layout.cardSize/2);
    item.container.addChild(new PIXI.Sprite(PIXI.Loader.shared.resources["../images/4x4x150cards/" + item.name + ".png"].texture),
                            new PIXI.Graphics().beginFill(0xB38BFC).drawRect(layout.tileSize/-2,layout.tileSize/-2,layout.tileSize,layout.tileSize).endFill(),
                            new PIXI.Graphics().beginFill(0x53FCA2).drawRect(layout.tileSize/-2,layout.tileSize/-2,layout.tileSize,layout.tileSize).endFill(),
                            new PIXI.Graphics().beginFill(0x7EB2FC).drawRect(layout.tileSize/-2,layout.tileSize/-2,layout.tileSize,layout.tileSize).endFill(),
                            new PIXI.Graphics().beginFill(0xFFE76E).drawRect(layout.tileSize/-2,layout.tileSize/-2,layout.tileSize,layout.tileSize).endFill(),
                            new PIXI.Graphics().beginFill(0xcfb6a5).drawRect(layout.tileSize/-2,layout.tileSize/-2,layout.tileSize,layout.tileSize).endFill(),
                            /*new PIXI.Graphics().beginFill(0x8AEFFF).drawRect(layout.tileSize/-2,layout.tileSize/-2,layout.tileSize,layout.tileSize).endFill(),
                            new PIXI.Graphics().beginFill(0xFFB98A).drawRect(layout.tileSize/-2,layout.tileSize/-2,layout.tileSize,layout.tileSize).endFill(),
                            new PIXI.Graphics().beginFill(0x5B03FF).drawRect(layout.tileSize/-2,layout.tileSize/-2,layout.tileSize,layout.tileSize).endFill(),
                            new PIXI.Graphics().beginFill(0x04D164).drawRect(layout.tileSize/-2,layout.tileSize/-2,layout.tileSize,layout.tileSize).endFill(),
                            new PIXI.Graphics().beginFill(0x026AFA).drawRect(layout.tileSize/-2,layout.tileSize/-2,layout.tileSize,layout.tileSize).endFill(),
                            new PIXI.Graphics().beginFill(0xFAD000).drawRect(layout.tileSize/-2,layout.tileSize/-2,layout.tileSize,layout.tileSize).endFill(),
                            new PIXI.Graphics().beginFill(0xFC03B6).drawRect(layout.tileSize/-2,layout.tileSize/-2,layout.tileSize,layout.tileSize).endFill(),
                            new PIXI.Graphics().beginFill(0x03DAFC).drawRect(layout.tileSize/-2,layout.tileSize/-2,layout.tileSize,layout.tileSize).endFill(),
                            new PIXI.Graphics().beginFill(0xFC6500).drawRect(layout.tileSize/-2,layout.tileSize/-2,layout.tileSize,layout.tileSize).endFill(),
*/
                            new PIXI.Text('', {"textBaseline": "alpahbetic"})
                           );

    //reference to card object in cards array
    item.container.cardParent = item;

    item.container.getChildAt(0).x = 0;
    item.container.getChildAt(0).y = 0;
    item.container.getChildAt(0).zIndex = 0;
    item.container.getChildAt(0).interactive = true;
    item.container.getChildAt(0).showingName = false;
    item.container.getChildAt(0).on('pointerdown', showName)
        .on('pointerup', hideName);

    item.container.getChildAt(1).x = layout.tileSize/2;
    item.container.getChildAt(1).y = layout.cardSize - layout.tileSize/2;
    item.container.getChildAt(1).zIndex = 1;
    item.container.getChildAt(1).alpha = 0.75;
    item.container.getChildAt(1).interactive = true;
    item.container.getChildAt(1).buttonMode = item.container.getChildAt(1).visible;
    item.container.getChildAt(1).on("pointerdown", hidePurpleConnect);

    item.container.getChildAt(2).x = layout.tileSize/2 + layout.tileSize;
    item.container.getChildAt(2).y = layout.cardSize - layout.tileSize/2;
    item.container.getChildAt(2).zIndex = 1;
    item.container.getChildAt(2).alpha = 0.75;
    item.container.getChildAt(2).interactive = true;
    item.container.getChildAt(2).buttonMode = item.container.getChildAt(2).visible
    item.container.getChildAt(2).on("pointerdown", hideGreenConnect);

    item.container.getChildAt(3).x = layout.tileSize/2 + layout.tileSize * 2;
    item.container.getChildAt(3).y = layout.cardSize - layout.tileSize/2;
    item.container.getChildAt(3).zIndex = 1;
    item.container.getChildAt(3).alpha = 0.75;
    item.container.getChildAt(3).interactive = true;
    item.container.getChildAt(3).buttonMode = item.container.getChildAt(3).visible
    item.container.getChildAt(3).on("pointerdown", hideBlueConnect);

    item.container.getChildAt(4).x = layout.tileSize/2 + layout.tileSize * 3;
    item.container.getChildAt(4).y = layout.cardSize - layout.tileSize/2;
    item.container.getChildAt(4).zIndex = 1;
    item.container.getChildAt(4).alpha = 0.75;
    item.container.getChildAt(4).interactive = true;
    item.container.getChildAt(4).buttonMode = item.container.getChildAt(4).visible
    item.container.getChildAt(4).on("pointerdown", hideYellowConnect);

/*  
    item.container.getChildAt(5).x = layout.tileSize/2 + layout.tileSize * 4;
    item.container.getChildAt(5).y = layout.cardSize - layout.tileSize/2;
    item.container.getChildAt(5).zIndex = 1;
    item.container.getChildAt(5).alpha = 0.75;
    item.container.getChildAt(5).interactive = true;
    item.container.getChildAt(5).buttonMode = item.container.getChildAt(5).visible
    item.container.getChildAt(5).on("pointerdown", hidePinkConnect);

    item.container.getChildAt(6).x = layout.tileSize/2 + layout.tileSize * 5;
    item.container.getChildAt(6).y = layout.cardSize - layout.tileSize/2;
    item.container.getChildAt(6).zIndex = 1;
    item.container.getChildAt(6).alpha = 0.75;
    item.container.getChildAt(6).interactive = true;
    item.container.getChildAt(6).buttonMode = item.container.getChildAt(6).visible
    item.container.getChildAt(6).on("pointerdown", hideAquaConnect);

    item.container.getChildAt(7).x = layout.tileSize/2 + layout.tileSize * 6;
    item.container.getChildAt(7).y = layout.cardSize - layout.tileSize/2;
    item.container.getChildAt(7).zIndex = 1;
    item.container.getChildAt(7).alpha = 0.75;
    item.container.getChildAt(7).interactive = true;
    item.container.getChildAt(7).buttonMode = item.container.getChildAt(7).visible
    item.container.getChildAt(7).on("pointerdown", hideOrangeConnect);

    item.container.getChildAt(8).x = layout.tileSize/2 + layout.tileSize * 7;
    item.container.getChildAt(8).y = layout.cardSize - layout.tileSize/2;
    item.container.getChildAt(8).zIndex = 1;
    item.container.getChildAt(8).alpha = 0.75;
    item.container.getChildAt(8).interactive = true;
    item.container.getChildAt(8).buttonMode = item.container.getChildAt(8).visible
    item.container.getChildAt(8).on("pointerdown", hideSuperPurpleConnect);

    item.container.getChildAt(9).x = layout.tileSize/2 + layout.tileSize * 8;
    item.container.getChildAt(9).y = layout.cardSize - layout.tileSize/2;
    item.container.getChildAt(9).zIndex = 1;
    item.container.getChildAt(9).alpha = 0.75;
    item.container.getChildAt(9).interactive = true;
    item.container.getChildAt(9).buttonMode = item.container.getChildAt(9).visible
    item.container.getChildAt(9).on("pointerdown", hideSuperGreenConnect);

    item.container.getChildAt(10).x = layout.tileSize/2 + layout.tileSize * 9;
    item.container.getChildAt(10).y = layout.cardSize - layout.tileSize/2;
    item.container.getChildAt(10).zIndex = 1;
    item.container.getChildAt(10).alpha = 0.75;
    item.container.getChildAt(10).interactive = true;
    item.container.getChildAt(10).buttonMode = item.container.getChildAt(10).visible
    item.container.getChildAt(10).on("pointerdown", hideSuperBlueConnect);

    item.container.getChildAt(11).x = layout.tileSize/2 + layout.tileSize * 10;
    item.container.getChildAt(11).y = layout.cardSize - layout.tileSize/2;
    item.container.getChildAt(11).zIndex = 1;
    item.container.getChildAt(11).alpha = 0.75;
    item.container.getChildAt(11).interactive = true;
    item.container.getChildAt(11).buttonMode = item.container.getChildAt(11).visible
    item.container.getChildAt(11).on("pointerdown", hideSuperYellowConnect);

    item.container.getChildAt(12).x = layout.tileSize/2 + layout.tileSize * 11;
    item.container.getChildAt(12).y = layout.cardSize - layout.tileSize/2;
    item.container.getChildAt(12).zIndex = 1;
    item.container.getChildAt(12).alpha = 0.75;
    item.container.getChildAt(12).interactive = true;
    item.container.getChildAt(12).buttonMode = item.container.getChildAt(12).visible
    item.container.getChildAt(12).on("pointerdown", hideSuperPinkConnect);

    item.container.getChildAt(13).x = layout.tileSize/2 + layout.tileSize * 12;
    item.container.getChildAt(13).y = layout.cardSize - layout.tileSize/2;
    item.container.getChildAt(13).zIndex = 1;
    item.container.getChildAt(13).alpha = 0.75;
    item.container.getChildAt(13).interactive = true;
    item.container.getChildAt(13).buttonMode = item.container.getChildAt(13).visible
    item.container.getChildAt(13).on("pointerdown", hideSuperAquaConnect);

    item.container.getChildAt(14).x = layout.tileSize/2 + layout.tileSize * 13;
    item.container.getChildAt(14).y = layout.cardSize - layout.tileSize/2;
    item.container.getChildAt(14).zIndex = 1;
    item.container.getChildAt(14).alpha = 0.75;
    item.container.getChildAt(14).interactive = true;
    item.container.getChildAt(14).buttonMode = item.container.getChildAt(14).visible
    item.container.getChildAt(14).on("pointerdown", hideSuperOrangeConnect);
*/
    item.container.getChildAt(5).x = layout.cardSize - layout.tileSize/2;
    item.container.getChildAt(5).y = layout.cardSize - layout.tileSize/2;
    item.container.getChildAt(5).zIndex = 1;
    item.container.getChildAt(5).interactive = true;
    item.container.getChildAt(5).buttonMode = true;
    item.container.getChildAt(5).menuExist = false;
    item.container.getChildAt(5).on("pointerdown", popup);

    item.container.getChildAt(6).height = layout.tileSize/2;
    //item.container.getChildAt(6).width = layout.tileSize;
    item.container.getChildAt(6).zIndex = 2;
    item.container.getChildAt(6).anchor.set(0.5);
    item.container.getChildAt(6).x = layout.cardSize - layout.tileSize/2;
    item.container.getChildAt(6).y = layout.cardSize - layout.tileSize/2;
    item.container.getChildAt(6).text = "";

    PIXIapp.stage.addChild(item.container);
}



//onDragStart, onDragEnd, and onDragMove inspired from https://pixijs.io/examples/index.html?s=demos&f=dragging.js&title=Dragging#/interaction/dragging.js
//allows for drag and drop functionality
function onDragStart(event) {
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
}

function onDragEnd() {
    this.alpha = 1;
    this.dragging = false;
    this.data = null;

    for (let i = 0; i < cards.length; i++) {
        if(cards[i].container.getBounds().contains(this.getBounds().x, this.getBounds().y)){
            if(this.color == colors.drkpurple)
            {
                cards[i].connections[0] = true;
                sendState()
            }
            else if(this.color === colors.drkgreen)
            {
                cards[i].connections[1] = true;
                sendState()
            }
            else if(this.color === colors.drkblue)
            {
                cards[i].connections[2] = true;
                sendState()
            }
            else if(this.color === colors.drkyellow)
            {
                cards[i].connections[3] = true;
                sendState()
            }
            else if(this.color === colors.drkpink)
            {
              cards[i].connections[4] = true;
              sendState()
            }
            else if(this.color === colors.drkaqua)
            {
              cards[i].connections[5] = true;
              sendState()
            }
            else if(this.color === colors.drkorange)
            {
              cards[i].connections[6] = true;
              sendState()
            }
            else if(this.color === colors.superdrkpurple)
            {
              cards[i].connections[7] = true;
              sendState()
            }
            else if(this.color === colors.superdrkgreen)
            {
              cards[i].connections[8] = true;
              sendState()
            }
            else if(this.color === colors.superdrkblue)
            {
              cards[i].connections[9] = true;
              sendState()
            }
            else if(this.color === colors.superdrkyellow)
            {
              cards[i].connections[10] = true;
              sendState()
            }
            else if(this.color === colors.superdrkpink)
            {
              cards[i].connections[11] = true;
              sendState()
            }
            else if(this.color === colors.superdrkaqua)
            {
              cards[i].connections[12] = true;
              sendState()
            }
            else if(this.color === colors.superdrkorange)
            {
              cards[i].connections[13] = true;
              sendState()
            }
          
            //break;
        }

    }
    this.x = this.home_x;
    this.y = this.home_y;

}

function onDragMove() {
    if (this.dragging) {
        const newPosition = this.data.getLocalPosition(this.parent);
        this.x = newPosition.x;
        this.y = newPosition.y;
    }
}

function popup(){
    if(this.menuExist === false){
        menu = new PIXI.Container();
        menu.interactive = true;
        menu.height = layout.tileSize * 4;
        menu.width = layout.tileSize * 4;
        menu.zIndex = 10;
        menu.addChild(
            new PIXI.Graphics().beginFill(0xECFFF5).drawRect(0,0,layout.tileSize * 4,layout.tileSize).endFill(),
            new PIXI.Graphics().beginFill(0xF6F1FF).drawRect(0,0,layout.tileSize * 4,layout.tileSize).endFill(),
            new PIXI.Graphics().beginFill(0xDAE5F5).drawRect(0,0,layout.tileSize * 4,layout.tileSize).endFill(),
            new PIXI.Graphics().beginFill(0xFFF9DB).drawRect(0,0,layout.tileSize * 4,layout.tileSize).endFill()
        );

        menu.getChildAt(0).position.set(0,0);
        menu.getChildAt(0).interactive = true;
        menu.getChildAt(0).on("pointerdown", setBlank);
        menu.getChildAt(0).zIndex = 10;
        blank = new PIXI.Text('blank', {"textBaseline": "alpahbetic"});
        menu.getChildAt(0).addChild(blank);
        blank.x = layout.tileSize;
        blank.y = layout.tileSize/4;

        menu.getChildAt(1).position.set(0,layout.tileSize * 1);
        menu.getChildAt(1).interactive = true;
        menu.getChildAt(1).on("pointerdown", setOkay);
        menu.getChildAt(1).zIndex = 10;
        okay = new PIXI.Text('okay', {"textBaseline": "alpahbetic"});
        menu.getChildAt(1).addChild(okay);
        okay.x = layout.tileSize;
        okay.y = layout.tileSize/4;

        menu.getChildAt(2).position.set(0,layout.tileSize * 2);
        menu.getChildAt(2).interactive = true;
        menu.getChildAt(2).on("pointerdown", setPermit);
        menu.getChildAt(2).zIndex = 10;
        permit = new PIXI.Text('permit', {"textBaseline": "alpahbetic"});
        menu.getChildAt(2).addChild(permit);
        permit.x = layout.tileSize;
        permit.y = layout.tileSize/4;

        menu.getChildAt(3).position.set(0,layout.tileSize * 3);
        menu.getChildAt(3).interactive = true;
        menu.getChildAt(3).on("pointerdown", setChallenge);
        menu.getChildAt(3).zIndex = 10;
        challenge = new PIXI.Text('challenge', {"textBaseline": "alpahbetic"});
        menu.getChildAt(3).addChild(challenge);
        challenge.x = layout.tileSize;
        challenge.y = layout.tileSize/4;

        menu.on("pointerdown", removePopup);

        this.addChild(menu);

        menu.x = -(layout.tileSize * 4) + (layout.tileSize / 2)
        menu.y = -(layout.tileSize * 4) - (layout.tileSize / 2)
    }
    this.menuExist = true;

}

//the following 4 set functions set the die state to the chosen state
function setBlank(){
    this.parent.parent.parent.cardParent.dieState = 'blank';
    sendState()
}

function setOkay(){
    this.parent.parent.parent.cardParent.dieState = 'okay';
    sendState()
}

function setPermit(){
    this.parent.parent.parent.cardParent.dieState = 'permit';
    sendState()
}

function setChallenge(){
    this.parent.parent.parent.cardParent.dieState = 'challenge';
    sendState()
}

//removes the popup menu
function removePopup(){
    this.parent.menuExist = false;
    this.destroy()
}

//the following 4 functions hides the connection tile on the card when the tile is clicked on
function hidePurpleConnect(){
    this.parent.cardParent.connections[0] = false;
    sendState()
}

function hideGreenConnect(){
    this.parent.cardParent.connections[1] = false;
    sendState()
}

function hideBlueConnect(){
    this.parent.cardParent.connections[2] = false;
    sendState()
}

function hideYellowConnect(){
    this.parent.cardParent.connections[3] = false;
    sendState()
}

function hidePinkConnect(){
  this.parent.cardParent.connections[4] = false;
  sendState()
}

function hideAquaConnect(){
  this.parent.cardParent.connections[5] = false;
  sendState()
}

function hideOrangeConnect(){
  this.parent.cardParent.connections[6] = false;
  sendState()
}

function hideSuperPurpleConnect(){
  this.parent.cardParent.connections[7] = false;
  sendState()
}

function hideSuperGreenConnect(){
  this.parent.cardParent.connections[8] = false;
  sendState()
}

function hideSuperBlueConnect(){
  this.parent.cardParent.connections[9] = false;
  sendState()
}

function hideSuperYellowConnect(){
  this.parent.cardParent.connections[10] = false;
  sendState()
}

function hideSuperPinkConnect(){
  this.parent.cardParent.connections[11] = false;
  sendState()
}

function hideSuperAquaConnect(){
  this.parent.cardParent.connections[12] = false;
  sendState()
}

function hideSuperOrangeConnect(){
  this.parent.cardParent.connections[13] = false;
  sendState()
}

//shows the cards name when event occurs
function showName(){
    if(this.showingName === false) {
        nameDisplay = new PIXI.Graphics().beginFill(0xD3D3D3).drawRect(0,0,layout.tileSize * 4,layout.tileSize).endFill();
        nameDisplay.interactive = true;
        nameDisplay.height = layout.tileSize ;
        nameDisplay.width = layout.tileSize * 4;
        nameDisplay.zIndex = 10;

        nameDisplay.addChild(new PIXI.Text(this.parent.cardParent.name, {"textBaseline": "alpahbetic"}))

        this.addChild(nameDisplay);

        nameDisplay.position.set(0,0);
        this.showingName = true;
    }
}

//hides the cards name when even occurs
function hideName() {
    if(this.showingName === true){
        this.getChildAt(0).destroy();
        this.showingName = false;
    }
}