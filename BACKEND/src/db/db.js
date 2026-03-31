const mongoose = require('mongoose');

function connectTodb(){
     mongoose.connect(process.env.MONGODB_URL).then(()=>{
        console.log("connected to db");
        
     })
     .catch((err)=>{
        console.error("error in connecting to db",err);
        
     })
}
module.exports = connectTodb