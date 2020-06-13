import React,{ Component } from 'react';
import LoginComponent from './LoginComponent';
import SignUpComponent from './SignUpComponent';
import ChatComponent from './ChatComponent';
import Header from './HeaderComponent';
import { connect } from 'react-redux';
import { Route, Switch, withRouter } from 'react-router-dom';
import { fetchConnectedUsers, fetchMessages, login, signup, logout, selectUser, addMessage } from '../redux/ActionCreaters';

const mapDispatchToProps = (dispatch) => ({
    fetchMessages : (token) => dispatch(fetchMessages(token)),
    fetchConnectedUsers : (token) =>  dispatch(fetchConnectedUsers(token)),
    login : (creds) => dispatch(login(creds)),
    signup : (creds) => dispatch(signup(creds)),
    logout : () => dispatch(logout()),
    setSelected : (userid) => dispatch(selectUser(userid)),
    addNewMessage : (message) => dispatch(addMessage(message))
});

const mapStateToProps = (state) => {
    return {
        messages : state.messages,
        users : state.users,
        auth : state.auth,
        signupSuccess : state.signup.success
    }
}
class Main extends Component{
    componentDidMount(){
        if(this.props.auth.isAuthenticated){
            this.props.fetchConnectedUsers(this.props.auth.token);
            this.props.fetchMessages(this.props.auth.token);
        }    
    }
    componentDidUpdate(prevProps){
       if(prevProps.auth.isAuthenticated === false && this.props.auth.isAuthenticated === true){
            this.props.fetchConnectedUsers(this.props.auth.token);
            this.props.fetchMessages(this.props.auth.token);  
       }
    }

    render(){
        return(
            <div>
                <Header auth={this.props.auth} logout={this.props.logout}/>
                <Switch>
                    <Route path='/' exact component={() => <LoginComponent login={this.props.login} isAuthenticated={this.props.auth.isAuthenticated}/>}/>
                    
                    <Route path='/login' exact component={ () => <LoginComponent login={this.props.login} isAuthenticated={this.props.auth.isAuthenticated}/>}/>
                    
                    <Route path='/signup' exact component={() => <SignUpComponent signup={this.props.signup} isAuthenticated={this.props.auth.isAuthenticated} success={this.props.signupSuccess}/>}/>
                    
                    <Route path='/chat' exact component={() => <ChatComponent connectedUsers={this.props.users} messages={this.props.messages} logout={this.props.logout} setSelected={this.props.setSelected}  addNewMessage={this.props.addNewMessage} auth={this.props.auth} />}/>
                    
                    <Route path='*' component={LoginComponent} />

                </Switch>
            </div>
        )
    }
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Main));