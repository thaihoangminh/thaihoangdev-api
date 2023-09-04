import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import { JWT_SECRET } from '../config/env'

type Req = Request & Record<any, any>
export const authMiddleware = async (req: Req, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) return res.sendStatus(401)

  try {
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch (e) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
}
