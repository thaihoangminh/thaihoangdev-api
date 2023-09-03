import express from 'express'

import auth from './routes/auth'
import user from './routes/user'

const app = express()

const port = 3000

app.use(express.json())

app.use('/auth', auth)
app.use('/api/users', user)

app.listen(port, () => console.log(`🚀 Server ready at: http://localhost:${port}`))
export { validate } from './utils/validate'
