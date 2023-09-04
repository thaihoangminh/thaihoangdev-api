// Port
export const PORT = process.env.PORT

// JWT Secret Key
export const JWT_SECRET = process.env.JWT_SECRET as string

// Bcrypt Salt Rounds
export const SALT_ROUNDS = parseInt(process.env.SECURITY_SALT_ROUNDS as string)

export const NODE_ENV = process.env.NODE_ENV as string
