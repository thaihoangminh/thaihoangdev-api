import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const users = [
  {
    email: 'hello@thaihoang.dev',
    username: 'thai.hoang',
    password: '123456',
    firstName: 'Thai',
    lastName: 'Hoang',
    posts: {
      create: { title: 'Hello World', published: true },
    },
    profile: {
      create: { bio: 'I like turtles' },
    },
  },
  {
    email: 'lam.pham@gmail.com',
    username: 'lam.pham',
    password: '123456',
    firstName: 'Lam',
    lastName: 'Phan',
    posts: {
      create: { title: 'Hello World 2', published: true },
    },
    profile: {
      create: { bio: 'I like sushi' },
    },
  },
]

async function main() {
  console.log(`Start seeding ...`)
  for (const u of users) {
    const user = await prisma.user.create({
      data: u,
    })
    console.log(`Created user with id: ${user.id}`)
  }

  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
