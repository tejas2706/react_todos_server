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
                return res.status(400).send({msg:"Error Occured while signing in, Please try again."});
            }
            if(userData){
                const accessToken = jwt.sign(data, "asdlkjasdlkj")
                console.log("accessToken", accessToken)
                res.status(200).send(JSON.stringify({token:accessToken}));
            }else{
                return res.status(400).send({msg:"Mail Id not registered, please sign up."});
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
        db.collection('users').insertOne(userData, (err,result) => {
            if(err) {
                return res.send(err);
            }
            if(result.ops[0]){
                const accessToken = jwt.sign(data, "asdlkjasdlkj")
                res.status(200).send(JSON.stringify({token:accessToken}));
            }
        })
    })
}