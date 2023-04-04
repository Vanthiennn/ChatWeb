import { createStore, applyMiddleware,combineReducers } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import StoredReducer from './StoredReducer'
import rootSaga from './watcherStored'
const persistConfig = {
    key: 'root',
    storage
}
const rootReducer = combineReducers({
    StoredReducer
  })
const reducer = persistReducer(persistConfig, rootReducer)
const saga = createSagaMiddleware()
const middleWares = [saga]
const store = createStore(
    reducer,
    applyMiddleware(...middleWares)
);

saga.run(rootSaga)

export default store