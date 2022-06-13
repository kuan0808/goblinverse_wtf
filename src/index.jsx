import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "animate.css";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { RecoilRoot } from "recoil";

import "./index.css";

const { chains, provider, webSocketProvider } = configureChains(
  [
    chain.mainnet,
    // ...(process.env.REACT_APP_ENABLE_TESTNETS === 'true'
    //   ? [chain.goerli, chain.kovan, chain.rinkeby, chain.ropsten]
    //   : []),
  ],
  [
    alchemyProvider({ alchemyId: "_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC" }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "Goblinverse_wtf",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <WagmiConfig client={wagmiClient}>
    <RainbowKitProvider chains={chains}>
      <RecoilRoot>
        <App />
      </RecoilRoot>
    </RainbowKitProvider>
  </WagmiConfig>
);
