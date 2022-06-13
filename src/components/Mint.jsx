import React, { useState } from "react";
import { useRecoilValue } from "recoil";

import mintButton from "../images/ui/mint.png";
import plus from "../images/ui/plus.png";
import minus from "../images/ui/minus.png";
import one from "../images/ui/one.png";
import two from "../images/ui/two.png";
import three from "../images/ui/three.png";
import catIcon from "../images/cat.png";
import winToMint from "../images/ui/winToMint.png";
import soldOut from "../images/ui/soldOut.png";

import {
  gameStatusHistoryState,
  playerEastereggHistoryState,
} from "../atoms/gameState";

const Mint = () => {
  const statusHistory = useRecoilValue(gameStatusHistoryState);
  const eastereggHistory = useRecoilValue(playerEastereggHistoryState);
  const [count, setCount] = useState(1);

  const hasPassed = statusHistory.includes("victory");
  const hasEasterEgg = eastereggHistory.reduce((acc, cur, index) => {
    const victoryAndEasteregg = cur && statusHistory[index] === "victory";
    return acc || victoryAndEasteregg;
  }, false);

  const handleAdd = () => setCount((prev) => prev + 1);
  const handleSubstract = () => setCount((prev) => prev - 1);
  const handleMint = () => {};

  return (
    <main className="flex flex-col items-center justify-between gap-12 mt-6">
      <button disabled={count === 0}>
        <img src={mintButton} alt="" className="w-[250px]" />
      </button>
      <div className="flex items-center justify-center gap-10">
        <button
          disabled={count === 1 || !hasPassed}
          className="disabled:cursor-not-allowed"
          onClick={(hasPassed && count) > 1 ? handleSubstract : undefined}
        >
          <img src={minus} alt="" className="w-[80px]" />
        </button>
        <div className="relative">
          {count > 0 && hasEasterEgg && (
            <div className="absolute -top-[50px] -right-[50px]">
              <img src={catIcon} alt="" className="w-[80px]" />
            </div>
          )}
          {!hasPassed && (
            <img src={winToMint} alt="" className="w-[120px] md:w-[180px]" />
          )}
          {hasPassed && count === 1 && (
            <img src={one} alt="" className="w-[80px]" />
          )}
          {count === 2 && <img src={two} alt="" className="w-[80px]" />}
          {count === 3 && <img src={three} alt="" className="w-[80px]" />}
        </div>
        <button
          className="disabled:cursor-not-allowed"
          disabled={count === 3 || !hasPassed}
          onClick={hasPassed && count < 3 ? handleAdd : undefined}
        >
          <img src={plus} alt="" className="w-[80px]" />
        </button>
      </div>
    </main>
  );
};

export default Mint;
