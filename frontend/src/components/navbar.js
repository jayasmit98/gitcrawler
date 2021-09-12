import React from 'react';
import {Link} from 'react-router-dom'
import navlogo from '../assets/images/github.png'
import '../css/reset.css'
import '../css/navbar.css';

export default function navbar(props){
    function logout(){
        console.log("logged-out");
        props.setstatus(false);
    }
    return(
        
        <div className="nav_container">
            <div className="img_container">
                <img src={navlogo} alt="github logo" />
            </div>
            {!props.loggedin?
            <div className="button_container">
                <Link to="/">
                    <button>Login</button>
                </Link>
                <Link to="signup">
                    <button>Signup</button>
                </Link>
            </div>:
            <div>
                <button onClick={logout}>Logout</button>
            </div>
                       
            }
            
        </div>
    )       
}