import axios from 'axios';
import React from 'react'
import {useState, useEffect} from 'react'
import {Link, Switch} from 'react-router-dom'
import '../css/reset.css'
import '../css/trendingrepos.css'

export default function Trendingrepos(){
    var [repinfo, setRepInfo] = useState([]);
    var [loading, setLoading] = useState(true);

    var gettrendingrepo = async () => {
        var link = "/trendingrepo";
        console.log("Printing link from userinfo", link);
        var response = await axios.get(link);
        var data = response.data;
        setRepInfo(data);
        setLoading(false);
    };

    useEffect(() => {
        gettrendingrepo();
    },[]);

    return (
        <>
        <section className="maincontainer">
            <div className="button_block_2">
                <Switch>
                    <Link to="/profile">
                        <button className="home_button">Back To Home</button>
                    </Link>
                </Switch>
            </div>
            {loading?(
                <div className="loader"></div>
            ):
            (
                <div className="users">
                    {repinfo.map((value,index) => {
                        return(
                            <div className="cards">
                                <div className="details">
                                    <ul>
                                        <li><span>Repo Name : </span>{value.reponame.length>0 ? (value.reponame) : ("No info available") }</li>
                                        <li><span>About Repo : </span>{value.aboutrepo.length>0 ? (value.aboutrepo) : ("No info available") }</li>
                                        <li><span>Language : </span>{value.language.length>0 ? (value.language): ("No info available") }</li>
                                        <li><span>Stars : </span>{value.stars.length>0 ? (value.stars) : ("No info available") }</li>
                                        <li><span>Forked : </span>{value.forked.length>0 ? (value.forked) : ("No info available") }</li>
                                    </ul>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )
        }
        </section>
        </>
    )
}