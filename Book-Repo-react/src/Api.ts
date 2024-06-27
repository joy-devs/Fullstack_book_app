// Api.ts
interface Book{
    id:number;
    title:string;
    author:string;
    year:number;
}



export const fetchBooks = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/books'); // Adjust URL as per your backend
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching books:', error);
      throw error; // Propagate the error back to the caller
    }
  };
  
  export const addBook = async (newBook: Book) => {
    try {
      const response = await fetch('http://localhost:3000/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newBook)
      });
  
      if (!response.ok) {
        throw new Error('Failed to add book');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error adding book:', error);
      throw error;
    }
  };
  
  export const updateBook = async (updatedBook: Book) => {
    try {
      const response = await fetch(`http://localhost:3000/api/books/${updatedBook.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedBook)
      });
  
      if (!response.ok) {
        throw new Error('Failed to update book');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error updating book:', error);
      throw error;
    }
  };
  
  export const deleteBook = async (bookId: number) => {
    try {
      const response = await fetch(`http://localhost:3000/api/books/${bookId}`, {
        method: 'DELETE'
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete book');
      }
  
      return true; // Return true if deletion was successful
    } catch (error) {
      console.error('Error deleting book:', error);
      throw error;
    }
  };
  