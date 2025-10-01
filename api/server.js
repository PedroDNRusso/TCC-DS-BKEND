const express = require('express');
const cors = require('cors');
const routes = require('../src/routes'); 

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(routes);

app.listen(port, () => {
  console.log(`✅ API rodando em http://localhost:${port}`);
});
