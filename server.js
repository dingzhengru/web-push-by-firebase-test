import express from 'express'
import cors from 'cors'
import path from 'path'
import axios from 'axios'
import asyncHandler from 'express-async-handler'
import { getAccessToken, pushMessage } from './jwt-test.js'

const port = 50005

const app = express()

app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(express.json()) // for parsing application/json

// app.use(cors(corsOptions))
app.use(cors())

// app.use(express.static(path.join(__dirname, 'dist')))

app.use(express.static('.'))

app.post('/push-message', asyncHandler(async (req, res, next) => {
  /* 
    POST https://fcm.googleapis.com/v1/projects/myproject-b5ae1/messages:send 

    Content-Type: application/json
    Authorization: Bearer [Token]
  */

  const userToken = req.body.token
  const accessToken = await getAccessToken()
  const result = await pushMessage(userToken, accessToken)

  res.send(result.data)
}))

app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.listen(port, () => {
    console.log(`listening on ${ port }`)
})