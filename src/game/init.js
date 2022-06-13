import Overworld from "./Overworld";

export const startGame = () => {
  const overworld = new Overworld({
    element: document.querySelector("#game-container"),
  });
  overworld.init();
};
