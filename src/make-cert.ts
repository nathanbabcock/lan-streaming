import { writeFileSync } from 'fs'
import { generateWebTransportCertificate } from './cert.js'

const attrs = [
  { shortName: 'C', value: 'US' },
  { shortName: 'ST', value: 'IL' },
  { shortName: 'L', value: 'Chicago' },
  { shortName: 'O', value: 'Less Than Three LLC' },
  { shortName: 'CN', value: '127.0.0.1' },
]

console.log('Generating...')

const certificate = await generateWebTransportCertificate(attrs, {
  days: 99999,
})

console.log({ certificate })

const path = 'cert.json'
writeFileSync(path, JSON.stringify(certificate, null, 2))

console.log(`Wrote to ${path}`)
