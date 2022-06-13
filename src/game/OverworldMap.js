import mazeLower from "../images/maps/MazeLower.png";
import mazeMiddle from "../images/maps/MazeMiddle.png";
import mazeUpper from "../images/maps/MazeUpper.png";
import skeleton from "../images/characters/skeleton.png";
import stone from "../images/characters/stone.png";
import popo from "../images/characters/popo.png";
import goblinSkeleton from "../images/characters/goblinSkeleton.png";
import hamburger1 from "../images/characters/hamburger1.png";
import hamburger2 from "../images/characters/hamburger2.png";
import cat from "../images/characters/cat.png";
import catIcon from "../images/cat.png";
import runText from "../images/run.png";
import killer from "../images/characters/killer.png";

import GameObject from "./GameObject";
import Person from "./Person";
import utils from "./utils";
import OverworldEvent from "./OverworldEvent";
import Graph from "./Astar";

export default class OverworldMap {
  constructor(config) {
    this.cols = config.cols;
    this.rows = config.rows;
    this.overworld = null;
    this.goal = config.goal;
    this.gameObjects = config.gameObjects.reduce((acc, object) => {
      if (object.type === "Person") {
        acc[object.name] = new Person(object.config);
      }
      if (object.type === "GameObject") {
        acc[object.name] = new GameObject(object.config);
      }
      return acc;
    }, {});
    this.cutsceneSpaces = config.cutsceneSpaces || {};
    this.walls =
      config.walls.length > 0
        ? config.walls.reduce(
            (acc, wall) => ({ ...acc, [utils.asGridCoord(...wall)]: true }),
            {}
          )
        : {};
    this.tunnels =
      config.tunnels.length > 0
        ? config.tunnels.reduce(
            (acc, tunnel) => ({ ...acc, [utils.asGridCoord(...tunnel)]: true }),
            {}
          )
        : {};

    let graph = Array(this.rows)
      .fill()
      .map(() => Array(this.cols).fill(1));
    config.walls.forEach((wall) => {
      graph[wall[1]][wall[0]] = 0;
    });
    graph[6][5] = 0;
    graph[7][5] = 0;
    graph[8][5] = 0;
    this.graph = new Graph(graph);

    this.images = config.imageSrcs.map((src) => {
      if (src !== "gameObjects") {
        let image = new Image();
        image.src = src;
        return image;
      }
      return null;
    });
    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;

    this.isCutscenePlaying = false;
  }

  drawImage(ctx, cameraPerson, image) {
    ctx.drawImage(
      image,
      utils.withGrid(this.overworld.cameraPosition.x) - cameraPerson.x,
      utils.withGrid(this.overworld.cameraPosition.y) - cameraPerson.y
    );
  }

  isSpaceTaken(currentX, currentY, direction) {
    const { x, y } = utils.nextPosition(currentX, currentY, direction);
    return this.walls[`${x},${y}`] || false;
  }

  mountObjects() {
    Object.keys(this.gameObjects).forEach((key) => {
      let object = this.gameObjects[key];
      object.id = key;

      //TODO: determine if this object should actually mount
      object.mount(this);
    });
  }

  async startCutscene(events) {
    this.isCutscenePlaying = true;
    for (let i = 0; i < events.length; i++) {
      const eventHandler = new OverworldEvent({
        event: events[i],
        map: this,
      });
      await eventHandler.init();
    }
    this.isCutscenePlaying = false;
    this.cutsceneSpaces = {};
    //Reset NPCs to do their idle behavior
    Object.values(this.gameObjects).forEach((object) =>
      object.doBehaviorEvent(this)
    );
  }

  checkForActionCutscene() {
    const goblin = this.gameObjects["goblin"];
    const match = this.checkForCharactorExistence(
      goblin.x,
      goblin.y,
      goblin.direction
    );
    if (!this.isCutscenePlaying && match && match.talking.length) {
      this.startCutscene(match.talking[0].events);
    }
  }

  checkForCharactorExistence(x, y, direction) {
    const nextCoords = utils.nextPosition(x, y, direction);
    const match = Object.values(this.gameObjects).find((object) => {
      return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`;
    });
    return match;
  }

  checkTargetExistenceAndDirection(x, y, direction, target = null) {
    const neighbors = utils.getNeighbors(x, y);
    if (target) {
      let player = null;
      Object.entries(neighbors).forEach(([key, value]) => {
        if (`${target.x},${target.y}` === `${value.x},${value.y}`) {
          player = { obj: target, direction: key };
        }
      });
      return player;
    } else {
      let players = [];
      Object.entries(neighbors).forEach(([key, value]) => {
        Object.values(this.gameObjects).forEach((obj) => {
          if (`${obj.x},${obj.y}` === `${value.x},${value.y}`) {
            if (direction === key) {
              players.unshift({ obj, direction: key });
            } else {
              players.push({ obj, direction: key });
            }
          }
        });
      });
      console.log(players);
      return players.length === 0 ? null : players[0];
    }
  }
  checkForComsumeable(consumerId) {
    const consumer = this.gameObjects[consumerId];
    Object.values(this.gameObjects).forEach((object) => {
      if (
        `${object.x},${object.y}` === `${consumer.x},${consumer.y}` &&
        object.consumeable
      ) {
        object.effect(consumer);
        object.unmount();
      }
    });
  }
  checkForFootstepCutscene() {
    const goblin = this.gameObjects["goblin"];
    const match = this.cutsceneSpaces[`${goblin.x},${goblin.y}`];
    if (!this.isCutscenePlaying && match) {
      this.startCutscene(match[0].events);
    }
  }

  checkGameStatus() {
    const goblin = this.gameObjects["goblin"];
    const goal = this.goal;
    const pos = utils.toGridCoord(goblin.x, goblin.y);
    if (goal.x.indexOf(pos.x) > -1 && goal.y.indexOf(pos.y) > -1) {
      this.overworld.gameStatus = "victory";
    }
    if (goblin.hp === 0 && goblin.actionProgressRemaining === 0) {
      this.overworld.gameStatus = "lose";
    }
  }
  addWall(x, y) {
    this.walls[`${x},${y}`] = true;
  }
  removeWall(x, y) {
    delete this.walls[`${x},${y}`];
  }
  moveWall(wasX, wasY, direction) {
    this.removeWall(wasX, wasY);
    const { x, y } = utils.nextPosition(wasX, wasY, direction);
    this.addWall(x, y);
  }
}

export const overworldMaps = {
  Maze: {
    cols: 30,
    rows: 30,
    imageSrcs: [mazeLower, "gameObjects", mazeMiddle, mazeUpper],
    goal: { x: [25, 26, 27], y: [1] },
    gameObjects: [
      {
        type: "Person",
        name: "goblin",
        config: {
          isPlayerControlled: true,
          x: utils.withGrid(4),
          y: utils.withGrid(26),
          directionInputs: {
            KeyW: "up",
            KeyS: "down",
            KeyA: "left",
            KeyD: "right",
          },
        },
      },
      {
        type: "Person",
        name: "killer",
        config: {
          x: utils.withGrid(12),
          y: utils.withGrid(28),
          src: killer,
          directionInputs: {
            ArrowUp: "up",
            ArrowDown: "down",
            ArrowLeft: "left",
            ArrowRight: "right",
          },
          actionInputs: {
            attack: "Slash",
          },
          behaviorLoop: [
            { type: "stand", direction: "left", time: 800 },
            { type: "stand", direction: "up", time: 800 },
            { type: "stand", direction: "right", time: 1200 },
            { type: "stand", direction: "up", time: 300 },
          ],
        },
      },
      {
        type: "GameObject",
        name: "skeleton",
        config: {
          x: utils.withGrid(26),
          y: utils.withGrid(27),
          src: skeleton,
        },
      },
      {
        type: "GameObject",
        name: "stone1",
        config: {
          x: utils.withGrid(16),
          y: utils.withGrid(19),
          src: stone,
        },
      },
      {
        type: "GameObject",
        name: "stone2",
        config: {
          x: utils.withGrid(2),
          y: utils.withGrid(19),
          src: stone,
        },
      },
      {
        type: "GameObject",
        name: "popo1",
        config: {
          x: utils.withGrid(1),
          y: utils.withGrid(21),
          src: popo,
          consumeable: true,
          effect: (consumer) => {
            consumer.buff["speed"] = {
              duration: 200,
              value: 2,
            };
          },
        },
      },
      {
        type: "GameObject",
        name: "popo2",
        config: {
          x: utils.withGrid(13),
          y: utils.withGrid(7),
          src: popo,
          consumeable: true,
          effect: (consumer) => {
            consumer.buff["speed"] = {
              duration: 200,
              value: 2,
            };
          },
        },
      },
      {
        type: "GameObject",
        name: "goblinSkeleton1",
        config: {
          x: utils.withGrid(2),
          y: utils.withGrid(2),
          src: goblinSkeleton,
        },
      },
      {
        type: "GameObject",
        name: "goblinSkeleton2",
        config: {
          x: utils.withGrid(22),
          y: utils.withGrid(15),
          src: goblinSkeleton,
        },
      },
      {
        type: "GameObject",
        name: "hamburger1",
        config: {
          x: utils.withGrid(10),
          y: utils.withGrid(11),
          src: hamburger1,
          consumeable: true,
          effect: (consumer) => {
            if (consumer.hp < 3) {
              consumer.hp += 1;
            }
          },
        },
      },
      {
        type: "GameObject",
        name: "hamburger2",
        config: {
          x: utils.withGrid(26),
          y: utils.withGrid(11),
          src: hamburger2,
          consumeable: true,
          effect: (consumer) => {
            consumer.hp += 1;
          },
        },
      },
      {
        type: "Person",
        name: "cat",
        config: {
          x: utils.withGrid(2),
          y: utils.withGrid(15),
          src: cat,
          consumeable: true,
          effect: (consumer) => {
            consumer.equip.push("cat");
          },
        },
      },
    ],
    walls: [
      // obstacles
      [26, 27],
      [16, 19],
      [2, 19],
      [22, 15],
      [2, 2],
      // walls
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
      [5, 0],
      [4, 0],
      [6, 0],
      [7, 0],
      [8, 0],
      [9, 0],
      [10, 0],
      [11, 0],
      [13, 0],
      [12, 0],
      [14, 0],
      [15, 0],
      [16, 0],
      [17, 0],
      [18, 0],
      [19, 0],
      [20, 0],
      [21, 0],
      [22, 0],
      [23, 0],
      [24, 0],
      [25, 0],
      [26, 0],
      [27, 0],
      [28, 0],
      [0, 29],
      [1, 29],
      [2, 29],
      [3, 29],
      [4, 29],
      [5, 29],
      [6, 29],
      [7, 29],
      [8, 29],
      [9, 29],
      [10, 29],
      [11, 29],
      [12, 29],
      [13, 29],
      [14, 29],
      [15, 29],
      [16, 29],
      [17, 29],
      [18, 29],
      [19, 29],
      [20, 29],
      [21, 29],
      [22, 29],
      [23, 29],
      [24, 29],
      [25, 29],
      [28, 29],
      [26, 29],
      [27, 29],
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
      [0, 5],
      [0, 6],
      [0, 7],
      [0, 8],
      [0, 9],
      [0, 10],
      [0, 11],
      [0, 12],
      [0, 13],
      [0, 14],
      [0, 15],
      [0, 16],
      [0, 17],
      [0, 18],
      [0, 19],
      [0, 20],
      [0, 21],
      [0, 22],
      [0, 23],
      [0, 24],
      [0, 25],
      [0, 26],
      [0, 27],
      [0, 28],
      [1, 4],
      [2, 4],
      [3, 4],
      [4, 4],
      [5, 4],
      [5, 5],
      [4, 5],
      [3, 5],
      [2, 5],
      [1, 5],
      [5, 9],
      [4, 9],
      [4, 10],
      [5, 10],
      [5, 11],
      [4, 11],
      [4, 12],
      [5, 12],
      [4, 13],
      [5, 13],
      [4, 14],
      [5, 14],
      [5, 15],
      [5, 16],
      [5, 17],
      [4, 15],
      [4, 16],
      [4, 17],
      [1, 17],
      [2, 17],
      [3, 17],
      [1, 24],
      [2, 24],
      [1, 25],
      [1, 26],
      [1, 27],
      [1, 28],
      [3, 28],
      [2, 28],
      [4, 28],
      [5, 28],
      [6, 28],
      [7, 28],
      [8, 28],
      [28, 1],
      [28, 2],
      [28, 3],
      [28, 4],
      [28, 5],
      [28, 6],
      [28, 7],
      [28, 8],
      [28, 9],
      [28, 10],
      [28, 11],
      [28, 12],
      [28, 13],
      [28, 14],
      [28, 15],
      [28, 16],
      [28, 17],
      [28, 18],
      [28, 19],
      [28, 20],
      [28, 21],
      [28, 22],
      [28, 23],
      [28, 24],
      [28, 25],
      [28, 26],
      [28, 27],
      [28, 28],
      [9, 28],
      [10, 28],
      [11, 28],
      [13, 28],
      [14, 28],
      [14, 27],
      [14, 26],
      [14, 25],
      [14, 24],
      [14, 23],
      [14, 22],
      [14, 21],
      [13, 21],
      [13, 22],
      [13, 23],
      [13, 24],
      [13, 25],
      [13, 26],
      [13, 27],
      [3, 24],
      [4, 24],
      [5, 24],
      [6, 24],
      [7, 24],
      [8, 24],
      [9, 24],
      [9, 23],
      [9, 22],
      [9, 21],
      [8, 21],
      [7, 21],
      [6, 21],
      [5, 21],
      [4, 21],
      [1, 23],
      [2, 23],
      [3, 23],
      [4, 22],
      [24, 1],
      [24, 2],
      [24, 3],
      [24, 4],
      [24, 5],
      [23, 5],
      [22, 5],
      [21, 5],
      [21, 4],
      [21, 3],
      [21, 2],
      [21, 1],
      [17, 4],
      [16, 4],
      [15, 4],
      [17, 5],
      [17, 6],
      [17, 7],
      [17, 8],
      [17, 9],
      [18, 9],
      [19, 9],
      [20, 9],
      [21, 9],
      [23, 9],
      [22, 9],
      [24, 9],
      [25, 9],
      [26, 9],
      [27, 9],
      [15, 5],
      [15, 6],
      [15, 7],
      [15, 8],
      [15, 9],
      [14, 9],
      [13, 9],
      [12, 9],
      [11, 9],
      [11, 8],
      [11, 7],
      [11, 6],
      [11, 5],
      [11, 4],
      [10, 4],
      [9, 4],
      [9, 5],
      [9, 6],
      [9, 7],
      [9, 8],
      [9, 9],
      [9, 10],
      [10, 10],
      [11, 11],
      [11, 12],
      [10, 12],
      [9, 12],
      [9, 13],
      [9, 14],
      [9, 15],
      [9, 16],
      [9, 17],
      [10, 17],
      [11, 17],
      [12, 17],
      [12, 16],
      [12, 15],
      [12, 14],
      [12, 13],
      [12, 12],
      [12, 10],
      [12, 11],
      [11, 10],
      [16, 17],
      [16, 16],
      [16, 15],
      [16, 14],
      [16, 13],
      [17, 13],
      [18, 13],
      [19, 13],
      [20, 13],
      [21, 13],
      [22, 13],
      [23, 13],
      [24, 13],
      [17, 17],
      [18, 17],
      [18, 18],
      [18, 19],
      [18, 20],
      [18, 21],
      [18, 22],
      [18, 23],
      [18, 24],
      [18, 25],
      [19, 25],
      [20, 25],
      [20, 24],
      [20, 23],
      [20, 22],
      [20, 21],
      [20, 20],
      [20, 19],
      [20, 18],
      [20, 17],
      [20, 16],
      [20, 15],
      [20, 14],
      [24, 14],
      [24, 16],
      [24, 15],
      [24, 17],
      [24, 18],
      [24, 20],
      [24, 19],
      [24, 21],
      [24, 22],
      [24, 23],
      [24, 24],
      [24, 25],
      [16, 9],
    ],
    tunnels: [
      [1, 6],
      [2, 6],
      [3, 6],
      [4, 6],
      [1, 7],
      [2, 7],
      [3, 7],
      [4, 7],
      [1, 8],
      [2, 8],
      [3, 8],
      [4, 8],
      [1, 9],
      [2, 9],
      [3, 9],
      [1, 10],
      [2, 10],
      [3, 10],
      [1, 11],
      [2, 11],
      [3, 11],
      [1, 12],
      [2, 12],
      [3, 12],
      [1, 13],
      [2, 13],
      [3, 13],
      [1, 14],
      [2, 14],
      [3, 14],
      [1, 15],
      [2, 15],
      [3, 15],
      [1, 16],
      [2, 16],
      [3, 16],
    ],
    cutsceneSpaces: {
      [utils.asGridCoord(9, 25)]: [
        {
          events: [
            { type: "textMessage", src: runText },
            {
              who: "killer",
              type: "controlled",
              target: "goblin",
            },
          ],
        },
      ],
      [utils.asGridCoord(9, 26)]: [
        {
          events: [
            { type: "textMessage", src: runText },
            {
              who: "killer",
              type: "controlled",
              target: "goblin",
            },
          ],
        },
      ],
      [utils.asGridCoord(9, 27)]: [
        {
          events: [
            { type: "textMessage", src: runText },
            {
              who: "killer",
              type: "controlled",
              target: "goblin",
            },
          ],
        },
      ],
      // Cutscene space for the end game
      [utils.asGridCoord(10, 10)]: [
        {
          events: [
            { type: "cameraShift", x: utils.withGrid(7), y: utils.withGrid(4) },
            { type: "textMessage", text: "You can't be in there!" },
            {
              type: "cameraShift",
              x: utils.withGrid(-7),
              y: utils.withGrid(-4),
            },
            {
              who: "killer",
              type: "controlled",
            },
            // { who: "npcB", type: "walk", direction: "left" },
            // { who: "npcB", type: "stand", direction: "up", time: 500 },
            // { who: "npcB", type: "walk", direction: "right" },
            // { who: "goblin", type: "walk", direction: "down" },
            // { who: "goblin", type: "walk", direction: "left" },
          ],
        },
      ],
    },
  },
};
