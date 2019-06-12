// Top Left
// https://theatremural.officiallondontheatre.com/map-tiles/6/0/0.png

// Top Right
// https://theatremural.officiallondontheatre.com/map-tiles/6/58/0.png

// Bottom Right
// https://theatremural.officiallondontheatre.com/map-tiles/6/58/12.png

const fetch = require('node-fetch')
const blend = require('@mapbox/blend')
const fs = require('fs')
const ProgressBar = require('progress')

const getUrl = (x, y, zoom = 6) => `https://theatremural.officiallondontheatre.com/map-tiles/${zoom}/${x}/${y}.png`

const WIDTH = 58
const HEIGHT = 12
const TILE_SIZE = 512

const mergeImages = (images, options) =>
  new Promise((resolve, reject) => {
    blend(images, options, (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })

const downloadImage = async () => {
  const images = []
  const bar = new ProgressBar('[:bar] :percent :etas', { width: 20, total: (HEIGHT + 1) * (WIDTH + 1) })

  for (let y = 0; y <= HEIGHT; y += 1) {
    for (let x = 0; x <= WIDTH; x += 1) {
      bar.tick()
      const url = getUrl(x, y)
      // eslint-disable-next-line no-await-in-loop
      const imageData = await fetch(url).then(res => res.buffer())
      images.push({
        buffer: imageData,
        x: x * TILE_SIZE,
        y: y * TILE_SIZE,
      })
    }
  }

  const image = await mergeImages(images, { format: 'png' })

  fs.writeFileSync('output.png', image)
}

downloadImage().catch(console.error)
