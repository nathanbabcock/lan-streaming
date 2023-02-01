import { Http3Server } from '@fails-components/webtransport'
import { readFileSync } from 'node:fs'

console.log('Hello world!')

const cert = readFileSync('cert/localhost.pem', 'utf8')
const privKey = readFileSync('cert/localhost-key.pem', 'utf8')

const server = new Http3Server({
  port: 3001,
  host: '127.0.0.1',
  secret: '',
  cert, // unclear if it is the correct format
  privKey,
})

server.startServer()
await server.ready

const address = server.address()
if (!address) {
  console.error('[http3] failed to get address for server')
  process.exit(1)
}

const url = `https://${address.host}:${address.port}`
console.log(`[http3] server running at ${url}`)
