import { useState } from 'react'
import server from './server'
import { signMessage } from './utils'

function Transfer ({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState('')
  const [recipient, setRecipient] = useState('')

  const setValue = (setter) => (evt) => setter(evt.target.value)

  async function transfer (evt) {
    evt.preventDefault()

    try {
      const payload = {
        amount: parseInt(sendAmount),
        recipient
      }
      const signature = await signMessage(payload, privateKey)
      const {
        data: { balance }
      } = await server.post('send', {
        signature: signature.signature,
        recoveryBit: signature.recoveryBit,
        payload
      })
      setBalance(balance)
    } catch (ex) {
      alert(ex)
    }
  }

  return (
    <form className='container transfer' onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder='1, 2, 3...'
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        />
      </label>

      <label>
        Recipient
        <input
          placeholder='Type an address, for example: 0x2'
          value={recipient}
          onChange={setValue(setRecipient)}
        />
      </label>

      <input type='submit' className='button' value='Transfer' />
    </form>
  )
}

export default Transfer
