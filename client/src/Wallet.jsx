import server from './server'
import { getAddress } from './utils'

function Wallet ({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {
  async function onChange (evt) {
    // Reset values
    setBalance(0)
    setAddress('')
    const privateKey = evt.target.value
    setPrivateKey(privateKey)

    try {
      // Get public key and adress
      const address = getAddress(privateKey)
      setAddress(address)

      // Get balance
      if (address) {
        const {
          data: { balance }
        } = await server.get(`balance/${address}`)
        setBalance(balance)
      }
    } catch (ex) {
      setBalance(0)
      setAddress('')
    }
  }

  return (
    <div className='container wallet'>
      <h1>Your Wallet</h1>

      <label>
        Your Private Key
        <input
          placeholder='Insert your private key'
          value={privateKey}
          onChange={onChange}
        />
      </label>

      <label>
        Your address
        <input
          placeholder=''
          value={address}
          disabled
        />
      </label>

      <div className='balance'>Balance: {balance}</div>
    </div>
  )
}

export default Wallet
