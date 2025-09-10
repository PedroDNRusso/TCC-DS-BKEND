const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('../swagger.json');

const app = express();
const routes = require('../src/routes');
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json())
app.use(routes)

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.listen(port, (req, res) => {
    console.log('API respondendo em http://localhost:' + port)
    console.log('Documentação em http://localhost:3000/docs');
});