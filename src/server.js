// const dotenv = require('dotenv')
const express = require('express')

const dotenv = require('dotenv')
const app = express();

dotenv.config();



app.use(express.json())

app.get('/api/healthz', (req,res) => {
    return res.status(200).json({"ok" :true})
})


app.listen(4000, () => {
    console.log("Listening !!!")
})