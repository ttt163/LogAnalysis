import { combineReducers } from 'redux'
import userReducer from "./userReducer.js"
import streamReducer from "./streamReducer.js"
import channelReducer from "./channelReducer.js"
import originReducer from "./originReducer.js"
//import loadingData from "./loadingReducer.js"
import validator_1 from "../public/js/validate/reducers.js"
const rootReducer = combineReducers({
        userReducer,
        streamReducer,
        channelReducer,
        originReducer,
        //loadingData,
        validator_1
    }
);
export default rootReducer

