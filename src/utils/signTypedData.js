import { ethers } from "ethers";

export default async function signTypedData(to, amount, kitten) {
  const signer = new ethers.Wallet(process.env.REACT_APP_SIGNER_PRIVATE_KEY);
  // TODO:
  const domain = {
    name: "Goblinverz.wtf",
    version: "1.0.0",
    chainId: 1,
    verifyingContract: process.env.REACT_APP_CONTRACT_ADDRESS,
  };

  const types = {
    GoblinWeee: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "kitten", type: "bool" },
    ],
  };

  const value = {
    to,
    amount,
    kitten,
  };
  const signature = await signer._signTypedData(domain, types, value);

  return signature;
}
