// ENVIRONMENT SET-UP
require('dotenv').config();
require('express-async-errors');

// APP CORE
const express = require('express');
const app = express();
const connectDB = require('./db/connect')

// MIDDLEWARE
const authenticateUser = require('./middleware/authentication')
const errorHandler = require('./middleware/error-handler')
const notFound = require('./middleware/not-found')

// ROUTES
const jobsRouter = require('./routes/jobs')
const authRouter = require('./routes/auth')

// SwaggerUI
const YAML = require('yamljs');
const swaggerUI = require('swagger-ui-express');
const swaggerDoc = YAML.load('./swagger.yaml')

// SECURITY LIBRARIES
const xss = require('xss-clean');
const helmet = require('helmet');
const rateLimiter = require('express-rate-limit');
const cors = require('cors');

// VARIABLES
const port = process.env.PORT || 3000
const minutes = 1000 * 60
const limit = 15 * minutes

app
  .set('trust proxy', 1)
  .use(rateLimiter({
    windowMs: limit,
    max: 100,
  }))

  .use([express.urlencoded({extended: false}), express.json()])
  
  // safety blanket
  .use(helmet())

  // cors prevents CORS errors
  .use(cors())
  
  // user sanitization - cleans up user inputs to make sure they are safe
  .use(xss())

  .get('/', (req, res) => {
    res.send(`<h1>Jobs API</h1><a href="/api-docs">Documentation</a>`)
  })

  .use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc))

  .use('/api/v1/jobs', authenticateUser, jobsRouter)
  .use('/api/v1/auth', authRouter)
  
  .use(notFound)
  .use(errorHandler)

const startServer = async() => {
  try{
    await connectDB(process.env.MONGO_URL)
    app.listen(port, () => {
      console.log(`listening @ ${port}`);
    })
  } catch(err) {
    console.log(err);
  }
}

startServer();