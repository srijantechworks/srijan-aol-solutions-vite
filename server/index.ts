import express from 'express'
import cors from 'cors'
import 'dotenv/config'

import generateRoute from './routes/generate.ts'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api', generateRoute)

const PORT = 3000

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})