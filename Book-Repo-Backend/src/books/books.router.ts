import { Hono } from 'hono';
import { listbooks, getbooks, createbooks, updatebooks, deletebooks } from './books.controller';
import { zValidator } from '@hono/zod-validator';
import { booksSchema } from '../validator';

export const booksRouter = new Hono();

// Get all books 
booksRouter.get('/books', listbooks);

// Get a single book 
booksRouter.get('/books/:id', getbooks);

// Create a book
booksRouter.post(
  '/books',
  zValidator('json', booksSchema, (result, c) => {
    if (!result.success) {
      return c.json(result.error, 400);
    }
  }),
  createbooks
);

// Update a book 
booksRouter.put(
  '/books/:id',
  zValidator('json', booksSchema, (result, c) => {
    if (!result.success) {
      return c.json(result.error, 400);
    }
  }),
  updatebooks
);

// Delete a book 
booksRouter.delete('/books/:id', deletebooks);

export default booksRouter;

