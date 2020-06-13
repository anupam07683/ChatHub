import * as ActionTypes from './ActionTypes';

export const Messages = (
    state = {
        isLoading : true,
        errMess : null,
        messages : null,
        selecteduser: null,
    },action
    ) => {
        switch(action.type){
            case ActionTypes.LOADING_MESSAGES: 
                return { ...state,isLoading:true,errMess:null,messages:null,selecteduser:null};
            
            case ActionTypes.MESSAGES_FAILED : 
                return { ...state,isLoading:false,errMess:action.payload,messages:null,selecteduser:null};
            
            case ActionTypes.ADD_MESSAGES : 
                return { ...state,isLoading:false,errMess:null,messages:action.payload,selecteduser:null};
            
            case ActionTypes.ADD_MESSAGE : 
                return {state,isLoading:false,errMess:null,messages:(state.messages.filter(message => (message._id === action.payload._id)).length === 0 ? state.messages.concat(action.payload) : state.messages),selecteduser:state.selecteduser}
            
            case ActionTypes.SELECTED : 
                return{...state,selecteduser:action.payload};
            
            default : return state;
        }
    }
