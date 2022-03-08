import express from 'express'
import Algorithm from './src'

//express
const app = express()

//start algotithm
Algorithm();

//renderiza html
// app.get('/', function (req, res) {
//     res.sendFile('src/index.html', { root: __dirname })
// })

app.listen(3000)