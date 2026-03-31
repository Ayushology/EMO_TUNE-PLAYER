const express = require('express')
const songRoutes = require('./routes/song.routes')
const app = express();
const cors = require('cors')
// ! MIDDLE WARE TO ACCESS STRINGS AS NODE DIRECTLY CANT DO IT
app.use(express.json());
app.use(cors());
// ! TELLING THE APP.JS THAT SOME API HAS BEEN CREATED IN THE ROUTES SECTION AND NOW APP HAS TO USE IT SO THAT NODE IS AWARE ABOUT IT
app.use('/',songRoutes)

module.exports = app;