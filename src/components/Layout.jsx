import React from "react";
import { useRecoilState } from "recoil";

import title from "../images/ui/title.png";
import twitter from "../images/ui/twitter.png";
import opensea from "../images/ui/opensea.png";
import game from "../images/ui/game.png";
import mintButton from "../images/ui/mint.png";
import wKey from "../images/ui/wKey.png";
import aKey from "../images/ui/aKey.png";
import sKey from "../images/ui/sKey.png";
import dKey from "../images/ui/dKey.png";

import ConnectWalletButton from "./ConnectWalletButton";
import { pageState } from "../atoms/pageState";

const Layout = ({ children }) => {
  const [page, setPage] = useRecoilState(pageState);
  return (
    <div
      className="relative w-full h-auto min-h-screen px-4 py-8 space-y-4 bg-[url('./images/background.png')] bg-no-repeat bg-[center_top] bg-cover flex flex-col items-center justify-center md:justify-start"
      style={{ imageRendering: "pixelated" }}
    >
      <header className="w-[80%] flex items-center justify-center">
        <img src={title} alt="" className="h-[150px] md:h-[250px]" />
      </header>
      {children}
      <div className="md:fixed md:top-[300px] md:left-[40px] lg:left-[60px] flex md:flex-col items-center justify-start gap-4">
        <a href="" target="_blank" rel="noopener noreferrer">
          <img
            src={opensea}
            alt=""
            className="w-[60px] h-[60px] md:w-[70px] md:h-[70px] lg:w-[80px] lg:h-[80px]"
          />
        </a>
        <a href="" target="_blank" rel="noopener noreferrer">
          <img
            src={twitter}
            alt=""
            className="w-[60px] h-[60px] md:w-[70px] md:h-[70px] lg:w-[80px] lg:h-[80px]"
          />
        </a>
      </div>
      <div className="fixed top-[10px] right-[10px] md:top-5 md:right-5 flex flex-col items-end justify-start">
        <ConnectWalletButton />
        {page === "mint" && (
          <button>
            <img
              src={game}
              alt=""
              className="w-[120px] md:w-[150px]"
              onClick={() => setPage("game")}
            />
          </button>
        )}
        {page === "game" && (
          <button>
            <img
              src={mintButton}
              alt=""
              className="w-[130px] md:w-[150px]"
              onClick={() => setPage("mint")}
            />
          </button>
        )}
      </div>
      <div className="flex flex-col items-center justify-center absolute bottom-7 right-1/2 translate-x-1/2 lg:right-20 lg:bottom-[300px] lg:translate-x-0">
        <button
          onPointerDown={() => {
            document.dispatchEvent(
              new KeyboardEvent("keydown", { code: "KeyW" })
            );
          }}
          onPointerUp={() => {
            document.dispatchEvent(
              new KeyboardEvent("keyup", { code: "KeyW" })
            );
          }}
        >
          <img src={wKey} alt="" className="w-[55px] md:w-[65px]" />
        </button>
        <div className="flex items-center justify-center">
          <button
            onPointerDown={() => {
              document.dispatchEvent(
                new KeyboardEvent("keydown", { code: "KeyA" })
              );
            }}
            onPointerUp={() => {
              document.dispatchEvent(
                new KeyboardEvent("keyup", { code: "KeyA" })
              );
            }}
          >
            <img src={aKey} alt="" className="w-[55px] md:w-[65px]" />
          </button>
          <button
            onPointerDown={() => {
              document.dispatchEvent(
                new KeyboardEvent("keydown", { code: "KeyS" })
              );
            }}
            onPointerUp={() => {
              document.dispatchEvent(
                new KeyboardEvent("keyup", { code: "KeyS" })
              );
            }}
          >
            <img src={sKey} alt="" className="w-[55px] md:w-[65px]" />
          </button>
          <button
            onPointerDown={() => {
              document.dispatchEvent(
                new KeyboardEvent("keydown", { code: "KeyD" })
              );
            }}
            onPointerUp={() => {
              document.dispatchEvent(
                new KeyboardEvent("keyup", { code: "KeyD" })
              );
            }}
          >
            <img src={dKey} alt="" className="w-[55px] md:w-[65px]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Layout;
