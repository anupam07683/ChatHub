import React, {useState, useEffect} from 'react';
import {Card,CardBody,CardTitle,Form,Input,Row,Col} from 'reactstrap';
import {Redirect} from 'react-router-dom';


function SignUpComponent({ signup , isAuthenticated ,success}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');


    useEffect(()=>{

    },[success]);

    const handleSignupSubmit = (event) =>{
      event.preventDefault();
      if(username && password)
      {
        signup({username:username,password:password})
      }
    }
    if(isAuthenticated === true){
      return (<Redirect to='/chat' />)
    }
    if(success === true){
      return(<Redirect to='/login' />);
    }else
    return (
      <div className='container'>
        <Row>
          <Col sm="12" md={{size:4,offset:4}}>
            <Card style={{marginTop:200,backgroundColor:' #ccffff'}}>
              <CardBody>
                <CardTitle><h3>ChatHub</h3></CardTitle>
                <Form onSubmit={handleSignupSubmit}>
                  <div className="form-group">
                    <Input type='text' placeholder='username' onChange={(event) => setUsername(event.target.value)}/>
                  </div>
                  <div className="form-group">
                    <Input type='password' placeholder='password' onChange={(event) => setPassword(event.target.value)}/>
                  </div>
                  <div className="form-group">
                    <Input type='submit' className='btn btn-primary btn-block' value='Sign Up' name='submit'/>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
          
        </Row>
      </div>
      
    );
  }

 export default SignUpComponent;