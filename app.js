const express = require('express');
const app = express();
const request = require('request');
const cheerio = require('cheerio');
const session = require('express-session');
const mongoose = require('mongoose');
const cors = require("cors");
const user = require('./models/userschema');



app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cors());

const dblink="mongodb+srv://jayasmit98:test@gitcrawler.vdcck.mongodb.net/Gitcrawler?retryWrites=true&w=majority";
const connectdb = async () => {
    try{
        const con = await mongoose.connect(dblink,{
            useNewUrlParser:true,
            useUnifiedTopology:true
            
        })
        console.log(`Mongodb connected : ${con.connection.host}`);
    }catch(err){
        console.log(err);
        process.exit(1);
    }
}
connectdb();
//handling the signup request
app.post("/signup", async(req,res)=>{
    var email = req.body.email;
    var password = req.body.password;
    var cpassword = req.body.cpassword;
    if(!email || !password || !cpassword){
        return res.status(442).json({status:"Please fill all the details"});
    }
    else if(!email.includes("@")){
        return res.json({status:"Invalid email"});
    }
    else if(password!==cpassword){
        return res.json({status:"Passwords must match"});
    }   
    try{
        var exists = await user.findOne({email:email});
        if(exists){
            return res.status(200).json({status:"Email already exists"});
        }
        else{
            var User = await user.create({
                email:email,
                password:password
            });
            if(User){
                console.log("User successfully registered");
                return res.status(200).json({status:"User saved successfully"});
            }
        }
    }
    catch(err){
        console.log(err);
    }
});

app.post("/login", async(req,res)=> {
    var email=req.body.email;
    var password = req.body.password;
    if(!email || !password){
        res.status(200).json({status:"Please fill all the fields"});
    }
    try{
        var exists = await user.findOne({email:email, password:password});
        if(exists){
            console.log("user found");
            return res.status(200).json({status:"Logged in"});
        }
        else{
            console.log("User doesn't exists");
            return res.status(200).json({status:"Invalid email Or Password"});
        }
    }
    catch(err){
        console.log(err);
        return res.json({status:"Error"})
    }
})

app.post("/search", async(req,resp)=> {
    var name = req.body.users;
    var url= "https://github.com/search?p=1&q="+name+"&type=Users"
    
    console.log("the formulated url is ", url);

    request(url, (err,res,html)=> {
        if(!err && res.statusCode == 200){
            const $ = cheerio.load(html);
            var element = $('#user_search_results > div.Box.border-0').children();
            var userinfo = [];
            element.each((i,el) => {
                var uname = $('#user_search_results > div.Box.border-0 > div:nth-child('+(i+1)+') > div.flex-auto > div:nth-child(1) > div.f4.text-normal > a.mr-1').text();
                var username = $('#user_search_results > div.Box.border-0 > div:nth-child('+(i+1)+') > div.flex-auto > div:nth-child(1) > div.f4.text-normal > a.color-text-secondary').text();
                var location = $('#user_search_results > div.Box.border-0 > div:nth-child('+(i+1)+') > div.flex-auto > div.d-flex.flex-wrap.text-small.color-text-secondary > div').text().trim();
                var imgsrc = $('#user_search_results > div.Box.border-0 > div:nth-child('+(i+1)+') > div.flex-shrink-0.mr-2 > a > img').attr('src');
                var userobj={
                    name:uname,
                    username:username,
                    location:location,
                    imgsrc:imgsrc
                }
                console.log(userobj);
                userinfo.push(userobj);
            
            })
            console.log(userinfo);
            return resp.status(200).json(userinfo);
            
        }
    })
})

app.get("/usersearch/:name", async(req,resp)=> {
    var name = req.params.name;
    var link = "https://github.com/" + name;
    console.log("the link generated is ", link);
    request(link, (err,res,html)=> {
        if(!err && res.statusCode==200){
            const $ = cheerio.load(html);
            var contribution=$('#js-pjax-container > div.container-xl.px-3.px-md-4.px-lg-5 > div > div.flex-shrink-0.col-12.col-md-9.mb-4.mb-md-0 > div:nth-child(2) > div > div.mt-4.position-relative > div.js-yearly-contributions > div > h2').text().trim();
            var image=$('#js-pjax-container > div.container-xl.px-3.px-md-4.px-lg-5 > div > div.flex-shrink-0.col-12.col-md-3.mb-4.mb-md-0 > div > div.clearfix.d-flex.d-md-block.flex-items-center.mb-4.mb-md-0 > div.position-relative.d-inline-block.col-2.col-md-12.mr-3.mr-md-0.flex-shrink-0 > a > img').attr('src');
            var username=$('#js-pjax-container > div.container-xl.px-3.px-md-4.px-lg-5 > div > div.flex-shrink-0.col-12.col-md-3.mb-4.mb-md-0 > div > div.clearfix.d-flex.d-md-block.flex-items-center.mb-4.mb-md-0 > div.vcard-names-container.float-left.col-12.py-3.js-sticky.js-user-profile-sticky-fields > h1 > span.p-nickname.vcard-username.d-block').text().trim();
            var followers=$('#js-pjax-container > div.container-xl.px-3.px-md-4.px-lg-5 > div > div.flex-shrink-0.col-12.col-md-3.mb-4.mb-md-0 > div > div.d-flex.flex-column > div.js-profile-editable-area.d-flex.flex-column.d-md-block > div.flex-order-1.flex-md-order-none.mt-2.mt-md-0 > div > a:nth-child(1) > span').text().trim();
            var stars=$('#js-pjax-container > div.container-xl.px-3.px-md-4.px-lg-5 > div > div.flex-shrink-0.col-12.col-md-3.mb-4.mb-md-0 > div > div.d-flex.flex-column > div.js-profile-editable-area.d-flex.flex-column.d-md-block > div.flex-order-1.flex-md-order-none.mt-2.mt-md-0 > div > a:nth-child(3) > span').text().trim();
            var following=$('#js-pjax-container > div.container-xl.px-3.px-md-4.px-lg-5 > div > div.flex-shrink-0.col-12.col-md-3.mb-4.mb-md-0 > div > div.d-flex.flex-column > div.js-profile-editable-area.d-flex.flex-column.d-md-block > div.flex-order-1.flex-md-order-none.mt-2.mt-md-0 > div > a:nth-child(2) > span').text().trim();
        }
        var obj = {
            contribution:contribution,
            image:image,
            username:username,
            followers:followers,
            stars:stars,
            following:following
        }
        return resp.status(200).json(obj);
    })
});

app.get("/trendingrepo", async(req,resp)=> {
    var link = 'https://github.com/trending';
    request(link, (err,res,html)=>{
        if(!err && res.statusCode === 200){
            const $ = cheerio.load(html);
            var element = $('#js-pjax-container > div.position-relative.container-lg.p-responsive.pt-6 > div > div:nth-child(2)').children();
            var repoinfo = [];
            element.each((i, el) => {
                var reponame = $('#js-pjax-container > div.position-relative.container-lg.p-responsive.pt-6 > div > div:nth-child(2) > article:nth-child('+(i+1)+') > h1 > a').text().trim();
                var aboutrepo = $('#js-pjax-container > div.position-relative.container-lg.p-responsive.pt-6 > div > div:nth-child(2) > article:nth-child('+(i+1)+') > p').text().trim();
                var language = $('#js-pjax-container > div.position-relative.container-lg.p-responsive.pt-6 > div > div:nth-child(2) > article:nth-child('+(i+1)+') > div.f6.color-text-secondary.mt-2 > span.d-inline-block.ml-0.mr-3 > span:nth-child(2)').text().trim();
                var stars = $('#js-pjax-container > div.position-relative.container-lg.p-responsive.pt-6 > div > div:nth-child(2) > article:nth-child('+(i+1)+') > div.f6.color-text-secondary.mt-2 > a:nth-child(2)').text().trim();
                var forked = $('#js-pjax-container > div.position-relative.container-lg.p-responsive.pt-6 > div > div:nth-child(2) > article:nth-child('+(i+1)+') > div.f6.color-text-secondary.mt-2 > a:nth-child(3)').text().trim();
                var obj = {
                    reponame:reponame,
                    aboutrepo:aboutrepo,
                    language:language,
                    stars:stars,
                    forked:forked
                }
                repoinfo.push(obj);
            })
            return resp.status(200).json(repoinfo);
        }
        else{
            console.log(error)
        }
    })
})

app.get("/pagination/:no/:users", async(req,resp) => {
    var no = req.params.no;
    var users = req.params.users;
    var url="https://github.com/search?p="+no+"&q="+users+"&type=Users";
    request(url, (err,res,html)=> {
        if(!err && res.statusCode===200){
            const $ = cheerio.load(html);
            var element = $('#user_search_results > div.Box.border-0').children();
            var userinfo=[];
            element.each((i, el)=> {
                var uname=$('#user_search_results > div.Box.border-0 > div:nth-child('+(i+1)+') > div.flex-auto > div:nth-child(1) > div.f4.text-normal > a.mr-1').text();
                username = $('#user_search_results > div.Box.border-0 > div:nth-child('+(i+1)+') > div.flex-auto > div:nth-child(1) > div.f4.text-normal > a.color-text-secondary').text();
                location = $('#user_search_results > div.Box.border-0 > div:nth-child('+(i+1)+') > div.flex-auto > div.d-flex.flex-wrap.text-small.color-text-secondary > div').text().trim();
                imgsrc = $('#user_search_results > div.Box.border-0 > div:nth-child('+(i+1)+') > div.flex-shrink-0.mr-2 > a > img').attr('src');
            var userobj = {
                name:uname,
                username:username,
                location:location,
                imgsrc:imgsrc
            }
            userinfo.push(userobj);
            })
            return resp.status(200).json(userinfo);
        }
    })
})

var port = process.env.PORT || 5000;

if(process.env.NODE_ENV == "production"){
    app.use(express.static('frontend/build'))
    const path = require('path');
    app.get("*", (req,res)=> {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
    })
}

app.listen(port,() => {
    console.log(`server running on port `+port);
});

module.exports = app;
