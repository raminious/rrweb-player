const fs = require('fs')

const concat = (x, y) => x.concat(y)
const flatMap = (f, xs) => xs.map(f).reduce(concat, [])

if (Array.prototype.flatMap === undefined) {
  Array.prototype.flatMap = function(f) {
    return flatMap(f, this)
  }
}
const content = fs.readFileSync('./response.txt').toString()
const json = JSON.parse(content)

const events = json.data.EventMany.flatMap((item) => {
  return item.events.map((event) => event)
})

fs.writeFile('./response.js', JSON.stringify(events), () => {})