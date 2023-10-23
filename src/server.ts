import express from 'express'
import cors from 'cors'
import router from './routes/route'
import path from 'path'

const app = express()

app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors())

app.use('/api', router)

app.listen(30, () => {
    console.log('Example app listening on port 30!')
})
