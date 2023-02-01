console.log('Hello world!')

const url = 'https://127.0.0.1:3001/echo'
console.log(`[webtransport] Connecting to ${url}`)
const webTransport = new WebTransport(url, {
  algorithm: 'sha-256',
  value: ,
})

async function main() {
  await webTransport.ready
  console.log('[webtransport] Connected')
}

main()
