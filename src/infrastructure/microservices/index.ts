import express from 'express'
const app = express()
const port = 8080

app.post('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})