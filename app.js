require('dotenv').config()
const express = require('express')
const helmet = require('helmet') // creates headers that protect from attacks (security)
const cors = require('cors')  // allows/disallows cross-site communication
const morgan = require('morgan') // logs requests
const jwt = require('jwt-simple')

const app = express()

//App Middleware for controlling DB Access, only allows port 3000 on localhost
const whitelist = ['http://localhost:3000']
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
          callback(null, true)
        } else {
          callback(new Error('Not allowed by CORS'))
        }
    }
}

app.use(helmet())  // modifies headers to prevent attacks
// app.use(cors(corsOptions))  // access control by requesting page
app.use(cors())  // access control by requesting page
app.use(morgan('combined')) // use 'tiny' or 'combined'

const PORT = process.env.PORT || 3001

app.use(require('./routes/authentication'))

app.get('/hello', (req, res) => {
    res.send('Hello')
})

app.use(require('./routes/contacts'))
app.use(require('./routes/drafts'))
app.use(require('./routes/sent'))

app.listen(PORT || 3001, () => {
    console.log(`listening on port: ${PORT}`)
})