import React,{ useState} from 'react';
import {Link} from 'react-router-dom';
import GoogleLogin from 'react-google-login';
import '../css/reset.css'
import "../css/login.css"
export default function Login(props){

    var [user, setUser] = useState({
        email:"",
        password:""
    });
    var name, value;
    const changevalue = (d) => {
        name = d.target.name;
        value = d.target.value;
        setUser({...user,[name]:value});
    }
    const responded=(response) => {
        console.log(response);
        props.setstatus(true);
    }

    const notresponded = (response) => {
        console.log(response);
    }


    const postData = async (d) => {
        d.preventDefault();
        var email = user.email;
        var password = user.password;
        var res = await fetch("/login", {
            method:"POST",
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({
                email:email,
                password:password
            })
        })
        var data = await res.json();
        if(data.status === "Logged in"){
            props.setstatus(true);
        }
        window.alert(data.status);
        setUser({
            email:"",
            password:""
        })
    }
    return(
        <section className="login_section">
            <div className="form_container">
                <header>
                    <h2>Login</h2>
                </header>
                <form>
                    <div className="input_block">
                        <div className="input_container">
                            <i class="fas fa-envelope"></i>
                            <input type="text" value={user.email} name="email" placeholder="Enter your Email" required onChange={changevalue}/>
                        </div>
                        <div className="input_container">
                            <i class="fas fa-key"></i>
                            <input type="text" value={user.password} name="password" placeholder="Enter Your Password" required onChange ={changevalue}/>
                        </div>
                    </div>
                    <div className="button_block">
                        <button className = "dark-blue" onClick={postData}>LOGIN</button>
                        <span className="or">OR</span>
                        <GoogleLogin className="googlebutton"
                            clientId='163884894151-cfbtvauiffgfh7sgbbg6pm9ln25cqro0.apps.googleusercontent.com'
                            buttonText='Login with Google'
                            onSuccess={responded}
                            onFailure={notresponded}
                            //cookiePolicy={"singe_host_origin"}
                        />
                    </div>
                </form>
                <div className="signup_container">
                    <p>Don't have an account</p>
                    <Link to="/signup"><span>Sign Up</span></Link>
                </div>
            </div>
        </section>
    )
}