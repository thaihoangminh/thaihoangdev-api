import { PrismaClient } from '@prisma/client'

import { NODE_ENV } from '../config/env'

let prisma: PrismaClient

if (NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient()
  }
  prisma = global.prisma
}

export { prisma }
