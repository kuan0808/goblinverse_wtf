import { atom } from "recoil";

export const gameStatusState = atom({
  key: "gameStatusState",
  default: null,
});

export const playerHealthState = atom({
  key: "playerHealthState",
  default: 0,
});

export const playerEastereggState = atom({
  key: "playerEastereggState",
  default: false,
});
