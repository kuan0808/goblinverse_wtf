import { useRecoilValue } from "recoil";
import { pageState } from "./atoms/pageState";

import { Layout, Game, Mint } from "./components";

function App() {
  const page = useRecoilValue(pageState);
  return <Layout>{page === "game" ? <Game /> : <Mint />}</Layout>;
}

export default App;
