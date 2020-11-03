const ObjectID = require('mongodb').ObjectID;
const jwt = require('jsonwebtoken');
var md5 = require('md5');

module.exports = function(app,db){
    app.get('/todos',(req,res) => {
        let token = req.headers.Authorization;
        let decoded = jwt.verify(token, "secretkeytodo");
        if(decoded){
            db.collection('todos').find({},(err, result)=>{
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
        let token = req.headers.Authorization;
        let decoded = jwt.verify(token, "secretkeytodo");
        if(decoded){
            const data = req.body;
            db.collection('todos').insertOne(data, (err,result) => {
                if(err) {
                    return res.send(err);
                }
                res.status(200).send(result.ops[0]);
            })
        }
        else{
            return res.status(401).send({msg:"Unauthorized"});
        }
    })
    
    app.delete('/todo/:id',(req,res) => {
        const data = {_id: new ObjectID(req.params.id)};
        let token = req.headers.Authorization;
        let decoded = jwt.verify(token, "secretkeytodo");
        if(decoded){
            db.collection('todos').remove(data, err => {
                if(err) {
                    return res.send(err);
                }
                res.send('Removed entry');
            })
        }
    })
    
    
    // app.put('/example/:id', (req,res) => {
    //     const data = {_id: new ObjectID(req.params.id)};
    //     const updateData = {$set:req.body};
    //     db.collection('bookdata').updateOne(data, updateData, (err,result)=>{
    //         if(err) {
    //             return res.send(err);
    //         }
    //         res.send(result);
    //     })
    // })

}