import React, { useState, useEffect } from 'react';
import { Card, CardBody, Row, Col, ListGroup, Input, Form, Button } from 'reactstrap';
import { Redirect } from 'react-router-dom'
import io from 'socket.io-client';
import { url } from '../shared/url';
// const ENDPOINT='localhost:8000';
const ENDPOINT=  url + '/';


const RenderMessages = ({userid,messages,socket,setSeenTrue}) => {

    let seen_flag = true;

    if(messages.isLoading === true){
        return(<div></div>)
    }else if(messages.errMess){
        return(<div>{messages.err}</div>)
    }else{
        const messages1 = messages.messages.filter(message => (message.thread.participant1 === messages.selecteduser || message.thread.participant2 === messages.selecteduser));

        const mess = messages1.map(message => { 
            if(message.sender !== userid && message.seen === false)
            seen_flag = false;

            if(message.sender === userid)
            return(<button key={message._id} className="messagebutton btn btn-block " ><span className='sender'>{message.message} {message.seen === true ? <i className="fa fa-check-circle"></i>:<i className="fa fa-check-circle-o"></i>}</span></button>)
            else
            return (<button key={message._id} className='messagebutton btn btn-block'><span className='receiver'>{message.message}</span></button>)
        })

        if(!userid || messages.isLoading === true)
        {     
            return(<React.Fragment></React.Fragment>);
        }
        else{
            if(seen_flag === false){     
                setSeenTrue({sender:userid},{receiver:messages.selecteduser});
                socket.emit('set_seen_true',userid,messages.selecteduser);
            }
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
const  ChatComponent = ({connectedUsers,messages,setSelected,addNewMessage,auth,setSeen,updateSeen}) =>  {
   const [user, setUser] = useState(auth.user);
   const [ newMessage, setNewMessage] = useState('');
   const [ socket, setSocket] = useState(io(ENDPOINT));
    
    
    const sendMessage = (event) => {
        event.preventDefault();
        socket.emit('send message',{sender:user,receiver:connectedUsers.users.filter(user => (user._id === messages.selecteduser))[0],newMessage:newMessage});
    }

    const filterUsers = () => {
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
    
    useEffect( () => {
        setUser(auth.user);
        if(auth.isAuthenticated === true && auth.isLoading === false && messages.isLoading === false){
            socket.emit('connection',user.username);
            socket.emit('get connected',user);
            socket.on('new message',(message) => { 
                addNewMessage(message)
            });
            socket.on('seen',({receiver}) => {
                updateSeen(user._id,receiver);
            })
            window.scrollTo(0,document.querySelector(".messagebox").scrollHeight);
        } 
    },[ user, connectedUsers, messages, auth, addNewMessage, updateSeen])

    if(auth.isLoading === true || messages.isLoading === true){
        return(<div></div>)
    }
    else if(auth.isAuthenticated === false){
        return(<Redirect to='/'/>)
    }
    else
    return(
        <div className='container mt-1' >
            <Row className='bgcolor'>
                <Col  xs={{size:4}} md={{size:4}} style={{'paddingLeft':'0px','paddingRight':'0px'}}>
                    <Card className='bgcolor '>
                        <CardBody >
                            <div className='currentuser'>
                                <Button className="btn btn-light btn-block mb-2" style={{'backgroundColor':'#00cccc'}}><h5 ><span className='fa fa-user-circle-o fa-2x icon'></span>{user.username}</h5></Button>
                            </div>
                            <Form>
                                <Input type='text' placeholder='search' name='searchbox' className='searchbox' id='searchkey' onKeyUp={filterUsers}/> 
                            </Form>
                            <div>     
                                <RenderUsers connectedUsers={connectedUsers} setSelected={setSelected}/>
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
                                        {messages.selecteduser ?
                                        <Button className="selecteduser btn btn-light btn-block mb-2" style={{'backgroundColor':'#00cccc'}}><h5>{connectedUsers.users.filter(user => (user._id === messages.selecteduser))[0].username}</h5></Button>
                                        :<React.Fragment></React.Fragment>}
                                    </div>
                                    <div  key="messages" className="messagebox" style={{'display':'block','textAlign':'left'}} >
                                        <RenderMessages userid={user._id} messages={messages}  socket={socket} setSeenTrue={setSeen} />
                                    </div>
                                </Col>
                                
                            </Row>

                            {messages.selecteduser ?
                                <Form onSubmit={sendMessage} className='mt-2'>
                                    <Row>
                                        <Col md={{size:10}}>
                                            <textarea type="text" className='form-control' onChange={event => {setNewMessage(event.target.value)}}/>   
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
    

export default ChatComponent;