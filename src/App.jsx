import { useRecoilValue } from "recoil";
import { pageState } from "./atoms/pageState";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Layout, Game, Mint } from "./components";

function App() {
  const page = useRecoilValue(pageState);

  return (
    <>
      <ToastContainer />
      <Layout>{page === "game" ? <Game /> : <Mint />}</Layout>
    </>
  );
}

export default App;
