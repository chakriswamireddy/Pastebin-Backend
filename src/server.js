// const dotenv = require('dotenv')
const express = require('express')
const cors = require('cors')


const dotenv = require('dotenv');
const { pasteRouter } = require('./routes/Paste');
const app = express();

dotenv.config();


app.use(cors())
app.use(express.json())

app.get('/api/healthz', (req,res) => {
    return res.status(200).json({"ok" :true})
})

app.use('/api', pasteRouter)


app.listen(4000, () => {
    console.log("Listening !!!")
})