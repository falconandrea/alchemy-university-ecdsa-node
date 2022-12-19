const secp = require('ethereum-cryptography/secp256k1.js')
const { toHex } = require('ethereum-cryptography/utils.js')
const { keccak256 } = require('ethereum-cryptography/keccak.js')

const getAddress = (publicKey) => {
  const firstRemoved = publicKey.slice(1, publicKey.length)
  const hash = keccak256(firstRemoved)
  return hash.slice(hash.length - 20)
}

const generateRandomAddress = () => {
  const privateKey = secp.utils.randomPrivateKey()
  const publicKey = secp.getPublicKey(privateKey)
  const address = getAddress(publicKey)
  return { privateKey: toHex(privateKey), publicKey: toHex(publicKey), address: `0x${toHex(address)}` }
}

const generateWallets = (count) => {
  const wallets = []
  for (let i = 0; i < 3; i++) {
    const wallet = generateRandomAddress()
    wallet.balance = Math.round(Math.random() * 100)
    wallets[wallet.address] = wallet
  }
  return wallets
}

module.exports = {
  generateWallets,
  getAddress
}
