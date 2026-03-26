import React from "react";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import ChatOnly from "./pages/ChatOnly";

function App() {
  return (
    <Provider store={store}>
      <ChatOnly />
    </Provider>
  );
}

export default App;
