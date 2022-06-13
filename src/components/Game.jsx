import React, { useState, useRef, useEffect } from "react";
import { useRecoilState } from "recoil";
import clsx from "clsx";

import Overworld from "../game/Overworld";
import heartIcon from "../images/heart.png";
import catIcon from "../images/cat.png";
import startButton from "../images/start.png";
import restartButton from "../images/retry.png";

import bgm from "../audios/bgm.mp3";
import weee from "../audios/weee.wav";
import dead from "../audios/dead sound_3.wav";

import useAnimationFrame from "../hooks/useAnimationFrame";
import {
  gameStatusState,
  playerEastereggState,
  playerHealthState,
  gameStatusHistoryState,
} from "../atoms/gameState";

const Game = () => {
  const [game, setGame] = useState(null);
  const [status, setStatus] = useRecoilState(gameStatusState);
  const [history, setHistory] = useRecoilState(gameStatusHistoryState);
  const [health, setHealth] = useRecoilState(playerHealthState);
  const [easterEgg, setEasterEgg] = useRecoilState(playerEastereggState);

  const gameContainerRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    return () => {
      setStatus(null);
    };
  }, []);

  useAnimationFrame(() => {
    if (!game) return;
    if (game.gameStatus === "playing") {
      game.step();
      setStatus(game.gameStatus);
      setHealth(game.cameraPerson.hp);
      setEasterEgg(game.cameraPerson.equip.length > 0);
    }
  }, [game?.gameStatus]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (status === "playing") {
      audioRef.current.loop = true;
      audioRef.current.src = bgm;
    } else if (status === "victory") {
      audioRef.current.loop = false;
      audioRef.current.src = weee;
      setHistory((prev) => [...prev, status]);
    } else if (status === "lose") {
      audioRef.current.loop = false;
      audioRef.current.src = dead;
      setHistory((prev) => [...prev, status]);
    }
    status && audioRef.current.play();
    return () => {
      audioRef.current && (audioRef.current.src = "");
    };
  }, [status]);

  const startNewGame = () => {
    if (!game) {
      let overworld = new Overworld({ element: gameContainerRef.current });
      overworld.init();
      setGame(overworld);
    } else {
      game.init();
    }
  };
  return (
    <main
      id="game-container"
      ref={gameContainerRef}
      className="relative w-[352px] h-[352px] md:w-[560px] md:h-[560px] lg:w-[704px] lg:h-[704px] origin-top overflow-hidden after:content-['*'] after:absolute after:top-0 after:left-0 after:w-full after:h-full after:bg-[url('./images/frame.png')] after:bg-no-repeat after:bg-center-top after:bg-[length:100%_100%] after:z-[2]"
    >
      <div className="absolute top-4 left-4 md:top-6 md:left-6 flex flex-col items-start justify-center z-[1]">
        <div className="flex items-center justify-center">
          {Array(health)
            .fill(0)
            .map((_, i) => (
              <img
                key={i}
                src={heartIcon}
                alt=""
                className="w-[40px] md:w-[60px]"
              />
            ))}
        </div>
        {easterEgg && (
          <div className="overflow-hidden">
            <img src={catIcon} alt="" className="w-[40px] md:w-[60px]" />
          </div>
        )}
      </div>
      <canvas className="scale-[2.5] md:scale-[4]"></canvas>
      <div
        className={clsx(
          "pb-6 absolute top-0 left-0 w-full h-full z-[1] bg-no-repeat bg-center bg-cover",
          status === "lose" &&
            "bg-[url('./images/gameover.png')] animate__animated animate__fadeIn animate__delay-1s",
          status === "victory" &&
            "bg-[url('./images/victory.png')] animate__animated animate__fadeIn animate__delay-1s"
        )}
      ></div>
      {!game && (
        <div
          className={clsx(
            "absolute top-0 left-0 w-full h-full z-[2]",
            status === "lose" && "bg-[url('./images/base.png')]",
            !game && "bg-[url('./images/base.png')]"
          )}
        ></div>
      )}
      <button
        id="game-button"
        onClick={startNewGame}
        className={clsx(
          "absolute left-1/2 -translate-x-1/2 z-[3]",
          !game && "top-1/2 -translate-y-1/2",
          (status === "lose" || status === "victory") && "bottom-8"
        )}
      >
        {!game && <img src={startButton} alt="" className="w-[200px]" />}
        {(status === "lose" || status === "victory") && (
          <img
            src={restartButton}
            alt=""
            className="w-[200px] animate__animated animate__fadeIn animate__delay-2s"
          />
        )}
      </button>
      <audio ref={audioRef}></audio>
    </main>
  );
};

export default Game;
