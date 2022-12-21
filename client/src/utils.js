import * as secp from 'ethereum-cryptography/secp256k1.js'
import { toHex, utf8ToBytes } from 'ethereum-cryptography/utils.js'
import { keccak256 } from 'ethereum-cryptography/keccak.js'

export const getAddress = (privateKey) => {
  const publicKey = secp.getPublicKey(privateKey)
  const hash = keccak256(publicKey.slice(1, publicKey.length))
  return `0x${toHex(hash.slice(hash.length - 20))}`
}

const hashMessage = (data) => {
  return keccak256(utf8ToBytes(JSON.stringify(data)))
}

export const signMessage = async (message, privateKey) => {
  const [signature, recoveryBit] = await secp.sign(hashMessage(message), privateKey, { recovered: true })
  return {
    signature: toHex(signature),
    recoveryBit
  }
}
