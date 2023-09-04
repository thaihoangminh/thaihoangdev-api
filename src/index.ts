import express from 'express'
import compression from 'compression'
import { rateLimit } from 'express-rate-limit'
import path from 'path'

import auth from './routes/auth'
import user from './routes/user'
import { PORT } from './config/env'

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
});

const app = express()

app.use(compression())

app.use(limiter);

app.use(express.static(path.join(__dirname, '../public')))

app.use(express.json())

app.use('/auth', auth)
app.use('/api/users', user)

app.listen(PORT, () => console.log(`🚀 Server ready at: http://localhost:${PORT}`))
