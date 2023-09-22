import express from 'express'
import cors from 'cors'
import { Request, Response } from 'express'
import router from './routes/routes'

const app = express()

app.use(express.json())
app.use(cors())

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!')
})

app.use('/api', router)

app.listen(30, () => {
    console.log('Example app listening on port 30!')
})