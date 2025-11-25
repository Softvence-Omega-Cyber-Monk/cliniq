import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import counterReducer from "./Slices/counterSlice/counterSlice";
import authReducer from "./Slices/AuthSlice/authSlice";
import formReducer from "./Slices/FormSlice/FormSlice";
import baseApi from "./api/BaseApi/BaseApi";
import aiApi from "./api/BaseApi/AiApi";

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "accessToken", "refreshToken", "userType"],
};

const rootReducer = {
  [baseApi.reducerPath]: baseApi.reducer,
  [aiApi.reducerPath]: aiApi.reducer,
  counter: counterReducer,
  auth: persistReducer(authPersistConfig, authReducer),
  form: formReducer,
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware, aiApi.middleware),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;