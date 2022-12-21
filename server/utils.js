const secp = require('ethereum-cryptography/secp256k1.js')
const { toHex, utf8ToBytes } = require('ethereum-cryptography/utils.js')
const { keccak256 } = require('ethereum-cryptography/keccak.js')

const getAddress = (publicKey, hex = false) => {
  const firstRemoved = publicKey.slice(1, publicKey.length)
  const hash = keccak256(firstRemoved)
  return hex ? `0x${toHex(hash.slice(hash.length - 20))}` : hash.slice(hash.length - 20)
}

const generateRandomAddress = () => {
  const privateKey = secp.utils.randomPrivateKey()
  const publicKey = secp.getPublicKey(privateKey)
  const address = getAddress(publicKey, true)
  return { privateKey: toHex(privateKey), publicKey: toHex(publicKey), address }
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

const hashMessage = (data) => {
  return keccak256(utf8ToBytes(JSON.stringify(data)))
}

const getDataFromSignature = (payload, signature, recoveryBit) => {
  const publicKey = secp.recoverPublicKey(hashMessage(payload), signature, recoveryBit)
  return publicKey
}

module.exports = {
  generateWallets,
  getAddress,
  getDataFromSignature
}
