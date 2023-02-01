import {
  Http3Server,
  type WebTransportBidirectionalStream,
} from '@fails-components/webtransport'
import certificate from '../cert.json' assert { type: 'json' }

console.log('Hello world!')

const server = new Http3Server({
  port: 3001,
  host: '127.0.0.1',
  secret: 'notsosecret',
  cert: certificate.cert, // unclear if it is the correct format
  privKey: certificate.private,
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

async function runEchoServer() {
  const sessionStream = server.sessionStream('/echo')
  const sessionReader = sessionStream.getReader()
  while (true) {
    const { done, value } = await sessionReader.read()
    if (done) {
      console.log('[http3] server closed')
      break
    }
    console.log('[http3] got a new session')
    await value.ready
    console.log('[http3] server session is ready')

    try {
      const err = await value.closed
      console.log('[http3] server session was closed', err)
    } catch (error) {
      console.log('[http3] server session close error:', error)
    }

    // Read bidi stream
    const bidiReader =
      value.getReader() as ReadableStreamDefaultReader<WebTransportBidirectionalStream>

    while (true) {
      const bidistr = await bidiReader.read()
      if (bidistr.done) {
        console.log('[webtransport] bidiReader terminated')
        break
      }
      if (bidistr.value) {
        // ok we got a stream
        const bidistream = bidistr.value
        // echo it
        await bidistream.readable.pipeTo(bidistream.writable)
        console.log('[webtransport] bidiReader finished piping')
      }
    }
  }
}

runEchoServer() // don't await, keep it running in background
