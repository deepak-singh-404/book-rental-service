const express = require('express')
const { dbInitialize } = require('./database')
const app = express()

app.use(express.json())
app.use(express.urlencoded({}))

//Routes
app.use('/api', require('./routes'))

const PORT = 5000

app.listen(PORT, async () => {
    await dbInitialize()
    console.log(`SERVR STARTED LISTENING ON PORT: ${PORT}`)
})