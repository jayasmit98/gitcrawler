import React from 'react'
import { useState} from 'react'
import {Link, useHistory} from 'react-router-dom'
import '../css/reset.css'
import '../css/signup.css'

export default function Signup(){
    var history = useHistory();
    var [users,setUsers]=useState({
        email:"",
        password:"",
        cpassword:""
    });

    var updatereq = (e) => {
        var fieldname = e.target.name;
        var fieldvalue = e.target.value;
        setUsers({...users,[fieldname]:fieldvalue});
    }

    var postres = async (e) => {
        e.preventDefault();
        var email=users.email;
        var password=users.password;
        var cpassword=users.cpassword;
        var result = await fetch("/signup", {
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                email:email,
                password:password,
                cpassword:cpassword
            })
        })
        var data = await result;
        console.log("the data recieved after signing up", data);
        if(data.status==="User registered successfully"){
            history.push("/");
        }
        setUsers({
            email:"",
            password:"",
            cpassword:""
        })
    }
    
    return (
        <>
        <section className="signup_container_2">
            <header>
                <h2>Login</h2>
            </header>
            <form >
                <div className="input_container">
                    <div className="input_block">
                        <input type="email" placeholder="Enter your Email" name="email" value={users.email} onChange={updatereq} autoFocus required/>
                    </div>
                    <div className="input_block">
                        <input type="password" placeholder="Enter your Password" name="password" value={users.password} onChange={updatereq} required/>
                    </div>
                    <div className="input_block">
                        <input type="password" placeholder="Confirm Password" name="cpassword" value={users.cpassword} onChange={updatereq}/>
                    </div>
                </div>
                <div className="button_container">
                    <button onClick={postres}>SUBMIT</button>
                </div>
            </form>
            <footer>
                <p>Already have an account?</p>
                <Link to="/">
                    <span>Login</span>
                </Link>
            </footer>
        </section>
        </>
    )
}
