import type { NextFunction, Request, Response } from 'express'

import { verifyToken } from '../lib'

type Req = Request & Record<any, any>
export const authMiddleware = async (req: Req, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  try {
    req.user = verifyToken(token)
    next()
  } catch (e) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
}
