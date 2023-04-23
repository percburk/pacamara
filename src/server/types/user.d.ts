import { Express } from 'express'

declare global {
  namespace Express {
    interface User {
      id: number
      username: string
      profilePic?: string
      methodsDefaultId?: number
      kettle?: string
      grinder?: string
      tdsMin?: number
      tdsMax?: number
      extMin?: number
      extMax?: number
      name?: string
      methodsDefaultLrr?: number
    }
  }
}
