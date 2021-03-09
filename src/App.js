import "./App.css";
import AppProvider from "./context/AppProvider";
import LeftArea from "./sections/LeftArea";
import RightArea from "./sections/RightArea";

function App() {
  return (
    <div className="app">
      <AppProvider>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "max-content auto",
            width: "100%",
            height: "100%",
          }}
        >
          <LeftArea />
          <RightArea />
        </div>
      </AppProvider>
    </div>
  );
}

export default App;
