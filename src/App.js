import "./App.css";
import AppProvider from "./context/AppProvider";
import LeftArea from "./sections/LeftArea";
import RightArea from "./sections/RightArea";

function App() {
  return (
    <div className="app">
      <AppProvider>
        <div className="app-container">
          <LeftArea />
          <RightArea />
        </div>
      </AppProvider>
    </div>
  );
}

export default App;
