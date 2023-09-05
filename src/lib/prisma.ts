import { PrismaClient } from '@prisma/client'

import { NODE_ENV } from '../config/env'

console.log('NODE_ENV:', NODE_ENV)

// let prisma: PrismaClient
//
// if (NODE_ENV === 'production') {
//   prisma = new PrismaClient()
// } else {
//   if (!global.prisma) {
//     global.prisma = new PrismaClient()
//   }
//   prisma = global.prisma
// }
//
// export { prisma }

const prisma = new PrismaClient()

export { prisma }