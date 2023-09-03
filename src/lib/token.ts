import jwt from 'jsonwebtoken'

const secret = process.env.JWT_SECRET as string

export const signToken = (payload: Record<string, string>) => {
  return jwt.sign(payload, secret, {
    expiresIn: '1d',
  })
}

export const verifyToken = (token: string) => {
  return jwt.verify(token, secret)
}
