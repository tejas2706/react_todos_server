const todos = require("./todos");
const users = require("./users");

module.exports = function (app,db){
    todos(app,db);
    users(app,db);
}