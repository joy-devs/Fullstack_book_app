
import { Context } from 'hono';
import {booksService, getbooksService, createbooksService, updatebooksService, deletebooksService } from './books.services';

// List all books
export const listbooks = async (c: Context): Promise<Response> => {
  const books = await booksService();
  return c.json(books);
};

// Get a single book by ID
export const getbooks = async (c: Context): Promise<Response> => {
  const id = Number(c.req.param('id'));
  const book = await getbooksService(id);
  if (book) {
    return c.json(book);
  }
  return c.json({ message: 'Book not found' }, 404);
};

// Create a new book
export const createbooks = async (c: Context): Promise<Response> => {
  const bookData = await c.req.json();
  const book = await createbooksService(bookData);
  return c.json(book, 201);
};

// Update a book
export const updatebooks = async (c: Context): Promise<Response> => {
  const id = Number(c.req.param('id'));
  const bookData = await c.req.json();
  const message = await updatebooksService(id, bookData);
  return c.json({ message });
};

// Delete a book
export const deletebooks = async (c: Context): Promise<Response> => {
  const id = Number(c.req.param('id'));
  const message = await deletebooksService(id);
  return c.json({ message });
};
