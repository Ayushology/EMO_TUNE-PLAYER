require('dotenv').config();

const app = require('./src/app')
const connecttodb = require('./src/db/db')
connecttodb();
app.listen(3000,(req,res)=>{
    console.log("SERVER IS LISTENING AT PORT 3000");  
})

