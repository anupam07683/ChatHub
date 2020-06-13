import React, {useState, useEffect} from 'react';
import {Card,CardBody,CardTitle,Form,Input,Row,Col} from 'reactstrap';
import {Redirect} from 'react-router-dom';


function LoginComponent({login,isAuthenticated}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    useEffect(()=>{

    },[isAuthenticated]);

    const handleLoginSubmit = (event) =>{
      event.preventDefault();
      if(username && password)
      {
          login({username:username,password:password})
      }
    }
    if(isAuthenticated === true)
    {
      return(
        <Redirect to='/chat' username={username}/>
      )
    }
    else
    return (
      <div className='container' >
        <Row>
          <Col sm="12" md={{size:4,offset:4}}>
            <Card style={{marginTop:200,backgroundColor:' #ccffff'}} >
              <CardBody>
                <CardTitle><h3>Chat.Io</h3></CardTitle>
                <Form onSubmit={handleLoginSubmit} >
                  <div className="form-group">
                    <Input type='text' placeholder='username' onChange={(event) => { setUsername(event.target.value)}}/>
                  </div>
                  <div className="form-group">
                    <Input type='password' placeholder='password' onChange={(event) => { setPassword(event.target.value)}} />
                  </div>
                  <div className="form-group">
                    <Input type='submit' className='btn btn-primary btn-block' value='Log In' name='submit'/>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
          
        </Row>
      </div>
    );
  }

 export default LoginComponent;