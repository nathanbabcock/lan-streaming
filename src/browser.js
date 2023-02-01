console.log('Hello world!')

async function main() {
  // Hardcoded; fix CORS to get this from local server

  const hash = new Uint8Array([
    108, 9, 14, 111, 70, 49, 150, 149, 152, 116, 254, 232, 119, 227, 120, 86,
    118, 141, 149, 68, 132, 11, 251, 248, 238, 46, 52, 93, 72, 244, 163, 99
  ]).buffer

  console.log(hash.byteLength)

  const url = 'https://127.0.0.1:3001/echo'
  console.log(`[webtransport] Connecting to ${url}`)
  const webTransport = new WebTransport(url, {
    algorithm: 'sha-256',
    value: hash,
  })

  await webTransport.ready
  console.log('[webtransport] Connected')
}

main()
