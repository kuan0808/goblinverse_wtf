import { useRecoilValue } from "recoil";
import { pageState } from "./atoms/pageState";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route } from "react-router-dom";

import { Layout, Game, Mint, Comic } from "./components";

function App() {
  const page = useRecoilValue(pageState);

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Comic />} />
          <Route path="game" element={<Game />} />
          <Route path="comics" element={<Comic />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
