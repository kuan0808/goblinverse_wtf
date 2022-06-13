export default class DirectionInput {
  constructor(who, inputs) {
    this.who = who;
    this.inputs = inputs;
  }

  init() {
    document.addEventListener("keydown", (e) => {
      const dir = this.inputs[e.code];
      if (dir && this.who.heldDirections.indexOf(dir) === -1) {
        this.who.heldDirections.unshift(dir);
        this.who.isPlayerControlled = true;
      }
    });
    document.addEventListener("keyup", (e) => {
      const dir = this.inputs[e.code];
      const index = this.who.heldDirections.indexOf(dir);
      if (index > -1) {
        this.who.heldDirections.splice(index, 1);
        this.who.isAIControlled && (this.who.isPlayerControlled = false);
      }
    });
  }
}
