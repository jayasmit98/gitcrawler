import React from 'react';
import {Link, useParams, Switch} from 'react-router-dom'
import {useState, useEffect} from 'react'
import axios from 'axios'
import '../css/reset.css';
import '../css/userprofile.css';

export default function Userprofile(){
    var {username} = useParams();
    var [loading, setLoading] = useState(true);
    var [userinfo, setUserinfo] = useState({});

    var fetdata = async () => {
        var link = "/usersearch/" + username;
        var result = await axios.get(link);
        var data = result.data;
        setUserinfo(data);
        console.log(userinfo);
        setLoading(false);
    };

    useEffect(()=>{
        fetdata();
    },[]);

    return (
        <>
        <div id="parent">
            <div className="button_block_3">
                <Switch>
                    <Link to="/profile">
                        <button className="home_button">Go Back Home</button>
                    </Link>
                </Switch>
            </div>
            {loading?(
                <div className="loader"></div>
            ):(
                <div className="userdetails">
                    <figure>
                        <img src={userinfo.image} alt="" />
                    </figure>
                    <ul className="dets">
                        <li>
                            <span>USERNAME :</span>
                            {userinfo.username}
                        </li>
                        <li>
                        <span>FOLLOWERS :</span>
                            {userinfo.followers}
                        </li>
                        <li>
                        <span>FOLLOWING :</span>
                            {userinfo.following}
                        </li>
                        <li>
                        <span>STARS :</span>
                            {userinfo.stars}
                        </li>
                        <li>
                        <span>CONTRIBUTION :</span>
                            {userinfo.contribution}
                        </li>
                    </ul>
                </div>
            )}
        </div>
        
        </>
    )
}
