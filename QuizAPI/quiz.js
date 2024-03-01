var express = require('express');
var app= express();
var mysql = require('mysql');
var cors = require('cors');
app.use(express.json());

app.use(cors({
    "origin": '*',
}))

 const pool = mysql.createPool({
     host:"localhost",
     user:'root',
     password:"Root@123",
     database:"quizdb",
     connectionLimit:50
 })

app.get("/questions",(req,res)=>{
pool.getConnection(function(error,temcont){
    if(!!error){
        temcont.release();
        console.log(error);
    }else{
        console.log('connected');
        temcont.query("select * from questions;",function(err,result,field){
            temcont.release();
            if(!!err){
                 console.log('Error');
            }else{
                res.json(result);
            }
        });
    }
});
}); 

app.post("/submitAnswer",(req,res)=>{
   
    pool.getConnection(function(error,temcont){
        if(!!error){
            temcont.release();
            console.log(error);
        }else{
            console.log('connected');
            var element = req.body.answers;
  
            if(element.isItForUpdate)
            {
            var cmd="update examdetails set selectedans='"+element.answer+"' where qnum="+element.qnum+";";
                console.log(cmd);
                temcont.query(cmd,function(err,result,field){
                     temcont.release();
                     if(!!err){
                         console.log('Error');
                     }
                     else{
                        res.json(result);
                    }
                });
            }else{
                var cmd="insert into examdetails(userid,qnum,selectedans)values('1',"+element.qnum+",'"+element.answer+"');"
                temcont.query(cmd,function(err,result,field){
                     temcont.release();
                     if(!!err){
                         console.log('Error');
                     }
                     else{
                        res.json(result);
                    }
                });
            }
        }
    });
    }); 

    app.post("/CreateNewuser",(req,res)=>{
        pool.getConnection(function(error,temcont){
            if(!!error){
                temcont.release();
                console.log('Error');
            }else{
              console.log('connected');
             var querystring = "insert into users(Username,email,userpwd)values('"+req.body.User.FirstName+"','"+req.body.User.Email+"','"+req.body.User.password+"' );";
              temcont.query(querystring,function(err,result,field){
              temcont.release();
                if(!!err){
                    console.log('Error');
                    return res.json(0);
                }else{
                   return res.json(1);
                }
              })
            }
        })
    })

    app.post("/LoginUser",(req,res)=>{
        pool.getConnection(function(error,temcont){
            if(!!error){
                temcont.release();
                console.log('Error');
            }else{
              console.log('connected');
             var querystring = "select * from users where Username='"+req.body.User.FirstName+"' and userpwd= '"+req.body.User.password+"'";
              temcont.query(querystring,function(err,result,field){
              temcont.release();
                if(!!err){
                    console.log('Error');
                    return res.json(0);
                }else{
                   return res.json(result.length);
                   
                }
              })
            }
        })
    })

    
app.listen(5000);