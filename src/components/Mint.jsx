import React, { useState } from "react";
import { useRecoilValue } from "recoil";

import mintButton from "../images/ui/mint.png";
import plus from "../images/ui/plus.png";
import minus from "../images/ui/minus.png";
import one from "../images/ui/one.png";
import two from "../images/ui/two.png";
import three from "../images/ui/three.png";
import catIcon from "../images/cat.png";
import {
  gameStatusState,
  playerHealthState,
  playerEastereggState,
} from "../atoms/gameState";

const Mint = () => {
  const status = useRecoilValue(gameStatusState);
  const health = useRecoilValue(playerHealthState);
  const easteregg = useRecoilValue(playerEastereggState);
  const [count, setCount] = useState(0);

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
          // className={clsx(count === 0 && "opacity-60")}
          disabled={count === 0}
          onClick={count > 0 ? handleSubstract : undefined}
        >
          <img src={minus} alt="" className="w-[80px]" />
        </button>
        <div className="relative">
          {count > 0 && easteregg && (
            <div className="absolute -top-[50px] -right-[50px]">
              <img src={catIcon} alt="" className="w-[80px]" />
            </div>
          )}
          {count === 1 && <img src={one} alt="" className="w-[80px]" />}
          {count === 2 && <img src={two} alt="" className="w-[80px]" />}
          {count === 3 && <img src={three} alt="" className="w-[80px]" />}
        </div>
        <button
          // className={clsx(health <= count && "opacity-60")}
          disabled={health <= count}
          onClick={
            status === "victory" && health > count ? handleAdd : undefined
          }
        >
          <img src={plus} alt="" className="w-[80px]" />
        </button>
      </div>
    </main>
  );
};

export default Mint;
