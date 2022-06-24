const express = require('express')
const cors = require('cors')
const Redis = require('redis')
const uuid = require('uuid');

const PORT = process.env.PORT || 5000

const client = Redis.createClient({
  port: 6379,
  host: "127.0.0.1"
})
client.connect()

const app = express()

app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

client.on('connect', () => {
  console.log('ok')
})

app.post('/creditCards', async (req, res) => {
  const creditCard = await {...req.body, id: uuid.v4()}
  client.set(creditCard.id, JSON.stringify(creditCard)).then(() => {
    res.json({
      RequestId: creditCard.id,
      Amount: creditCard.amount.value,
    })
  })
  .catch(() => {
    res.sendStatus(404)
  })
})


app.listen(PORT, () => console.log(PORT))
