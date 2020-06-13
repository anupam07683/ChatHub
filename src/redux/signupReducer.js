import * as ActionTypes from './ActionTypes';

export const SignUp = (state ={
    isLoading : false,
    errMess : null,
    user : null,
    success : false
},action) => {
    switch(action.type) {
        case ActionTypes.SIGNUP_REQUESTED :
            return {...state, isLoading : true,errMess:null,user:null,success:false};

        case ActionTypes.SIGNUP_SUCCESS :
            return {...state, isLoading : false, errMess : null, user : action.payload,success:true};

        case ActionTypes.SIGNUP_FAILED : 
            return { ...state,isLoading : false, errMess: action.payload , user : null,success:false};
        
        default : return state;
    }
}