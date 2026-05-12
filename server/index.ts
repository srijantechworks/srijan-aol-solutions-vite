import express from 'express'
import cors from 'cors'
import 'dotenv/config'

import generateRoute from './routes/generate.ts'
import knowledgeRoute from './routes/knowledge.ts' // <-- 1. Import the new route

const app = express()

app.use(cors())
app.use(express.json())

// Existing route
app.use('/api', generateRoute)

// 2. Register the knowledge route
// This makes it accessible at: http://localhost:3000/api/knowledge
app.use('/api/knowledge', knowledgeRoute)

const PORT = 3000

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})