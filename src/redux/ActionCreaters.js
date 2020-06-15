import * as ActionTypes from './ActionTypes';
import axios from 'axios';
import { url } from '../shared/url';

export const messagesLoading = () => ({
    type : ActionTypes.LOADING_MESSAGES
})

export const addMessages = (messages) => ({
    type : ActionTypes.ADD_MESSAGES,
    payload : messages
})

export const errorLoadingMessage = (error) => ({
    type : ActionTypes.MESSAGES_FAILED,
    payload : error.message
})

export const fetchMessages = (token) => (dispatch) => {

    const bearer = 'Bearer '+ token
    dispatch(messagesLoading());
    axios({
        method:'get',
        url: url + '/chatting/getmessages',
        headers:{
            'Content-Type':'application/json',
            'Authorization':bearer
        }
    }).then(response => {
        dispatch(addMessages(response.data.messages));
    })
    .catch(error => dispatch(errorLoadingMessage(error)));
}


export const usersLoading = () => ({
    type : ActionTypes.LOADING_USERS
})

export const addUsers = (users) => ({
    type : ActionTypes.ADD_USERS,
    payload : users
})

export const errorLoadingUsers = (error) => ({
    type : ActionTypes.USERS_FAILED,
    payload : error.message
})


export const fetchConnectedUsers = (token) => (dispatch) => {

    const bearer = 'Bearer ' + token;
    dispatch(usersLoading());

    axios({
        method:'get',
        url: url + '/chatting/getconnectedusers',
        headers:{
            'Content-Type':'application/json',
            'Authorization': bearer
        }
    }).then(response => {
        dispatch(addUsers(response.data.users));
    })
    .catch(error => dispatch(errorLoadingUsers(error)));
}

export const loginRequest = (creds) => ({
    type : ActionTypes.LOGIN_REQUEST,
    creds : creds
})

export const loginSuccess = (token,user) => ({
    type : ActionTypes.LOGIN_SUCCESS,
    token : token,
    user : user

})

export const loginFailed = (error) => ({
    type : ActionTypes.LOGIN_FAILURE,
    error:error.message
})


export const login = (creds) => (dispatch) => {
    dispatch(loginRequest(creds));
    
    axios({
        method:'post',
        url: url + '/user/login',
        headers : {
          'Content-Type':'application/json'
        },
        data:{
          username:creds.username,
          password:creds.password
        }
        })
        .then(response => {
        //   console.log(response.data.token);
          localStorage.setItem('userdetails',JSON.stringify(response.data.user));
          localStorage.setItem('token',response.data.token);
          dispatch(loginSuccess(response.data.token,response.data.user));
        })
        .catch(err => {dispatch(loginFailed(err))})
}

export const logoutRequest = () => ({
    type : ActionTypes.LOGOUT_REQUEST,
})

export const logoutSuccess = () => ({
    type:ActionTypes.LOGOUT_SUCCESS,
})

export const logoutFailed = (error) => ({
    type : ActionTypes.LOGOUT_FAILURE,
    error:error.message
})

export const logout = () => (dispatch) => {
    dispatch(logoutRequest());
    localStorage.removeItem('token');
    localStorage.removeItem('userdetails');
    dispatch(errorLoadingMessage({ message : 'user logged out'}));
    dispatch(errorLoadingUsers({ message : 'user logged out'}));
    dispatch(logoutSuccess());
}


export const signupRequested = (creds) => ({
    type : ActionTypes.SIGNUP_REQUESTED,
    payload : creds
})

export const signupFailed = (error) => ({
    type : ActionTypes.SIGNUP_FAILED,
    payload:error
})

export const signupSuccess = () => ({
    type:ActionTypes.SIGNUP_SUCCESS
})


export const signup = (creds) => (dispatch) => {
    dispatch(signupRequested(creds));
    axios({
        method:'post',
        url : url + '/user/signup',
        headers:{
          'Content-Type':'application/json'
        },
        data:{
          username:creds.username,
          password:creds.password
        }
      }).then(response => {
          if(response.data.success === true)
          dispatch(signupSuccess());
          else dispatch(signupFailed('signup failed'));
      })
      .catch(err => {
          dispatch(signupFailed(err));
      })
}

export const selected = (userid) => ({
    type : ActionTypes.SELECTED,
    payload : userid
})

export const selectUser = (userid) => (dispatch) => {
    dispatch(selected(userid));
}

export const addMess = (message) => ({
    type : ActionTypes.ADD_MESSAGE,
    payload : message
})

export const addMessage = (message) => (dispatch) => {
    //console.log(message)
    dispatch(addMess(message.message));
}