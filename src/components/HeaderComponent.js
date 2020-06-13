import React from 'react';
import { Button, Col } from 'reactstrap';

const Header = ({ auth, logout}) => {
    return (
        <div className="container mt-3">
            <div className="row" style={{'backgroundColor':'#00b3b3','padding':'15px'}}>  
                <Col xs={{size:4}} md={{size:2}} style={{'paddingRight':'0px'}}>
                    <img src={'logo1.png'}  alt='logo' height={50} width={100} />
                </Col>
                <Col xs={{size:5}} md={{size:8}} style={{'paddingLeft':'0px'}}>
                    <h3 style={{'textAlign':'left'}}>ChatIo</h3>
                </Col>
                <Col xs={{size:3}} md={{size:2}}>
                    <div style={{'paddingTop':'6px'}}>
                        {auth.isAuthenticated ? <Button className='ml-auto' onClick={logout}><span className="fa fa-sign-out"></span>Logout</Button> : null}
                    </div> 
                </Col>
                
                  
            </div>
        </div>
    );
}

export default Header;