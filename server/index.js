const express = require('express')
const app = express()
const cors = require('cors')
const port = 3042

app.use(cors())
app.use(express.json())

const { generateWallets, getDataFromSignature, getAddress } = require('./utils')

// Generate wallets
const balances = generateWallets(3)
console.log('Wallets', balances)

app.get('/balance/:address', (req, res) => {
  const { address } = req.params
  const balance = balances[address] || 0
  res.send({ balance: balance.balance })
})

app.post('/send', (req, res) => {
  const { payload, signature, recoveryBit } = req.body

  // Check signature
  const publicKey = getDataFromSignature(payload, signature, recoveryBit)
  const sender = getAddress(publicKey, true)
  const { amount, recipient } = payload

  setInitialBalance(sender)
  setInitialBalance(payload.recipient)

  if (balances[sender].balance < amount) {
    res.status(400).send({ message: 'Not enough funds!' })
  } else {
    balances[sender].balance -= amount
    balances[recipient].balance += amount
    res.send({ balance: balances[sender].balance })
  }
})

app.listen(port, () => {
  console.log(`Listening on port ${port}!`)
})

function setInitialBalance (address) {
  if (!balances[address]) {
    balances[address] = 0
  }
}
