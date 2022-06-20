import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import connectButton from "../images/ui/connect.png";

const ConnectWalletButton = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        return (
          <div
            {...(!mounted && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!mounted || !account || !chain) {
                return (
                  <button onClick={openConnectModal} type="button">
                    <img
                      src={connectButton}
                      alt=""
                      className="w-[100px] md:w-[130px] lg:w-[150px]"
                    />
                  </button>
                );
              }
              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="text-lg text-red-800 md:text-xl bg-[url('./images/ui/emptyButton.png')] bg-no-repeat bg-[length:100%_100%] w-[100px] md:w-[130px] lg:w-[150px] h-[60px] md:h-[80px]"
                  >
                    Wrong network
                  </button>
                );
              }
              return (
                <div className="space-x-3 flex items-center justify-center p-6 text-xl bg-[url('./images/ui/emptyButton.png')] bg-no-repeat bg-[length:100%_100%] h-[60px] md:h-[80px]">
                  <button
                    onClick={openChainModal}
                    style={{ display: "flex", alignItems: "center" }}
                    type="button"
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 12,
                          height: 12,
                          borderRadius: 999,
                          overflow: "hidden",
                          marginRight: 4,
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? "Chain icon"}
                            src={chain.iconUrl}
                            style={{ width: 12, height: 12 }}
                          />
                        )}
                      </div>
                    )}
                    {chain.name}
                  </button>
                  <button onClick={openAccountModal} type="button">
                    {account.displayName}
                    {account.displayBalance
                      ? ` (${account.displayBalance})`
                      : ""}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default ConnectWalletButton;
