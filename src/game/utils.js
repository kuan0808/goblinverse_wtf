const utils = {
  withGrid(n) {
    return n * 16;
  },
  asGridCoord(x, y) {
    return `${x * 16},${y * 16}`;
  },
  toGridCoord(x, y) {
    return {
      x: Math.floor(x / 16),
      y: Math.floor(y / 16),
    };
  },
  nextPosition(initialX, initialY, direction) {
    let x = initialX;
    let y = initialY;
    const size = 16;
    if (direction === "left") {
      x -= size;
    } else if (direction === "right") {
      x += size;
    } else if (direction === "up") {
      y -= size;
    } else if (direction === "down") {
      y += size;
    }
    return { x, y };
  },
  getDirection(currentX, currentY, x, y) {},
  processAstarResult(currentX, currentY, nodes) {
    let neighbors = this.getNeighbors(currentX, currentY);
    nodes.pop();
    if (nodes.length > 0) {
      const [action] = Object.entries(neighbors).find(([key, value]) => {
        return (
          `${nodes[0].y},${nodes[0].x}` ===
          `${Math.floor(value.x / 16)},${Math.floor(value.y / 16)}`
        );
      });
      return action;
    }
    return "attack";
  },
  getNeighbors(x, y) {
    const size = 16;
    return {
      left: { x: x - size, y: y },
      right: { x: x + size, y: y },
      up: { x: x, y: y - size },
      down: { x: x, y: y + size },
    };
  },
  oppositeDirection(direction) {
    if (direction === "left") {
      return "right";
    }
    if (direction === "right") {
      return "left";
    }
    if (direction === "up") {
      return "down";
    }
    return "up";
  },
  emitEvent(name, detail) {
    const event = new CustomEvent(name, {
      detail,
    });
    document.dispatchEvent(event);
  },
  playAudio(url, loop) {
    const audio = new Audio("audio_file.mp3");
    audio.loop = loop;
    audio.play();
  },
  isEmpty(obj) {
    for (let x in obj) {
      return false;
    }
    return true;
  },
};

export default utils;
