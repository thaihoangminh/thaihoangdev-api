import { Router } from 'express'

import { prisma } from '../lib'
import { authMiddleware } from '../middleware/auth-middleware'
import { findUserByEmailOrUsername } from './auth'

const router = Router()

router.get('/', authMiddleware, async (req, res) => {
  try {
    const users = await prisma.user.findMany()
    res.json(users)
  } catch (e) {
    res.status(500).json({ error: 'Unable to fetch users' })
  }
})

router.get('/me', authMiddleware, async (req, res) => {
  const { email } = req['user']
  try {
    const existingUser = await findUserByEmailOrUsername({ email })

    if (!existingUser) {
      return res.status(400).send({ message: 'User not found' })
    }

    const { password: hashPwd, ...userWithoutPwd } = existingUser

    res.json(userWithoutPwd)
  } catch (e) {
    res.status(500).json({ error: 'Unable to fetch users' })
  }
})

export default router
