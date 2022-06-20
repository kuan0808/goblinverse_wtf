import goblin from "../images/characters/goblin.png";

import OverworldEvent from "./OverworldEvent";

import Sprite from "./Sprite";
export default class GameObject {
  constructor(config) {
    this.id = null;
    this.isMounted = false;
    this.consumeable = config.consumeable || false;
    this.effect = config.effect || null;
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.direction = config.direction || "down";
    this.sprite = new Sprite({
      gameObject: this,
      src: config.src || goblin,
    });
    this.map = null;

    this.behaviorLoop = config.behaviorLoop || [];
    this.behaviorLoopIndex = 0;

    this.talking = config.talking || [];
  }

  mount(map) {
    // console.log("mounting!");
    this.isMounted = true;
    this.map = map;
    if (!this.consumeable) {
      this.map.addWall(this.x, this.y);
    }

    //If we have a behavior, kick off after a short delay
    setTimeout(() => {
      this.doBehaviorEvent();
    }, 10);
  }
  unmount() {
    this.isMounted = false;
    this.map.removeWall(this.x, this.y);
    delete this.map.gameObjects[this.id];
  }
  update() {}

  async doBehaviorEvent() {
    //Don't do anything if there is a more important cutscene or I don't have config to do anything
    //anyway.
    if (
      this.map.isCutscenePlaying ||
      this.isPlayerControlled ||
      this.isAIControlled ||
      this.behaviorLoop.length === 0 ||
      this.isStanding
    ) {
      return;
    }

    //Setting up our event with relevant info
    let eventConfig = this.behaviorLoop[this.behaviorLoopIndex];
    eventConfig.who = this.id;

    //Create an event instance out of our next event config
    const eventHandler = new OverworldEvent({
      map: this.map,
      event: eventConfig,
    });
    await eventHandler.init();

    //Setting the next event to fire
    this.behaviorLoopIndex += 1;
    if (this.behaviorLoopIndex === this.behaviorLoop.length) {
      this.behaviorLoopIndex = 0;
    }

    //Do it again!
    this.doBehaviorEvent();
  }
}
