import type { AnyZodObject } from 'zod'
import type { NextFunction, Request, Response } from 'express'

export const validate =
  <T extends AnyZodObject>(schema: T) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      })
      return next()
    } catch (error) {
      return res.status(400).json(error)
    }
  }
