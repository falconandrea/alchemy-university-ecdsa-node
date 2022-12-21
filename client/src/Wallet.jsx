import server from './server'
import * as secp from 'ethereum-cryptography/secp256k1.js'
import { toHex } from 'ethereum-cryptography/utils.js'
import { keccak256 } from 'ethereum-cryptography/keccak.js'

function Wallet ({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {
  async function onChange (evt) {
    // Reset values
    setBalance(0)
    setAddress('')
    const privateKey = evt.target.value
    setPrivateKey(privateKey)

    // Get public key and adress
    const publicKey = secp.getPublicKey(privateKey)
    const hash = keccak256(publicKey.slice(1, publicKey.length))
    const address = `0x${toHex(hash.slice(hash.length - 20))}`
    setAddress(address)

    // Get balance
    if (address) {
      const {
        data: { balance }
      } = await server.get(`balance/${address}`)
      setBalance(balance)
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
