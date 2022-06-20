import React, { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { useContract, useNetwork, useSigner } from "wagmi";

import mintButton from "../images/ui/mint.png";
import plus from "../images/ui/plus.png";
import minus from "../images/ui/minus.png";
import one from "../images/ui/one.png";
import two from "../images/ui/two.png";
import three from "../images/ui/three.png";
import catIcon from "../images/cat.png";
import winToMint from "../images/ui/winToMint.png";
import soldOut from "../images/ui/soldOut.png";
import { signTypedData, contractABI } from "../utils";

import {
  gameStatusHistoryState,
  playerEastereggHistoryState,
} from "../atoms/gameState";
import { toast } from "react-toastify";

const Mint = () => {
  const statusHistory = useRecoilValue(gameStatusHistoryState);
  const eastereggHistory = useRecoilValue(playerEastereggHistoryState);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const hasPassed = statusHistory.includes("victory");
  const hasEasterEgg = eastereggHistory.reduce((acc, cur, index) => {
    const victoryAndEasteregg = cur && statusHistory[index] === "victory";
    return acc || victoryAndEasteregg;
  }, false);

  useEffect(() => {
    if (hasPassed && !hasEasterEgg) {
      setCount(1);
    }
  }, []);

  const { activeChain } = useNetwork();
  const { data: signer } = useSigner();
  const contract = useContract({
    addressOrName: process.env.REACT_APP_CONTRACT_ADDRESS,
    contractInterface: contractABI,
    signerOrProvider: signer,
  });

  const handleAdd = () => setCount((prev) => prev + 1);
  const handleSubstract = () => setCount((prev) => prev - 1);
  const handleMint = async () => {
    if (!signer) return toast.error("Please sign in to mint");
    if (!(activeChain.id === 1)) return toast.error("Please switch to mainnet");
    try {
      setLoading(true);
      const address = await signer.getAddress();
      const signature = await signTypedData(address, count, hasEasterEgg);
      const tx = await contract.goblinWeee(count, hasEasterEgg, signature);
      await tx.wait();
      toast.success("Minting success");
      setLoading(false);
    } catch (e) {
      setLoading(false);
      toast.error("Something went wrong");
    }
  };
  return (
    <main className="flex flex-col items-center justify-between gap-12 mt-6">
      <button
        disabled={!hasPassed}
        className="disabled:cursor-not-allowed"
        onClick={handleMint}
      >
        {loading ? (
          <div className="flex items-center justify-center p-6 bg-[url('./images/ui/emptyButton.png')] bg-no-repeat bg-[length:100%_100%] w-[250px] h-[125px]">
            <svg
              role="status"
              className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <p className="text-2xl">Loading...</p>
          </div>
        ) : (
          <img src={mintButton} alt="" className="w-[250px]" />
        )}
      </button>
      <div className="flex items-center justify-center gap-10">
        <button
          disabled={
            (count === 0 && hasEasterEgg) ||
            (count === 1 && !hasEasterEgg) ||
            !hasPassed
          }
          className="disabled:cursor-not-allowed"
          onClick={
            (count === 0 && hasEasterEgg) ||
            (count === 1 && !hasEasterEgg) ||
            !hasPassed
              ? undefined
              : handleSubstract
          }
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
          {hasEasterEgg && count === 0 && (
            <img src={catIcon} alt="" className="w-[100px]" />
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
