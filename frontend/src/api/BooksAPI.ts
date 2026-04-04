import type { book } from '../types/book';

const BASE_URL =
  'https://bookstore-project-backend-pratte-dtf6g2c2a2dza5bu.francecentral-01.azurewebsites.net/api/Bookstore';

interface FetchBooksResponse {
  books: book[];
  totalNumBooks: number;
}

export const fetchBooks = async (
  pageSize: number,
  pageNum: number,
  selectedCategories: string[],
  sortOrder: string
): Promise<FetchBooksResponse> => {
  const categoryParams = selectedCategories
    .map((cat) => `bookCategories=${encodeURIComponent(cat)}`)
    .join('&');

  const response = await fetch(
    `${BASE_URL}/AllBooks?pageSize=${pageSize}&pageNum=${pageNum}&sortOrder=${sortOrder}${
      selectedCategories.length > 0 ? `&${categoryParams}` : ''
    }`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch books');
  }

  return response.json();
};

export const fetchBookCategories = async (): Promise<string[]> => {
  const response = await fetch(`${BASE_URL}/GetBookCategories`);
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  return response.json();
};

export const addBook = async (newBook: book): Promise<book> => {
  const response = await fetch(`${BASE_URL}/AddBook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newBook),
  });

  if (!response.ok) {
    throw new Error('Failed to add book');
  }

  return response.json();
};

export const updateBook = async (
  bookId: number,
  updatedBook: book
): Promise<book> => {
  const response = await fetch(`${BASE_URL}/UpdateBook/${bookId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedBook),
  });

  if (!response.ok) {
    throw new Error('Failed to update book');
  }

  return response.json();
};

export const deleteBook = async (bookId: number): Promise<void> => {
  const response = await fetch(`${BASE_URL}/DeleteBook/${bookId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete book');
  }
};
