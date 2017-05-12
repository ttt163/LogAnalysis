import rootReducer from './reducers/allReducers.js';
import { createStore } from 'redux';
export let store = createStore(rootReducer);
