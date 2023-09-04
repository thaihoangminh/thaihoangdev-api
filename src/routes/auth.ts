import { Request, Response, Router } from 'express'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { validate } from '../utils/validate'
import { prisma } from '../lib'
import { JWT_SECRET, SALT_ROUNDS } from '../config/env'

const router = Router()

const registerSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Not a valid email'),
    password: z.string({
      required_error: 'Password is required',
    }),
  }),
})

export const findUserByEmailOrUsername = async ({
  username,
  email,
}: {
  username?: string
  email?: string
}) => {
  return prisma.user.findFirst({
    where: {
      OR: [
        {
          username,
        },
        {
          email,
        },
      ],
    },
  })
}

const createUser = async (data) => {
  const { username, email, password, firstName, lastName } = data
  return prisma.user.create({
    data: {
      username,
      email,
      password,
      firstName,
      lastName,
    },
  })
}

const userAuthResponse = (user) => {
  const { password, ...userWithoutPwd } = user
  const token = jwt.sign(
    {
      email: user.email,
    },
    JWT_SECRET,
    {
      expiresIn: '2h',
    }
  )

  return {
    token,
    user: userWithoutPwd,
  }
}

const handleRegister = async (req: Request, res: Response) => {
  const { username, email, password } = req.body

  try {
    const existingUser = await findUserByEmailOrUsername({ username, email })

    if (existingUser) {
      return res.status(400).send({ message: 'This email is already registered. Please login.' })
    }

    const passwordHashed = await bcrypt.hash(password, SALT_ROUNDS)

    const user = await createUser({
      ...req.body,
      password: passwordHashed,
    })

    res.send(userAuthResponse(user))
  } catch (error) {
    res.status(500).send('Something went wrong')
  }
}

const handleLogin = async (req: Request, res: Response) => {
  const { email, password, username } = req.body
  try {
    const existingUser = await findUserByEmailOrUsername({ username, email })

    if (!existingUser) {
      return res.status(400).send({ message: 'User not found' })
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)

    if (!isPasswordCorrect) {
      return res.status(400).send({ message: 'Incorrect password' })
    }

    res.send(userAuthResponse(existingUser))
  } catch (error) {
    res.status(500).send('Something went wrong')
  }
}

router.post('/local/register', validate(registerSchema), handleRegister)

router.post('/local/login', handleLogin)

export default router
