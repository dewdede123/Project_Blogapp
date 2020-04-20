//model
var bcrypt = require('bcryptjs');
var mongoose = require('mongoose');

mongoose.connect('mongodb+srv://chon:1234@cluster0-zk4v3.mongodb.net/Blog?retryWrites=true&w=majority', {useNewUrlParser: true,useUnifiedTopology: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console,'Connection Error'));

//schema table ใน DB
var userSchema = mongoose.Schema({
    username: String ,
    email: String ,
    password: String ,
    birthdate: Date ,
    image: String
});
//export model ไปใช้ router ชื่อ users.js
var User = module.exports = mongoose.model('User',userSchema);


//หน้า register ก่อนที่บันทึก password ต้อง bcrypt ซะก่อน 
module.exports.createUser = function(newUser, callback)
{
    bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
        newUser.password = hash;
        newUser.save(callback);
        });
    }); 
}

module.exports.getUserById = function(id,callback)
{
    User.findById(id,callback);
}

module.exports.getUserByEmail = function(email,callback)
{
    var query = { email : email };
    User.findOne(query,callback);
}
module.exports.comparePassword = function(password,hash,callback)
{
    bcrypt.compare(password,hash,function(err,isMatch){
        callback(null,isMatch)
    });
}