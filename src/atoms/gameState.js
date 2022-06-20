import { atom } from "recoil";

export const gameMutedState = atom({
  key: "gameMutedState",
  default: false,
});

export const gameStatusHistoryState = atom({
  key: "gameStatusHistoryState",
  default: [],
});
export const playerEastereggHistoryState = atom({
  key: "playerEastereggHistoryState",
  default: [],
});
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
