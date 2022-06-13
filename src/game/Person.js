import GameObject from "./GameObject";
import DirectionInput from "./DirectionInput";
import KeyPressListener from "./KeyPressListener";
import utils from "./utils";
import { astar } from "./Astar";

export default class Person extends GameObject {
  constructor(config) {
    super(config);
    this.hp = 3;
    this.speed = config.speed || 1;
    this.isPlayerControlled = config.isPlayerControlled || false;
    this.isAIControlled = config.isAIControlled || false;

    // Buff
    this.buff = {};
    this.originalStatus = {};

    this.equip = [];

    this.movingProgressRemaining = 0;
    this.isStanding = false;
    this.directionUpdate = {
      up: ["y", -1],
      down: ["y", 1],
      left: ["x", -1],
      right: ["x", 1],
    };
    // Give the person his own direction input
    this.heldDirections = [];
    this.directionInput =
      config.directionInputs &&
      new DirectionInput(this, config.directionInputs);

    // The action that the player is currently doing
    this.action = null;
    this.actionProgressRemaining = 0;
    if (config.actionInputs) {
      Object.entries(config.actionInputs).forEach((actionInput) => {
        new KeyPressListener(actionInput[1], () =>
          this.handleAction(actionInput[0])
        );
      });
    }
    this.recoveryProgressRemaining = 0;
  }
  isInTunnel() {
    return (
      this.map.tunnels[
        `${utils.withGrid(Math.floor(this.x / 16))},${utils.withGrid(
          Math.floor(this.y / 16)
        )}`
      ] || false
    );
  }
  handleAction(action) {
    if (
      !this.action ||
      (this.action &&
        // !this.action === "hurt" &&
        (action === "hurt" || action === "lieDown"))
    )
      this.action = action;
    return;
  }
  update() {
    // AI logic for path finding
    if (
      this.isAIControlled &&
      !this.isPlayerControlled &&
      this.actionProgressRemaining === 0 &&
      this.movingProgressRemaining === 0
    ) {
      const start = this.map.graph.grid[Math.floor(this.y / 16)][
        Math.floor(this.x / 16)
      ];
      const end =
        this.target.action === "hurt" ||
        this.target.recoveryProgressRemaining > 0
          ? // Go back to it's original position
            this.map.graph.grid[Math.floor(Math.random() * 30)][
              Math.floor(Math.random() * 30)
            ]
          : this.target.isInTunnel()
          ? this.map.graph.grid[Math.floor(Math.random() * 8 + 4)][
              Math.floor(Math.random() * 2 + 5)
            ]
          : this.map.graph.grid[Math.floor(this.target.y / 16)][
              Math.floor(this.target.x / 16)
            ];
      const nodes = astar.search(this.map.graph, start, end);
      const action = utils.processAstarResult(this.x, this.y, nodes);
      if (action !== "attack") {
        this.heldDirections = [action];
      } else {
        if (
          this.map.checkTargetExistenceAndDirection(
            this.x,
            this.y,
            this.direction,
            this.target
          )
        ) {
          this.action = action;
        }
      }
    }
    // Update charactor's buff status
    if (!utils.isEmpty(this.buff)) {
      Object.entries(this.buff).forEach(([type, detail]) => {
        if (detail.duration > 0) {
          !detail.started &&
            (this.originalStatus[type] =
              this.originalStatus[type] || this[type]);
          !detail.started && (this[type] *= detail.value);
          this.buff[type].started = true;
          this.buff[type].duration -= 1;
        }
      });
    }

    if (this.recoveryProgressRemaining > 0) {
      this.recoveryProgressRemaining -= 1;
    }
    if (this.actionProgressRemaining > 0) {
      this.movingProgressRemaining = 0;
      this.actionProgressRemaining -= 1;

      if (this.actionProgressRemaining === 0) {
        // immortality for a period of time after getting up
        if (this.action === "hurt") {
          this.recoveryProgressRemaining = 60;
        }
        this.action = null;
      }
    } else {
      if (
        !this.map.isCutscenePlaying &&
        (this.isPlayerControlled || this.isAIControlled) &&
        this.action
      ) {
        this.startBehavior({
          type: this.action,
          direction: this.direction,
        });
      } else {
        if (this.movingProgressRemaining > 0) {
          this.updatePosition();
        } else {
          // Check buff status if the character is not moving, prevent
          // the character from breaking the grid rule
          if (!utils.isEmpty(this.buff)) {
            Object.entries(this.buff).forEach(([type, detail]) => {
              if (detail.duration <= 0) {
                this[type] = this.originalStatus[type];
                delete this.buff[type];
                delete this.originalStatus[type];
              }
            });
          }
          if (
            !this.map.isCutscenePlaying &&
            (this.isPlayerControlled || this.isAIControlled) &&
            this.heldDirections[0]
          ) {
            this.startBehavior({
              type: "walk",
              direction: this.heldDirections[0],
            });
          }
        }
      }
    }
    this.updateSprite();
  }

  startBehavior(behavior) {
    //Set character direction to whatever behavior has
    this.direction = behavior.direction;

    if (behavior.type === "attack") {
      const player = this.map.checkTargetExistenceAndDirection(
        this.x,
        this.y,
        this.direction,
        this.target
      );
      if (
        player &&
        !(player.obj.action === "hurt") &&
        !player.obj.recoveryProgressRemaining
      ) {
        player.obj.handleAction("hurt");
      }
      // set the attack animation lasting time
      this.actionProgressRemaining = 60;
      // face the target while attacking
      this.direction = player?.direction || this.direction;
    }
    if (behavior.type === "hurt") {
      this.hp -= 1;
      // TODO: make the character speed up when hurt
      this.hp === 0 && this.handleAction("lieDown");
      console.log(this.action);
      this.actionProgressRemaining = 8;
    }
    if (behavior.type === "lieDown") {
      this.actionProgressRemaining = 20;
    }
    if (behavior.type === "walk") {
      //Stop here if space is not free
      if (this.map.isSpaceTaken(this.x, this.y, this.direction)) {
        if (behavior.retry) {
          setTimeout(() => {
            this.startBehavior(behavior);
          }, 10);
        } else {
          utils.emitEvent("PersonWalkingComplete", {
            whoId: this.id,
          });
        }
        return;
      }

      //Ready to walk!
      this.map.moveWall(this.x, this.y, this.direction);
      this.movingProgressRemaining = 16 / this.speed;
    }

    if (behavior.type === "stand") {
      this.isStanding = true;
      setTimeout(() => {
        utils.emitEvent("PersonStandComplete", {
          whoId: this.id,
        });
        this.isStanding = false;
      }, behavior.time);
    }
    this.updateSprite();
  }

  updatePosition() {
    const [property, change] = this.directionUpdate[this.direction];
    this[property] += change * this.speed;
    this.movingProgressRemaining -= 1;
    if (this.movingProgressRemaining === 0) {
      //We finished the walk!
      utils.emitEvent("PersonWalkingComplete", {
        whoId: this.id,
      });
    }
  }

  updateSprite() {
    if (this.actionProgressRemaining > 0) {
      switch (this.action) {
        case "attack":
          this.sprite.setAnimation(this.action + "-" + this.direction);
          break;
        default:
          this.sprite.setAnimation(this.action);
          break;
      }
      return;
    }
    if (this.movingProgressRemaining > 0) {
      this.sprite.setAnimation("walk-" + this.direction);
      return;
    }
    this.sprite.setAnimation("idle-" + this.direction);
  }
}
