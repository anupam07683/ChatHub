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
            
            case ActionTypes.SET_SEEN :
                return {...state,isLoading:false,messages:state.messages.map(message => {
                        if((message.sender !== action.sender) && (message.thread.participant1 === action.sender || message.thread.participant2 === action.sender)){
                            message.seen = true;
                        }
                        return message;
                })};

            case ActionTypes.UPDATE_SEEN : 
                return {...state,isLoading:false,messages:state.messages.map(message => {
                    if(message.sender === action.user && (message.thread.participant1 === action.receiver || message.thread.participant2 === action.receiver)){
                        message.seen = true;
                    }
                    return message;
                })};
            case ActionTypes.LOADING_SEEN : 
                return {...state,isLoading:true}
            default : return state;
        }
    }
