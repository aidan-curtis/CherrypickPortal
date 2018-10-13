import {applyMiddleware, compose, createStore} from 'redux';
import reducers from 'store/reducers';
import thunk from 'redux-thunk';
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web and AsyncStorage for react-native
import { persistReducer } from 'redux-persist'

 
const persistConfig = {
    key: 'root',
    storage,
}
 
const persistedReducer = persistReducer(persistConfig, reducers)

const composeEnhancers =
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;

const enhancer = composeEnhancers(
    applyMiddleware(thunk)
);

const store = createStore(persistedReducer, enhancer);


export default store;


