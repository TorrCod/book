"use client";
import Image from "next/image";
import BookList from "./component/Booklist";
import { useEffect, useState } from "react";
import axios from "axios";
import { BookData } from "./types";

export default function Home() {
  const [books, setBooks] = useState<BookData[]>([]);
  const [newBook, setNewBook] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8000/get-books").then(({ data }) => {
      if (data?.error) {
        console.error(data.error);
      } else {
        setBooks(data);
      }
    });
  }, []);

  const addNewBook = () => {
    if (newBook) {
      setNewBook("");
      axios
        .post(
          "http://localhost:8000/add-book",
          { title: newBook, status: "to-read" },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then(({ data }) => {
          setBooks((oldState) => [...oldState, data]);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const handleOnchange = (
    val: "to-read" | "in-progress" | "complete",
    paramsBook: BookData
  ) => {
    const newBooks = (oldState: BookData[]) =>
      oldState.map((_paramsBook) =>
        _paramsBook.title === paramsBook.title
          ? { ...paramsBook, status: val }
          : _paramsBook
      );
    setBooks(newBooks);
    axios
      .put("http://localhost:8000/update-books", newBooks(books), {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleRemove = (arg_book: {
    title: string;
    status: "to-read" | "in-progress" | "complete";
  }) => {
    setBooks((oldState) =>
      oldState.filter(({ title }) => title !== arg_book.title)
    );
    const id = books.filter(({ title }) => title === arg_book.title)[0].id;
    axios.delete(`http://localhost:8000/delete-books?id=${id}`);
  };

  return (
    <div className="container mx-auto py-8 w-full">
      <h1 className="text-3xl font-semibold mb-4">My Book Manager</h1>
      <div className="flex mb-4 gap-2">
        <input
          type="text"
          placeholder="Enter a new book title"
          value={newBook}
          onChange={(e) => setNewBook(e.target.value)}
        />
        <button onClick={addNewBook}>Add Book</button>
      </div>
      <BookList
        onChangeBook={handleOnchange}
        books={books}
        handleRemove={handleRemove}
      />
      {/* Add transitions and other functionality */}
    </div>
  );
}
