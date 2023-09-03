import { Request, Response, Router } from 'express'
import { z } from 'zod'
import type { Prisma } from '@prisma/client'

import { validate } from '../utils/validate'
import { comparePassword, hashPassword, signToken, prisma } from '../lib'

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
  username?: Prisma.UserCreateInput['username']
  email?: Prisma.UserCreateInput['email']
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

const createUser = async (data: Prisma.UserCreateInput) => {
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

const handleRegister = async (req: Request, res: Response) => {
  const { username, email, password } = req.body

  try {
    const existingUser = await findUserByEmailOrUsername({ username, email })

    if (existingUser) {
      return res.status(400).send({ message: 'Username or email already exists' })
    }

    const hash = await hashPassword(password)
    const jwt = signToken({
      email,
    })
    const { password: hashPwd, ...user } = await createUser({ ...req.body, password: hash })
    res.send({
      jwt,
      user,
    })
  } catch (error) {
    console.log(error)
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

    const { password: hashPwd, ...userWithoutPwd } = existingUser

    const isPasswordCorrect = await comparePassword(password, existingUser.password)

    if (!isPasswordCorrect) {
      return res.status(400).send({ message: 'Incorrect password' })
    }

    const jwt = signToken({
      email,
    })

    res.send({
      jwt,
      user: userWithoutPwd,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send('Something went wrong')
  }
}

router.post('/local/register', validate(registerSchema), handleRegister)

router.post('/local/login', handleLogin)

export default router
