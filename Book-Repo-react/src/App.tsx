// App.tsx
import React, { useReducer, useRef, useState, useCallback, useEffect } from 'react';
import useLocalStorage from './hooks';
import './App.css';
import { fetchBooks, addBook, updateBook, deleteBook } from './Api';

interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
}

interface State {
  books: Book[];
  currentPage: number;
}

type Action =
  | { type: 'SET_BOOKS'; payload: Book[] }
  | { type: 'ADD_BOOK'; payload: Book }
  | { type: 'UPDATE_BOOK'; payload: Book }
  | { type: 'DELETE_BOOK'; payload: number }
  | { type: 'SET_PAGE'; payload: number };

const initialState: State = {
  books: [],
  currentPage: 1
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_BOOKS':
      return { ...state, books: action.payload };
    case 'ADD_BOOK':
      return { ...state, books: [...state.books, action.payload] };
    case 'UPDATE_BOOK':
      return {
        ...state,
        books: state.books.map(book =>
          book.id === action.payload.id ? action.payload : book
        )
      };
    case 'DELETE_BOOK':
      return { ...state, books: state.books.filter(book => book.id !== action.payload) };
    case 'SET_PAGE':
      return { ...state, currentPage: action.payload };
    default:
      return state;
  }
}

const App: React.FC = () => {
  const [storedBooks, setStoredBooks] = useLocalStorage<Book[]>('books', []);
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    books: storedBooks
  });
  const [searchQuery, setSearchQuery] = useState('');
  const titleRef = useRef<HTMLInputElement>(null);
  const authorRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);
  const booksPerPage = 5;

  useEffect(() => {
    dispatch({ type: 'SET_BOOKS', payload: storedBooks });
  }, [storedBooks]);

  useEffect(() => {
    if (JSON.stringify(state.books) !== JSON.stringify(storedBooks)) {
      setStoredBooks(state.books);
    }
  }, [state.books, storedBooks, setStoredBooks]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchBooks();
        dispatch({ type: 'SET_BOOKS', payload: data });
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };
    fetchData();
  }, []);

  const handleAddBook = useCallback(async () => {
    if (titleRef.current && authorRef.current && yearRef.current) {
      const newBook: Book = {
        id: Date.now(),
        title: titleRef.current.value,
        author: authorRef.current.value,
        year: parseInt(yearRef.current.value, 10)
      };

      try {
        const addedBook = await addBook(newBook);
        dispatch({ type: 'ADD_BOOK', payload: addedBook });

        titleRef.current.value = '';
        authorRef.current.value = '';
        yearRef.current.value = '';
      } catch (error) {
        console.error('Error adding book:', error);
      }
    }
  }, []);

  const handleUpdateBook = useCallback(async (updatedBook: Book) => {
    try {
      const updated = await updateBook(updatedBook);
      if (updated) {
        dispatch({ type: 'UPDATE_BOOK', payload: updatedBook });
      }
    } catch (error) {
      console.error('Error updating book:', error);
    }
  }, []);

  const handleDeleteBook = useCallback(async (bookId: number) => {
    try {
      const deleted = await deleteBook(bookId);
      if (deleted) {
        dispatch({ type: 'DELETE_BOOK', payload: bookId });
      }
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  }, []);

  const handlePageChange = useCallback((page: number) => {
    dispatch({ type: 'SET_PAGE', payload: page });
  }, []);

  const filteredBooks = state.books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastBook = state.currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const paginatedBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  return (
    <div className="container">
      <h1>Book Repository</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddBook();
        }}
        className="form"
      >
        <div className='input'>
          <input type="text" placeholder="Title" ref={titleRef} required />
          <input type="text" placeholder="Author" ref={authorRef} required />
          <input type="number" placeholder="Publication Year" ref={yearRef} required />
        </div>
        <button className='btn' type="submit">Add Book</button>
      </form>
      <input 
        type="text"
        placeholder="Search by title..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Year</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedBooks.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.year}</td>
              <td>
                <button className='btn2'
                  onClick={() => {
                    const updatedTitle = prompt('Enter new title:', book.title);
                    if (updatedTitle) {
                      const updatedBook = { ...book, title: updatedTitle };
                      handleUpdateBook(updatedBook);
                    }
                  }}
                >
                  Edit
                </button>
                <button className='btn3'
                 onClick={() => 
                 handleDeleteBook(book.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button
          onClick={() => handlePageChange(state.currentPage - 1)}
          disabled={state.currentPage === 1}
        >
          Previous
        </button>
        <span>
          {state.currentPage} / {Math.ceil(filteredBooks.length / booksPerPage)}
        </span>
        <button
          onClick={() => handlePageChange(state.currentPage + 1)}
          disabled={state.currentPage === Math.ceil(filteredBooks.length / booksPerPage)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default App;