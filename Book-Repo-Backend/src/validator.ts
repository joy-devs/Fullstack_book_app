import {z} from 'zod'
import { books } from './Drizzle/schema'
import { boolean } from 'drizzle-orm/mysql-core'
export const booksSchema = z.object({

  id:z.number(),
  title:z.string(),
  author: z.string(),
  year: z.number(),
})

