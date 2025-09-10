const express = require('express');
const cors = require('cors');

const port = process.env.PORT || 3001;
const app = express();
const routes = require('../src/routes');
app.use(cors());
app.use(express.json())
app.use(routes)


app.listen(3000,()=>{
    console.log('API respondendo em http://localhost:' + port)
});