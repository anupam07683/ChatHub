import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { Messages } from './MessageReducer';
import { Users } from './userReducer';
import { Auth } from './authReducer';
import { SignUp } from './signupReducer';

export const ConfigureStore = () => {
    const store = createStore(
        combineReducers({
            messages : Messages,
            users : Users,
            auth : Auth,
            signup : SignUp
        }),applyMiddleware(thunk,logger));

    return store;
}