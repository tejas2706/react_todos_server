const ObjectID = require('mongodb').ObjectID;
const jwt = require('jsonwebtoken');

module.exports = function(app,db){
    app.get('/todos',(req,res) => {
        let token = req.headers.authorization;
        let decoded = jwt.verify(token, "secretkeytodo");
        if(decoded){
            db.collection('todos').find({"username":decoded.username}).toArray((err, result)=>{
                if(err) {
                    return res.send(err);
                }
                res.status(200).send(JSON.stringify(result));
            })
        }
        else{
            return res.status(401).send({msg:"Unauthorized"});
        }
    })

    app.post('/todo', (req,res) => {
        let token = req.headers.authorization;
        let decoded = jwt.verify(token, "secretkeytodo");
        if(decoded){
            const data = req.body;
            data.username = decoded.username;
            db.collection('todos').insertOne(data, (err,result) => {
                if(err) {
                    return res.send(err);
                }
                return res.status(200).send(result.ops[0]);
            })
        }
        else{
            return res.status(401).send({msg:"Unauthorized"});
        }
    })
    
    app.delete('/todo/:id',(req,res) => {
        const data = {_id: new ObjectID(req.params.id)};
        let token = req.headers.authorization;
        let decoded = jwt.verify(token, "secretkeytodo");
        if(decoded){
            db.collection('todos').deleteOne(data, err => {
                if(err) {
                    console.log("err", err)
                    return res.send(err);
                }
                return res.status(200).send({msg:"Removed todo"});
            })
        }
        else{
            return res.status(401).send({msg:"Unauthorized"});
        }
    })
}