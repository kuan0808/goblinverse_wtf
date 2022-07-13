import React from "react";
import { useRecoilState } from "recoil";
import { Link, Outlet, useLocation } from "react-router-dom";

import title from "../images/ui/title.png";
import twitter from "../images/ui/twitter.png";
import opensea from "../images/ui/opensea.png";
import game from "../images/ui/game.png";
import mintButton from "../images/ui/mint.png";
import comics from "../images/ui/comics.png";
import mute from "../images/ui/mute.png";
import unmute from "../images/ui/unmute.png";

import ConnectWalletButton from "./ConnectWalletButton";
import { pageState } from "../atoms/pageState";
import { gameMutedState } from "../atoms/gameState";

const Layout = () => {
  const [page, setPage] = useRecoilState(pageState);
  const { pathname } = useLocation();
  const [muted, setMuted] = useRecoilState(gameMutedState);
  return (
    <div
      className="select-none relative w-full h-auto min-h-screen px-4 py-4 space-y-4 bg-[url('./images/background.png')] bg-no-repeat bg-[center_top] bg-cover flex flex-col items-center justify-center md:justify-start"
      style={{ imageRendering: "pixelated" }}
    >
      <header className="w-[70%] md:w-[80%] flex items-center justify-center">
        <img src={title} alt="" className="h-[150px] md:h-[200px]" />
      </header>

      <Outlet />

      <div className="self-start md:fixed md:top-[300px] md:left-[40px] lg:left-[60px] flex md:flex-col items-center justify-start gap-4">
        <a
          href="https://opensea.io/collection/goblinverz-wtf"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={opensea}
            alt=""
            className="w-[50px] md:w-[70px] lg:w-[80px]"
          />
        </a>
        <a
          href="https://twitter.com/Goblinverz_wtf"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={twitter}
            alt=""
            className="w-[50px] md:w-[70px] lg:w-[80px]"
          />
        </a>
      </div>
      <div className="fixed z-20 top-[10px] right-[10px] md:top-2 md:right-3 lg:top-6 lg:right-10 flex flex-col items-end justify-start">
        <ConnectWalletButton />
        {(pathname === "/comics" || pathname === "/") && (
          <Link to="game">
            <img
              src={game}
              alt=""
              className="w-[100px] md:w-[130px] lg:w-[150px]"
            />
          </Link>
        )}
        {pathname === "/game" && (
          <Link to="comics">
            <img
              src={comics}
              alt=""
              className="w-[100px] md:w-[130px] lg:w-[150px]"
            />
          </Link>
        )}
        {pathname === "/game" && (
          <button
            onClick={() => setMuted((prev) => !prev)}
            className="focus-visible:outline-none"
          >
            {muted ? (
              <img src={unmute} alt="" className="w-[60px] md:w-[80px]" />
            ) : (
              <img src={mute} alt="" className="w-[60px] md:w-[80px]" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default Layout;
