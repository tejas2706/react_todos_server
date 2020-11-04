const ObjectID = require('mongodb').ObjectID;
const jwt = require('jsonwebtoken');
var md5 = require('md5');


module.exports = function(app,db){

    app.post('/login', (req,res) => {
        const data = req.body;
        console.log("data", data);
        const userData = {
            username: data.username,
            password: md5(data.password)
        }
        console.log("userData", userData);
        db.collection('users').findOne(userData,(err, result)=>{
            if(err) {
                return res.status(400).send({msg:"Error Occured while Logging in, Please try again."});
            }
            if(result){
                const accessToken = jwt.sign({"username":userData.username}, process.env.JWT_SECRET)
                console.log("accessToken", accessToken)
                return res.status(200).send(JSON.stringify({token:accessToken}));
            }else{
                return res.status(400).send({msg:"UserName not registered, please sign up."});
            }
        })
    })

    app.post('/signup', (req,res) => {
        const data = req.body;
        console.log("data", data)
        const userData = {
            name: data.name,
            username: data.username,
            password: md5(data.password)
        }
        db.collection('users').findOne({"username":userData.username}, (err, result)=>{
            if(err){
                return res.status(404).send({msg:"Error occured while signing up."});
            }
            if(result){
                return res.status(409).send({msg:"Username already exists, please choose another user name."});
            }else{
                db.collection('users').insertOne(userData, (err,result) => {
                    if(err) {
                        return res.status(400).send({msg:JSON.stringify(err)});
                    }
                    if(result.ops[0]){
                        const accessToken = jwt.sign({"username":userData.username}, process.env.JWT_SECRET)
                        res.status(200).send(JSON.stringify({token:accessToken}));
                    }else{
                        return res.status(400).send({msg:"Unable to create user."});
                    }
                })
            }
        })
        
    })
}