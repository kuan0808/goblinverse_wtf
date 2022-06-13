import victory from "../images/victory.png";
import gameover from "../images/gameover.png";

import OverworldMap, { overworldMaps } from "./OverworldMap";
import KeyPressListener from "./KeyPressListener";

export default class Overworld {
  constructor(config) {
    this.element = config.element;
    this.tileSize = config.tileSize || 16;
    this.canvas = this.element.querySelector("canvas");
    this.canvas.width = this.element.clientWidth;
    this.canvas.height = this.element.clientHeight;
    this.overlay = this.element.querySelector("#game-overlay");
    this.ctx = this.canvas.getContext("2d");
    this.map = null;
    this.cameraPerson = null;
    this.cameraPosition = {
      x: (this.element.clientWidth / this.tileSize - 1) / 2,
      y: (this.element.clientHeight / this.tileSize - 1) / 2,
    };
    this.gameStatus = "playing";
  }

  step() {
    //Clear off the canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    //Establish the camera person
    this.cameraPerson = this.map.gameObjects.goblin;

    //Update all objects
    Object.values(this.map.gameObjects).forEach((object) => {
      object.update();
    });

    // Draw the map in order
    this.map.images.forEach((image, index) => {
      if (!image) {
        //Draw Game Objects
        Object.values(this.map.gameObjects)
          .sort((a, b) => {
            return a.y - b.y;
          })
          .forEach((object) => {
            object.sprite.draw(this.ctx, this.cameraPerson);
          });
      } else {
        if (
          index === this.map.images.length - 1 &&
          this.cameraPerson.isInTunnel()
        ) {
          this.ctx.save();
          this.ctx.globalAlpha = 0.4;
          this.map.drawImage(this.ctx, this.cameraPerson, image);
          this.ctx.restore(); //this will restore canvas state
        } else {
          this.map.drawImage(this.ctx, this.cameraPerson, image);
        }
      }
    });

    // Check game status
    this.map.checkGameStatus();
  }

  bindActionInput() {
    new KeyPressListener("Space", () => {
      //Is there a person here to talk to?
      this.map.checkForActionCutscene();
    });
  }

  bindGoblinPositionCheck() {
    document.addEventListener("PersonWalkingComplete", (e) => {
      if (e.detail.whoId === "goblin") {
        //Goblin's position has changed
        this.map.checkForFootstepCutscene();
      }
      this.map.checkForComsumeable(e.detail.whoId);
    });
  }

  startMap(mapConfig) {
    this.map = new OverworldMap(mapConfig);
    this.map.overworld = this;
    this.map.mountObjects();

    Object.values(this.map.gameObjects).forEach((object) => {
      object.directionInput && object.directionInput.init();
    });
  }

  init() {
    this.startMap(overworldMaps.Maze);

    // reset the game status
    this.gameStatus = "playing";

    this.bindActionInput();
    this.bindGoblinPositionCheck();

    // this.startGameLoop();

    // this.map.startCutscene([
    //   { who: "goblin", type: "walk",  direction: "down" },
    //   { who: "goblin", type: "walk",  direction: "down" },
    //   { who: "killer", type: "walk",  direction: "up" },
    //   { who: "killer", type: "walk",  direction: "left" },
    //   { who: "goblin", type: "stand",  direction: "right", time: 200 },
    //   { type: "textMessage", text: "WHY HELLO THERE!"}
    //   // { who: "killer", type: "walk",  direction: "left" },
    //   // { who: "killer", type: "walk",  direction: "left" },
    //   // { who: "killer", type: "stand",  direction: "up", time: 800 },
    // ])
  }
}
