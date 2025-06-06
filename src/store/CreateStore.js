import { applyMiddleware, compose, createStore } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import thunk from 'redux-thunk';

/**
 * This import defaults to localStorage for web and AsyncStorage for react-native.
 *
 * Keep in mind this storage *is not secure*. Do not use it to store sensitive information
 * (like API tokens, private and sensitive data, etc.).
 *
 * If you need to store sensitive information, use redux-persist-sensitive-storage.
 * @see https://github.com/CodingZeal/redux-persist-sensitive-storage
 */
import storage from "redux-persist/lib/storage";
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const persistConfig = {
  key: "root",
  storage: storage,
  /**
   * Blacklist state that we do not need/want to persist
   */
  blacklist: [
    // 'auth',
  ],
};

export default (rootReducer, rootSaga) => {
  //   const middleware = []
  //   const enhancers = []

  // Connect the sagas to the redux store
  //   const sagaMiddleware = createSagaMiddleware()
  //   middleware.push(sagaMiddleware)

  //   enhancers.push(applyMiddleware(thunk))

  // Redux persist
  const persistedReducer = persistReducer(persistConfig, rootReducer);

  const store = createStore(
    persistedReducer,
    composeEnhancers(applyMiddleware(thunk))
  );
  const persistor = persistStore(store);

  // Kick off the root saga
  //   sagaMiddleware.run(rootSaga)

  return { store, persistor };
};
