import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from "./pages/Home";
import CanvasEditor from "./pages/CanvasEditor";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/canvas/:canvasId"
          element={<CanvasEditor />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;