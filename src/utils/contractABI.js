import { ethers } from "ethers";

const contractABI = new ethers.utils.Interface([
  "function goblinWeee(uint256 _amount, bool _kitten, bytes memory _SIGNATURE)",
  "function totalSupply() view returns (uint256)",
]);

export default contractABI;
