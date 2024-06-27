import { eq } from "drizzle-orm";
import db from "../Drizzle/db";
import { books, TIbooks, TSbooks } from "../Drizzle/schema"; 

export const booksService = async (limit?: number): Promise<TSbooks[] | null> => {
    if (limit) {
        return await db.query.books.findMany({
            limit: limit
        });
    }
    return await db.query.books.findMany();
}

export const getbooksService = async (id: number): Promise<TIbooks | undefined> => {
    return await db.query.books.findFirst({
        where: eq(books.id, id)
    });
}

export const createbooksService = async (book: TIbooks): Promise<string> => {
    await db.insert(books).values(book);
    return "Book created successfully";
}

export const updatebooksService = async (id: number, book: TIbooks): Promise<string> => {
    await db.update(books).set(book).where(eq(books.id, id));
    return "Book updated successfully";
}

export const deletebooksService = async (id: number): Promise<string> => {
    await db.delete(books).where(eq(books.id, id));
    return "Book deleted successfully";
}
