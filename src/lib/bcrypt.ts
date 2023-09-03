import bcrypt from 'bcrypt'

const saltRounds = 10

export const hashPassword = async (password: string) => {
  try {
    return await bcrypt.hash(password, saltRounds)
  } catch (error) {
    throw error
  }
}

export const comparePassword = async (inputPassword: string, hashedPassword: string) => {
  try {
    return await bcrypt.compare(inputPassword, hashedPassword)
  } catch (error) {
    throw error
  }
}
