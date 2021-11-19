let type = "WebGL";
if (!PIXI.utils.isWebGLSupported()) {
    type = "canvas";
}

let definedCards = ["contemplation", "fundamental_theorem_of_calculus", "gestalt", "hidden_potential", "magic", "multiplication_of_mechanical_advantage", "nature_tending_towards_perfection", "ontogeny_recapitulates_philogeny", "species_specific_norms", "structured_improvisation", "synergy", "wavicle"]

PIXI.utils.sayHello(type);

//layout variables
let layout = {
    cardSize: 600,
    tileSize: 100,
    boardHeight: 900,
    boardWidth: 1440,
    zoomButtonSize: 60
    //boardSize: 1500
}

let PIXIstyle = new PIXI.TextStyle({
  textBaseline: "alphabetic",
  fontWeight: 750,
  fontFamily: "IBM Plex Sans Condensed",
  fontSize: 42,
  padding: 30
})

const PIXIapp = new PIXI.Application({

    resizeTo: document.getElementById("divBoard"),
    antialias: true,
    transparent: false,
    resolution: 1
});



let ticker = new PIXI.Ticker();
ticker.autoStart = false;
ticker.stop();
/*
card representated by
{
  name:string, (must be exactly as in the card's image)
  connections: //active is if tile is visible, number is the move number(default 0 for error state), state is string ("number", okay", "permit", or "challenge")
  [
{
  active: false,
  number: 0,
  state: "number"
},{
  active: false,
  number: 0,
  state: "number"
},{
  active: false,
  number: 0,
  state: "number"
},{
  active: false,
  number: 0,
  state: "number"
}
],
  cardFlipped: bool,
  moveMade: '',
}
*/
let colors = {
    purple: 0xB38BFC,
    green: 0x53FCA2,
    blue: 0x7EB2FC,
    yellow: 0xFFE76E
}

//to be pulled from gamestate code
let cards;
let scale = 0.3;
let zoomIncrement = 0.05;

function pixiStart(boardState){

  cards = boardState;

  cards.forEach(load);
  PIXI.Loader.shared.load(setup);
  document.getElementById("divBoard").appendChild(PIXIapp.view);
};

//load all textures here, then setup is called
function load(item){
  if(PIXI.Loader.shared.resources["../images/4x4x150cards/" + item.name + ".png"] === undefined){
    PIXI.Loader.shared.add("../images/4x4x150cards/" + item.name + ".png");
    PIXI.Loader.shared.add("../images/4x4x150cards/" + item.name + "_text.png");
  }
}

function sendState(){

  let board = []

  cards.forEach((item) => {
    board.push(
      {
          name: item.name,
          connections: item.connections,
          cardFlipped: item.cardFlipped,
          moveMade: item.moveMade,
      }
    )
  });

  const gameDataOut = {
    "method": "play",
    "playerId": playerId,
    "gameId": gameId,
    "boardState": board
  }

  ws.send(JSON.stringify(gameDataOut));
}

//interface for adding connections
let connectPalate = null;

//interface for zooming in and out
let zoomControl = null;

var initialWidth = window.innerWidth;
var resizeRatio = 1;

function setup() { //sets all cards up with their default states
    cards.forEach(cardSetup);

    ticker.add(function (time) {
      //Update tiles and die state
      for (let i = 0; i < cards.length; i++){
        cards[i].connections.forEach((item, j) => {
          cards[i].container.getChildAt(j+1).visible = item.active;
          if(item.active){
            switch (item.state){
              case "number":
                cards[i].container.getChildAt(j+1).getChildAt(0).text = item.number.toString();
                break;
              case "okay":
                cards[i].container.getChildAt(j+1).getChildAt(0).text = 'O';
                break;
              case "permit":
                cards[i].container.getChildAt(j+1).getChildAt(0).text = 'P';
                break;
              case "challenge":
                cards[i].container.getChildAt(j+1).getChildAt(0).text = 'C';
                break;
              default:
                console.log("Tile state on " + cards[i].name + " not recognied");
            }
          }

        });


        cards[i].container.getChildAt(1).visible = cards[i].connections[0].active;
        cards[i].container.getChildAt(2).visible = cards[i].connections[1].active;
        cards[i].container.getChildAt(3).visible = cards[i].connections[2].active;
        cards[i].container.getChildAt(4).visible = cards[i].connections[3].active;
        cards[i].container.getChildAt(0).getChildAt(0).visible = cards[i].cardFlipped;
      }

      //Update card position and scale
      let rowWidth = Math.floor(PIXIapp.screen.width / (layout.cardSize * scale * 1.5));

      connectPalate.position.set(PIXIapp.screen.width, PIXIapp.screen.height / 2);
      zoomControl.position.set(PIXIapp.screen.width,0);

      cards.forEach((item, i) => {
        item.container.scale.set(scale);

        item.container.position.set((PIXIapp.screen.width/(rowWidth+1)) * ( (i%rowWidth) + 1),
                                    (layout.cardSize * scale * 1.2) * ((i-(i%rowWidth))/rowWidth) + (layout.cardSize * scale * 0.6));
      });


      document.getElementById("divBoard").style.height = String(layout.cardSize * scale * (Math.ceil(cards.length/rowWidth) * 1.25)) + "px";
      PIXIapp.resizeTo = document.getElementById("divBoard");


        let endWidth = window.innerWidth;
        resizeRatio = endWidth / initialWidth;
        initialWidth = endWidth;

        scale = scale * resizeRatio;
      
      clampZoom();


    
    }); //card state update from internal, every frame

    
    setupPalate();
    setupZoom();

    ticker.start();


}

function setupZoom(){
  zoomControl = new PIXI.Container();
  zoomControl.height = 2*layout.zoomButtonSize;
  zoomControl.width = layout.zoomButtonSize;
  zoomControl.zindex = 3;
  zoomControl.pivot.set(layout.zoomButtonSize, 0);
  zoomControl.position.set(PIXIapp.screen.width,0);

  zoomControl.addChild(
    new PIXI.Graphics().lineStyle(10,0x000000).beginFill(0xdee0e3).drawRect(0,0,layout.zoomButtonSize,layout.zoomButtonSize).endFill().drawRect(0,0,layout.zoomButtonSize,layout.zoomButtonSize),
    new PIXI.Graphics().lineStyle(10,0x000000).beginFill(0xdee0e3).drawRect(0,layout.zoomButtonSize,layout.zoomButtonSize,layout.zoomButtonSize).endFill().drawRect(0,0,layout.zoomButtonSize,layout.zoomButtonSize)
  )
  zoomControl.getChildAt(0).addChild(new PIXI.Text("+", PIXIstyle));
  zoomControl.getChildAt(0).getChildAt(0).height = 0.8 * layout.zoomButtonSize;
  zoomControl.getChildAt(0).getChildAt(0).scale.x = zoomControl.getChildAt(0).getChildAt(0).scale.y;
  zoomControl.getChildAt(0).getChildAt(0).anchor.set(0.5,0.5);

  zoomControl.getChildAt(0).getChildAt(0).position.set(layout.zoomButtonSize/2,layout.zoomButtonSize/2);
  zoomControl.getChildAt(0).on("pointerdown", plusZoom);

  zoomControl.getChildAt(0).interactive = true;
  zoomControl.getChildAt(0).buttonMode = true;

  zoomControl.getChildAt(1).addChild(new PIXI.Text("-", PIXIstyle));
  zoomControl.getChildAt(1).getChildAt(0).height = 0.8 * layout.zoomButtonSize;
  zoomControl.getChildAt(1).getChildAt(0).scale.x = zoomControl.getChildAt(1).getChildAt(0).scale.y;
  zoomControl.getChildAt(1).getChildAt(0).anchor.set(0.5,0.5);

  zoomControl.getChildAt(1).getChildAt(0).position.set(layout.zoomButtonSize/2,layout.zoomButtonSize*3/2);
  zoomControl.getChildAt(1).on("pointerdown", minusZoom);

  zoomControl.getChildAt(1).interactive = true;
  zoomControl.getChildAt(1).buttonMode = true;

  PIXIapp.stage.addChild(zoomControl);
}

function plusZoom(){
  scale += zoomIncrement;
}

function minusZoom(){
  scale -= zoomIncrement;
}

function clampZoom(){
  let maxZoom = (PIXIapp.screen.width) / (2.5 * layout.cardSize);
  let minZoom = (PIXIapp.screen.width - 2*layout.tileSize) / ( (Math.ceil(Math.sqrt(cards.length))) * layout.cardSize * 1.5 );

  if(scale > maxZoom){
    scale = maxZoom;
    console.log("set to max")
  }else if (scale < minZoom) {
    scale = minZoom;
    console.log("set to min")
  }
}


function setupPalate(){
    connectPalate = new PIXI.Container();
    connectPalate.height = layout.zoomButtonSize * 4;
    connectPalate.width = layout.zoomButtonSize;
    connectPalate.zIndex = 3;
    connectPalate.pivot.set(layout.zoomButtonSize, layout.zoomButtonSize*2);
    connectPalate.position.set(PIXIapp.screen.width, PIXIapp.screen.height / 2);
    connectPalate.addChild(
        new PIXI.Graphics().beginFill(0xB38BFC).drawRect(0,0,layout.zoomButtonSize,layout.zoomButtonSize).endFill(),
        new PIXI.Graphics().beginFill(0x53FCA2).drawRect(0,0,layout.zoomButtonSize,layout.zoomButtonSize).endFill(),
        new PIXI.Graphics().beginFill(0x7EB2FC).drawRect(0,0,layout.zoomButtonSize,layout.zoomButtonSize).endFill(),
        new PIXI.Graphics().beginFill(0xFFE76E).drawRect(0,0,layout.zoomButtonSize,layout.zoomButtonSize).endFill()
    );

    connectPalate.getChildAt(0).interactive = true;
    connectPalate.getChildAt(0).buttonMode = true;
    connectPalate.getChildAt(0).zIndex = 5;
    connectPalate.getChildAt(0).color = colors.purple;
    connectPalate.getChildAt(0).on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove);

    connectPalate.getChildAt(1).interactive = true;
    connectPalate.getChildAt(1).buttonMode = true;
    connectPalate.getChildAt(1).zIndex = 5;
    connectPalate.getChildAt(1).color = colors.green;
    connectPalate.getChildAt(1).on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove);

    connectPalate.getChildAt(2).interactive = true;
    connectPalate.getChildAt(2).buttonMode = true;
    connectPalate.getChildAt(2).zIndex = 5;
    connectPalate.getChildAt(2).color = colors.blue;
    connectPalate.getChildAt(2).on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove);

    connectPalate.getChildAt(3).interactive = true;
    connectPalate.getChildAt(3).buttonMode = true;
    connectPalate.getChildAt(3).zIndex = 5;
    connectPalate.getChildAt(3).color = colors.yellow;
    connectPalate.getChildAt(3).on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove);

    connectPalate.getChildAt(0).position.set(0,0);
    connectPalate.getChildAt(0).home_x = connectPalate.getChildAt(0).x;
    connectPalate.getChildAt(0).home_y = connectPalate.getChildAt(0).y;

    connectPalate.getChildAt(1).position.set(0,layout.zoomButtonSize * 1);
    connectPalate.getChildAt(1).home_x = connectPalate.getChildAt(1).x;
    connectPalate.getChildAt(1).home_y = connectPalate.getChildAt(1).y;

    connectPalate.getChildAt(2).position.set(0,layout.zoomButtonSize * 2);
    connectPalate.getChildAt(2).home_x = connectPalate.getChildAt(2).x;
    connectPalate.getChildAt(2).home_y = connectPalate.getChildAt(2).y;

    connectPalate.getChildAt(3).position.set(0,layout.zoomButtonSize * 3);
    connectPalate.getChildAt(3).home_x = connectPalate.getChildAt(3).x;
    connectPalate.getChildAt(3).home_y = connectPalate.getChildAt(3).y;



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
                            new PIXI.Graphics().beginFill(0xFFE76E).drawRect(layout.tileSize/-2,layout.tileSize/-2,layout.tileSize,layout.tileSize).endFill()
                           );

    //reference to card object in cards array
    item.container.cardParent = item;

    item.container.getChildAt(0).x = 0;
    item.container.getChildAt(0).y = 0;
    item.container.getChildAt(0).zIndex = 0;
    item.container.getChildAt(0).interactive = true;
    item.container.getChildAt(0).showingName = false;
    item.container.getChildAt(0).on('pointerdown',showText)
        .on('pointerup', hideText)
        .on('pointerupoutside', hideText);

    cardText = new PIXI.Container();
    cardText.height = 600;
    cardText.width = 600;
    cardText.zIndex = 1;
    cardText.addChild(new PIXI.Sprite(PIXI.Loader.shared.resources["../images/4x4x150cards/" + item.name + "_text.png"].texture));
    cardText.visible = false;
    item.container.getChildAt(0).addChild(cardText);

    item.container.getChildAt(1).x = layout.tileSize/2;
    item.container.getChildAt(1).y = layout.cardSize - layout.tileSize/2;
    item.container.getChildAt(1).zIndex = 1;
    item.container.getChildAt(1).alpha = 0.75;
    item.container.getChildAt(1).interactive = true;
    item.container.getChildAt(1).buttonMode = item.container.getChildAt(1).visible;
    item.container.getChildAt(1).addChild(new PIXI.Text('0', PIXIstyle));
    item.container.getChildAt(1).getChildAt(0).height = layout.tileSize;
    item.container.getChildAt(1).getChildAt(0).scale.x = item.container.getChildAt(1).getChildAt(0).scale.y;
    item.container.getChildAt(1).getChildAt(0).zIndex = 2;
    item.container.getChildAt(1).getChildAt(0).anchor.set(0.5);
    item.container.getChildAt(1).getChildAt(0).x = 0;
    item.container.getChildAt(1).getChildAt(0).y = 0;
    item.container.getChildAt(1).on("pointerdown", openTileMenu);
    item.container.getChildAt(1).connectionIndex = 0;
    item.container.getChildAt(1).menuExist = false;
    item.container.getChildAt(1).color = colors.purple;

    item.container.getChildAt(2).x = layout.tileSize/2 + layout.tileSize;
    item.container.getChildAt(2).y = layout.cardSize - layout.tileSize/2;
    item.container.getChildAt(2).zIndex = 1;
    item.container.getChildAt(2).alpha = 0.75;
    item.container.getChildAt(2).interactive = true;
    item.container.getChildAt(2).buttonMode = item.container.getChildAt(2).visible
    item.container.getChildAt(2).addChild(new PIXI.Text('0', PIXIstyle));
    item.container.getChildAt(2).getChildAt(0).height = layout.tileSize;
    item.container.getChildAt(2).getChildAt(0).scale.x = item.container.getChildAt(1).getChildAt(0).scale.y;
    item.container.getChildAt(2).getChildAt(0).zIndex = 2;
    item.container.getChildAt(2).getChildAt(0).anchor.set(0.5);
    item.container.getChildAt(2).getChildAt(0).x = 0;
    item.container.getChildAt(2).getChildAt(0).y = 0;
    item.container.getChildAt(2).on("pointerdown", openTileMenu);
    item.container.getChildAt(2).connectionIndex = 1;
    item.container.getChildAt(2).menuExist = false;
    item.container.getChildAt(2).color = colors.green;

    item.container.getChildAt(3).x = layout.tileSize/2 + layout.tileSize * 2;
    item.container.getChildAt(3).y = layout.cardSize - layout.tileSize/2;
    item.container.getChildAt(3).zIndex = 1;
    item.container.getChildAt(3).alpha = 0.75;
    item.container.getChildAt(3).interactive = true;
    item.container.getChildAt(3).buttonMode = item.container.getChildAt(3).visible
    item.container.getChildAt(3).addChild(new PIXI.Text('0', PIXIstyle));
    item.container.getChildAt(3).getChildAt(0).height = layout.tileSize;
    item.container.getChildAt(3).getChildAt(0).scale.x = item.container.getChildAt(1).getChildAt(0).scale.y;
    item.container.getChildAt(3).getChildAt(0).zIndex = 2;
    item.container.getChildAt(3).getChildAt(0).anchor.set(0.5);
    item.container.getChildAt(3).getChildAt(0).x = 0;
    item.container.getChildAt(3).getChildAt(0).y = 0;
    item.container.getChildAt(3).on("pointerdown", openTileMenu);
    item.container.getChildAt(3).connectionIndex = 2;
    item.container.getChildAt(3).menuExist = false;
    item.container.getChildAt(3).color = colors.blue;

    item.container.getChildAt(4).x = layout.tileSize/2 + layout.tileSize * 3;
    item.container.getChildAt(4).y = layout.cardSize - layout.tileSize/2;
    item.container.getChildAt(4).zIndex = 1;
    item.container.getChildAt(4).alpha = 0.75;
    item.container.getChildAt(4).interactive = true;
    item.container.getChildAt(4).buttonMode = item.container.getChildAt(4).visible
    item.container.getChildAt(4).addChild(new PIXI.Text('0', PIXIstyle));
    item.container.getChildAt(4).getChildAt(0).height = layout.tileSize;
    item.container.getChildAt(4).getChildAt(0).scale.x = item.container.getChildAt(1).getChildAt(0).scale.y;
    item.container.getChildAt(4).getChildAt(0).zIndex = 2;
    item.container.getChildAt(4).getChildAt(0).anchor.set(0.5);
    item.container.getChildAt(4).getChildAt(0).x = 0;
    item.container.getChildAt(4).getChildAt(0).y = 0;
    item.container.getChildAt(4).on("pointerdown", openTileMenu);
    item.container.getChildAt(4).connectionIndex = 3;
    item.container.getChildAt(4).menuExist = false;
    item.container.getChildAt(4).color = colors.yellow;

    PIXIapp.stage.addChild(item.container);
}


//onDragStart, onDragEnd, and onDragMove inspired by https://pixijs.io/examples/index.html?s=demos&f=dragging.js&title=Dragging#/interaction/dragging.js
//allows for drag and drop functionality
function onDragStart(event) {
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
}

function onDragMove() {
  if (this.dragging) {
      const newPosition = this.data.getLocalPosition(this.parent);
      this.x = newPosition.x;
      this.y = newPosition.y;
  }
}

function onDragEnd() {
    this.alpha = 1;
    this.dragging = false;
    this.data = null;

    for (let i = 0; i < cards.length; i++) {
        if(cards[i].container.getBounds().contains(this.getBounds().x, this.getBounds().y)){
            if(this.color == colors.purple)
            {
              if(cards[i].connections[0].active === false){
                cards[i].connections[0].active = true;
                cards[i].connections[0].number = nextMoveNumber();
                cards[i].moveMade = "placed a purple tile numbered '" + cards[i].connections[0].number +  "' on '" + cleanName(cards[i].name) + "'";
                sendState()
              }
            }
            else if(this.color === colors.green)
            {
              if(cards[i].connections[1].active === false){
                cards[i].connections[1].active = true;
                cards[i].connections[1].number = nextMoveNumber();
                cards[i].moveMade = "placed a green tile numbered '" + cards[i].connections[1].number +  "' on '" + cleanName(cards[i].name) + "'";
                sendState()
              }
            }
            else if(this.color === colors.blue)
            {
              if(cards[i].connections[2].active === false){
                cards[i].connections[2].active = true;
                cards[i].connections[2].number = nextMoveNumber();
                cards[i].moveMade = "placed a blue tile numbered '" + cards[i].connections[2].number +  "' on '" + cleanName(cards[i].name) + "'";
                sendState()
              }
            }
            else if(this.color === colors.yellow)
            {
              if(cards[i].connections[3].active === false){
                cards[i].connections[3].active = true;
                cards[i].connections[3].number = nextMoveNumber();
                cards[i].moveMade = "placed a yellow tile numbered '" + cards[i].connections[3].number +  "' on '" + cleanName(cards[i].name) + "'";
                sendState()
              }
            }
        }

    }
    this.x = this.home_x;
    this.y = this.home_y;

}

function nextMoveNumber(){
  let largest = 0;
  cards.forEach((card) => {
    card.connections.forEach((connection) => {
      if(connection.number > largest){
        largest = connection.number;
      }
    });
  });
  return largest + 1;
}

function openTileMenu(){
    if(this.menuExist === false){
        menu = new PIXI.Container();
        menu.interactive = true;
        menu.height = layout.tileSize * 5;
        menu.width = layout.tileSize * 4;
        menu.zIndex = 10;
        menu.alpha = 4/3; //4/3 to compensate for starting at 0.75 alpha on tile to result in alpha of 1
        menu.addChild(
            new PIXI.Graphics().lineStyle(5,0x000000).beginFill(0xdee0e3).drawRect(0,0,layout.tileSize * 4,layout.tileSize).endFill(),
            new PIXI.Graphics().lineStyle(5,0x000000).beginFill(0xdee0e3).drawRect(0,0,layout.tileSize * 4,layout.tileSize).endFill(),
            new PIXI.Graphics().lineStyle(5,0x000000).beginFill(0xdee0e3).drawRect(0,0,layout.tileSize * 4,layout.tileSize).endFill(),
            new PIXI.Graphics().lineStyle(5,0x000000).beginFill(0xdee0e3).drawRect(0,0,layout.tileSize * 4,layout.tileSize).endFill(),
            new PIXI.Graphics().lineStyle(5,0x000000).beginFill(0xdee0e3).drawRect(0,0,layout.tileSize * 4,layout.tileSize).endFill()
        );

        menu.getChildAt(0).position.set(0,0);
        menu.getChildAt(0).interactive = true;
        menu.getChildAt(0).on("pointerdown", setNumber);
        menu.getChildAt(0).zIndex = 10;
        number = new PIXI.Text('number', PIXIstyle);
        menu.getChildAt(0).addChild(number);
        number.height = layout.tileSize;
        number.x = 0;
        number.y = 0;
        number.scale.x = number.scale.y;

        menu.getChildAt(1).position.set(0,layout.tileSize * 1);
        menu.getChildAt(1).interactive = true;
        menu.getChildAt(1).on("pointerdown", setOkay);
        menu.getChildAt(1).zIndex = 10;
        okay = new PIXI.Text('okay', PIXIstyle);
        menu.getChildAt(1).addChild(okay);
        okay.height = layout.tileSize;
        okay.x = 0;
        okay.y = 0;
        okay.scale.x = okay.scale.y;

        menu.getChildAt(2).position.set(0,layout.tileSize * 2);
        menu.getChildAt(2).interactive = true;
        menu.getChildAt(2).on("pointerdown", setPermit);
        menu.getChildAt(2).zIndex = 10;
        permit = new PIXI.Text('permit', PIXIstyle);
        menu.getChildAt(2).addChild(permit);
        permit.height = layout.tileSize;
        permit.x = 0;
        permit.y = 0;
        permit.scale.x = permit.scale.y;

        menu.getChildAt(3).position.set(0,layout.tileSize * 3);
        menu.getChildAt(3).interactive = true;
        menu.getChildAt(3).on("pointerdown", setChallenge);
        menu.getChildAt(3).zIndex = 10;
        challenge = new PIXI.Text('challenge', PIXIstyle);
        menu.getChildAt(3).addChild(challenge);
        challenge.height = layout.tileSize;
        challenge.x = 0;
        challenge.y = 0;
        challenge.scale.x = challenge.scale.y;

        menu.getChildAt(4).position.set(0,layout.tileSize * 4);
        menu.getChildAt(4).interactive = true;
        menu.getChildAt(4).on("pointerdown", removeConnection);
        menu.getChildAt(4).zIndex = 10;
        remove = new PIXI.Text('remove', PIXIstyle);
        menu.getChildAt(4).addChild(remove);
        remove.height = layout.tileSize;
        remove.x = 0;
        remove.y = 0;
        remove.scale.x = remove.scale.y;

        menu.on("pointerdown", closeTileMenu);

        this.addChild(menu);

        menu.x = -(layout.tileSize * 4) + (layout.tileSize / 2)
        menu.y = -(layout.tileSize * 5) - (layout.tileSize / 2)
        this.menuExist = true;
    }
}

//the following 5 set functions set the die state for each tile
function setNumber(){
    this.parent.parent.parent.cardParent.connections[this.parent.parent.connectionIndex].state = 'number';
    this.parent.parent.parent.cardParent.moveMade = "set the ";
    if(this.parent.parent.color === colors.purple){
      this.parent.parent.parent.cardParent.moveMade += "purple tile on '";
    } else if(this.parent.parent.color === colors.green){
      this.parent.parent.parent.cardParent.moveMade += "green tile on '";
    }else if(this.parent.parent.color === colors.blue){
      this.parent.parent.parent.cardParent.moveMade += "blue tile on '";
    }else if(this.parent.parent.color === colors.yellow){
      this.parent.parent.parent.cardParent.moveMade += "yellow tile on '";
    }
    this.parent.parent.parent.cardParent.moveMade += cleanName(this.parent.parent.parent.cardParent.name) + "' to '"
    + this.parent.parent.parent.cardParent.connections[this.parent.parent.connectionIndex].number + "'";
    sendState()
}

function setOkay(){
    this.parent.parent.parent.cardParent.connections[this.parent.parent.connectionIndex].state = 'okay';
    this.parent.parent.parent.cardParent.moveMade = "set the ";
    if(this.parent.parent.color === colors.purple){
      this.parent.parent.parent.cardParent.moveMade += "purple tile on '";
    } else if(this.parent.parent.color === colors.green){
      this.parent.parent.parent.cardParent.moveMade += "green tile on '";
    }else if(this.parent.parent.color === colors.blue){
      this.parent.parent.parent.cardParent.moveMade += "blue tile on '";
    }else if(this.parent.parent.color === colors.yellow){
      this.parent.parent.parent.cardParent.moveMade += "yellow tile on '";
    }
    this.parent.parent.parent.cardParent.moveMade += cleanName(this.parent.parent.parent.cardParent.name) + "' to 'okay'";
    sendState()
}

function setPermit(){
    this.parent.parent.parent.cardParent.connections[this.parent.parent.connectionIndex].state = 'permit'
    this.parent.parent.parent.cardParent.moveMade = "set the ";
    if(this.parent.parent.color === colors.purple){
      this.parent.parent.parent.cardParent.moveMade += "purple tile on '";
    } else if(this.parent.parent.color === colors.green){
      this.parent.parent.parent.cardParent.moveMade += "green tile on '";
    }else if(this.parent.parent.color === colors.blue){
      this.parent.parent.parent.cardParent.moveMade += "blue tile on '";
    }else if(this.parent.parent.color === colors.yellow){
      this.parent.parent.parent.cardParent.moveMade += "yellow tile on '";
    }
    this.parent.parent.parent.cardParent.moveMade += cleanName(this.parent.parent.parent.cardParent.name) + "' to 'permit'";
    sendState()
}

function setChallenge(){
    this.parent.parent.parent.cardParent.connections[this.parent.parent.connectionIndex].state = 'challenge';
    this.parent.parent.parent.cardParent.moveMade = "set the ";
    if(this.parent.parent.color === colors.purple){
      this.parent.parent.parent.cardParent.moveMade += "purple tile on '";
    } else if(this.parent.parent.color === colors.green){
      this.parent.parent.parent.cardParent.moveMade += "green tile on '";
    }else if(this.parent.parent.color === colors.blue){
      this.parent.parent.parent.cardParent.moveMade += "blue tile on '";
    }else if(this.parent.parent.color === colors.yellow){
      this.parent.parent.parent.cardParent.moveMade += "yellow tile on '";
    }
    this.parent.parent.parent.cardParent.moveMade += cleanName(this.parent.parent.parent.cardParent.name) + "' to 'challenge'";
    sendState()
}

function removeConnection(){
  let tileNumber = this.parent.parent.parent.cardParent.connections[this.parent.parent.connectionIndex].state;
  this.parent.parent.parent.cardParent.connections[this.parent.parent.connectionIndex].state = 'number';
  this.parent.parent.parent.cardParent.connections[this.parent.parent.connectionIndex].number = 0;
  this.parent.parent.parent.cardParent.connections[this.parent.parent.connectionIndex].active = false;
  this.parent.parent.parent.cardParent.moveMade = "removed a "
  if(this.parent.parent.color === colors.purple){
    this.parent.parent.parent.cardParent.moveMade += "purple ";
  } else if(this.parent.parent.color === colors.green){
    this.parent.parent.parent.cardParent.moveMade += "green ";
  }else if(this.parent.parent.color === colors.blue){
    this.parent.parent.parent.cardParent.moveMade += "blue ";
  }else if(this.parent.parent.color === colors.yellow){
    this.parent.parent.parent.cardParent.moveMade += "yellow ";
  }
  this.parent.parent.parent.cardParent.moveMade += "tile numbered '" + tileNumber + "' from '" + cleanName(this.parent.parent.parent.cardParent.name) + "'";
  sendState()
}

//removes the tile menu
function closeTileMenu(){
    this.parent.menuExist = false;
    this.destroy();
}

//shows the card text
function showText(){
    this.parent.cardParent.cardFlipped = true;
    sendState();
}

//hides the card text
function hideText(){
    this.parent.cardParent.cardFlipped = false;
    sendState();
}

//replaces "_" with " " and capitalizes the first letter of each word for better readability
function cleanName(name){
  let toShow = name.replaceAll('_', ' ');
  let words = toShow.split(' ');
  return words.map((word) => {return word[0].toUpperCase() + word.substring(1);}).join(" ");
}