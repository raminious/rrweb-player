const fetch = require('node-fetch')
const fs = require('fs')

const concat = (x, y) => x.concat(y)
const flatMap = (f, xs) => xs.map(f).reduce(concat, [])

if (Array.prototype.flatMap === undefined) {
  Array.prototype.flatMap = function(f) {
    return flatMap(f, this)
  }
}

async function main() {
  const response = await fetch('http://localhost:8089/api', {
    method: 'post',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      operationName: 'GetSessionEvents',
      query: "query GetSessionEvents($session: MongoID!) {EventMany(filter: {session: $session}, sort: _ID_ASC) {_id    events    __typename  }}",
      variables: {
        session: "5f39a33c7fdaf7623c490ff2"
      }
    })
  })

  const json = await response.json()

  const events = json.data.EventMany.slice(0, 6).flatMap((item) => {
    return item.events.map((event) => event)
  })

  const content = 'export default ' + JSON.stringify(events)
  fs.writeFile('./src/response.js', content, () => {})
}

main()