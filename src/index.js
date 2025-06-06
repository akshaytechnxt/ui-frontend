import React from "react";
import ReactDOM from "react-dom"; // corrected import
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  BrowserRouter as Router,
} from "react-router-dom";
import { Provider } from "react-redux";
import  store  from "./state/store.js";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { Suspense } from "react";
import { Spin } from 'antd';

const persistor = persistStore(store);
function Loading() {
  return <Spin/>;
}
ReactDOM.render(
  <Suspense fallback={<Loading />}>
  <Provider store={store}>
    <React.StrictMode>
      <PersistGate persistor={persistor}>
        <Router>
          <App />
        </Router>
      </PersistGate>
    </React.StrictMode>
  </Provider>
  </Suspense>,
  document.getElementById("root")
);

reportWebVitals();
