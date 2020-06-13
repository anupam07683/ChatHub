import React, { Component } from 'react';
import { Card, CardBody, Row, Col, ListGroup, Input, Form, Button } from 'reactstrap';
import { Redirect } from 'react-router-dom'
import io from 'socket.io-client';
const ENDPOINT='localhost:8000';

const RenderMessages = ({userid,messages}) => {
    if(messages.isLoading === true){
        return(<div></div>)
    }else if(messages.errMess){
        return(<div>{messages.err}</div>)
    }else{
        messages = messages.messages.filter(message => (message.thread.participant1 === messages.selecteduser || message.thread.participant2 === messages.selecteduser))
        const mess = messages.map(message => { 
        if(message.sender === userid)
        return(<button key={message._id} className="messagebutton btn btn-block " ><span className='sender'>{message.message}</span></button>)
        else
        return (<button key={message._id} className='messagebutton btn btn-block'><span className='receiver'>{message.message}</span></button>)
        })

        if(!userid)
        {     
            return(<React.Fragment></React.Fragment>);
        }
        else{
            return(<div className='innermessagebox'>{mess}</div>);
        }
    }
}

const RenderUsers = ({ connectedUsers, setSelected }) => {
    if(connectedUsers.isLoading === true){
        return(<div></div>)
    }else if(connectedUsers.errMess){
        return(<div>{connectedUsers.err}</div>)
    }else{
        const users = connectedUsers.users.map((user) => {
            return(
                <Button className="userbutton btn btn-light mb-1 " key={user._id} id={user._id} onClick={() => {setSelected(user._id)}}>
                    {user.username}
                </Button>
                )            
        })

        return(
            <ListGroup className="list-group"  id='allusers'>
                {users}
            </ListGroup>
        )
    }
}
class ChatComponent extends Component {
   
    constructor(props){
        super(props);
        this.state = {
            user:this.props.auth.user,
            token:this.props.auth.token,
            newMessage:'',
            socket:io(ENDPOINT),
        };
    }
    
    setNewMessage = (message) => {
        this.setState({newMessage:message});
    }
    
    
    sendMessage = (event) => {
        event.preventDefault();
        this.state.socket.emit('send message',{sender:this.state.user,receiver:this.props.connectedUsers.users.filter(user => (user._id === this.props.messages.selecteduser))[0],newMessage:this.state.newMessage});


    }

    filterUsers = () => {
        let input, filter, ul, li, a, i, txtValue;
        input = document.getElementById("searchkey");
        filter = input.value.toUpperCase();
        ul = document.getElementById("allusers");
        li = ul.getElementsByTagName("button");
        for (i = 0; i < li.length; i++) {
            a = li[i];
            txtValue = a.textContent || a.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                li[i].style.display = "";
            } else {
                li[i].style.display = "none";
            }
        }
    }
    
    componentDidMount(){
        if(this.props.auth.isAuthenticated === true && this.props.auth.isLoading === false){
            this.state.socket.emit('connection',this.state.user.username);
            this.state.socket.emit('get connected',this.state.user);
            this.state.socket.on('new message',(message) => { 
                this.props.addNewMessage(message)
            });
            window.scrollTo(0,document.querySelector(".messagebox").scrollHeight);
        } 
    }

    render(){
        if(this.props.auth.isLoading === true){
            return(<div></div>)
        }
        else if(this.props.auth.isAuthenticated === false){
            return(<Redirect to='/'/>)
        }
        return(
            <div className='container mt-1' >
                <Row className='bgcolor'>
                    <Col  xs={{size:4}} md={{size:4}} style={{'paddingLeft':'0px','paddingRight':'0px'}}>
                        <Card className='bgcolor '>
                            <CardBody >
                                <div className='currentuser'>
                                    <Button className="btn btn-light btn-block mb-2" style={{'backgroundColor':'#00cccc'}}><h5 ><span className='fa fa-user-circle-o fa-2x icon'></span>{this.state.user.username}</h5></Button>
                                </div>
                                <Form>
                                    <Input type='text' placeholder='search' name='searchbox' className='searchbox' id='searchkey' onKeyUp={this.filterUsers}/> 
                                </Form>
                                <div>     
                                    <RenderUsers connectedUsers={this.props.connectedUsers} setSelected={this.props.setSelected}/>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
    
                    <Col xs={{size:8}} md={{size:8}} style={{'paddingLeft':'0px','paddingRight':'0px'}}>
                        <Card className='bgcolor'>
                            <CardBody>
                                <Row>
                                    <Col md={{size:12}}>
                                        <div >
                                            {this.props.messages.selecteduser ?
                                            <Button className="selecteduser btn btn-light btn-block mb-2" style={{'backgroundColor':'#00cccc'}}><h5>{this.props.connectedUsers.users.filter(user => (user._id === this.props.messages.selecteduser))[0].username}</h5></Button>
                                            :<React.Fragment></React.Fragment>}
                                        </div>
                                        <div  key="messages" className="messagebox" style={{'display':'block','textAlign':'left'}} >
                                            <RenderMessages userid={this.state.user._id} messages={this.props.messages}/>
                                        </div>
                                    </Col>
                                    
                                </Row>

                                {this.props.messages.selecteduser ?
                                    <Form onSubmit={this.sendMessage} className='mt-2'>
                                        <Row>
                                            <Col md={{size:10}}>
                                                <textarea type="text" className='form-control' onChange={event => {this.setNewMessage(event.target.value)}}/>   
                                            </Col>
                                            <Col md={{size:2}}>
                                                <Input type='submit' className='btn btn-primary' value='send'/>
                                            </Col>
                                        </Row>
                                    </Form>
                                    : <React.Fragment></React.Fragment>
                                }
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
    
}

export default ChatComponent;