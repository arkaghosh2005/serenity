//SERVER
const express = require('express')
const cors = require('cors')
const PORT=5000

const app = express()
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/api/journal', require('./routes/journal'))
app.use('/api/companion', require('./routes/companion'))
app.get('/api', (req, res) => {
  res.send("Here!")
})

app.listen(PORT, () => console.log('Server running on http://localhost:5000'))
