import Message from "./Message";
import utils from "./utils";

export default class OverworldEvent {
  constructor({ map, event }) {
    this.map = map;
    this.event = event;
  }
  stand(resolve) {
    const who = this.map.gameObjects[this.event.who];
    who.startBehavior({
      type: "stand",
      direction: this.event.direction,
      time: this.event.time,
    });

    //Set up a handler to complete when correct person is done walking, then resolve the event
    const completeHandler = (e) => {
      if (e.detail.whoId === this.event.who) {
        document.removeEventListener("PersonStandComplete", completeHandler);
        resolve();
      }
    };
    document.addEventListener("PersonStandComplete", completeHandler);
  }

  walk(resolve) {
    const who = this.map.gameObjects[this.event.who];
    //Set up a handler to complete when correct person is done walking, then resolve the event
    const completeHandler = (e) => {
      if (e.detail.whoId === this.event.who) {
        document.removeEventListener("PersonWalkingComplete", completeHandler);
        resolve();
      }
    };
    document.addEventListener("PersonWalkingComplete", completeHandler);
    who.startBehavior({
      type: "walk",
      direction: this.event.direction,
      retry: false,
    });
  }

  textMessage(resolve) {
    if (this.event.faceGoblin) {
      const obj = this.map.gameObjects[this.event.faceGoblin];
      obj.direction = utils.oppositeDirection(
        this.map.gameObjects["goblin"].direction
      );
    }

    const message = new Message({
      src: this.event.src,
      onComplete: () => resolve(),
    });
    message.init(document.querySelector("#game-container"));
  }

  controlled(resolve) {
    const obj = this.map.gameObjects[this.event.who];
    obj.isAIControlled = true;
    obj.target = this.map.gameObjects[this.event.target];
    resolve();
  }

  cameraShift(resolve) {}

  aiTakeControl(resolve) {}

  init() {
    return new Promise((resolve) => {
      this[this.event.type](resolve);
    });
  }
}
