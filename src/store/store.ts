// redux/store.ts

import { combineReducers } from "redux";
import { persistStore, persistReducer } from 'redux-persist';
import appReducer from "./app/reducer";
import { configureStore } from '@reduxjs/toolkit';
import storage from "./sync_storage";

const combinedReducer = combineReducers({
    app: appReducer,
});

const persistConfig = {
    key: 'nextjs',
    whitelist: [
        'app',
    ], // only counter will be persisted, add other reducers if needed
    storage, // if needed, use a safer storage
};

const persistedReducer = persistReducer(persistConfig, combinedReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Disable serializable checks for redux-persist
        }),
});
// Create the store
const persistor = persistStore(store);

export { store, persistor };

// Types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
