require('dotenv').config();

const app = require('./src/app');
const connecttodb = require('./src/db/db');

connecttodb();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`SERVER IS LISTENING AT PORT ${PORT}`);
});