import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { Link, useHistory } from "react-router-dom";
import '../css/reset.css'
import '../css/profile.css'
import navlogo from '../assets/images/github.png'

export default function Profile(){
    const history = useHistory();
    var [users, setUsers]=useState("");
    var [loading, setLoading] = useState(false);
    var [loaded, setLoaded] = useState(false);
    var [info, setInfo] = useState([]);
    var [pageno, setPageno] = useState(1);
    var [username, setUsername] = useState("");
    var usermod = (e) => {
        setUsers(e.target.value);
    }
    var usernamemod = (e) => {
        setUsername(e.target.value);
    }
    var userprof = (e) => {
        e.preventDefault();
        var path = "/user/"+username;
        console.log("the path generated is-> ",path);
        history.push(path);
    }
    var getinfo = async (e) => {
        e.preventDefault();
        var postobj = {
            users:users,
        };
        setLoading(true);
        var results = await axios.post('/search', postobj);
        setLoading(false);
        setLoaded(true);
        setInfo(results.data);
        console.log("the data->", info); 
    };
    var getpage = async (n) => {
        setPageno(n);
        var link = "/pagination/" + n + "/" + users;
        console.log(link);
        setLoading(true);
        var results = await axios.get(link);
        setLoading(false);
        setLoaded(true);
        setInfo(results.data);
    }
    return (
        <>
        <div className="main_profile">
            <div className="input_container">
                <div className="input_field">
                    <figure className="logo">
                        <img src={navlogo}  />
                    </figure>
                    <form onSubmit={getinfo}>
                        <input type="text" placeholder="Search for Users by their name" name="users" value={users} onChange={usermod} />
                    </form>
                </div>
                <div className="input_field">
                    <figure className="logo">
                        <img src={navlogo}  />
                    </figure>
                    <form onSubmit={userprof}>
                        <input type="text" placeholder="Search for Users by their username" name="users" value={username} onChange={usernamemod} />
                    </form>
                </div>
            </div>
            <Link to="/trendingrepo">
                <button className="trending_button">Trending Repos</button>
            </Link>
            {loading?(
                <div className="loader"></div>
            ):(
                <div className="users">
                    {info.map((value,index) => {
                        return (
                            <div className="cards">
                                <figure>
                                    <Link to={`/user/${value.username}`}>
                                        <img src={value.imgsrc} alt="" />
                                    </Link>
                                </figure>
                                <div className="details">
                                    <ul>
                                        <li>
                                            <span>
                                                Name : 
                                            </span>
                                            {value.name.length>0?(value.name):"No info available"}
                                        </li>
                                        <li>
                                            <span>Username :</span>
                                            {value.username.length>0?(value.username):"No info available"}
                                        </li>
                                        <li>
                                            <span>Location :</span>
                                            {value.location.length>0?(value.location):"No info available"}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
            {loaded?(
                <ul className="pagination">
                    <li className={"page " + (pageno===1?"active":"inactive")} onClick={()=>getpage(1)}>1</li>
                    <li className={"page " + (pageno===2?"active":"inactive")} onClick={()=>getpage(2)}>2</li>
                    <li className={"page " + (pageno===3?"active":"inactive")} onClick={()=>getpage(3)}>3</li>
                    <li className={"page " + (pageno===4?"active":"inactive")} onClick={()=>getpage(4)}>4</li>
                    <li className={"page " + (pageno===5?"active":"inactive")} onClick={()=>getpage(5)}>5</li>
                </ul>
            ):(
                <div></div>
            )}
        </div>
        </>
    )
}