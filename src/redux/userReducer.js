import * as ActionTypes from './ActionTypes';

export const Users = (
    state = {
        isLoading : true,
        errMess : null,
        users : null
    },action
    ) => {
        switch(action.type){
            
            case ActionTypes.LOADING_USERS : return { ...state,isLoading:true,errMess:null,users:null};
            case ActionTypes.USERS_FAILED : return { ...state,isLoading:false,errMess:action.payload,users:null};
            case ActionTypes.ADD_USERS : return { ...state,isLoading:false,errMess:null,users:action.payload};
            default : return state;
        }
    }
