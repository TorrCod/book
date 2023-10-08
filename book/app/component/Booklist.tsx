"use client";
import React from "react";
import { BookData } from "../types";
import { Book } from "./Book";

interface BookListProps {
  books: BookData[];
  onChangeBook: (
    val: "to-read" | "in-progress" | "complete",
    books: BookData
  ) => void;
  handleRemove: (book: {
    title: string;
    status: "to-read" | "in-progress" | "complete";
  }) => void;
}

const BookList: React.FC<BookListProps> = ({
  books,
  onChangeBook,
  handleRemove,
}) => {
  return (
    <div className="flex flex-grow-1 gap-4 w-full">
      <div className="flex flex-1 flex-col gap-4">
        <h2>To Read</h2>
        {books
          .filter(({ status }) => status === "to-read")
          .map((book, index) => (
            <Book
              handleRemove={handleRemove}
              onChangeBook={onChangeBook}
              key={book.title + index}
              book={book}
            />
          ))}
      </div>
      <div className="flex flex-1  flex-col gap-4">
        <h2>In Progress</h2>
        {books
          .filter(({ status }) => status === "in-progress")
          .map((book, index) => (
            <Book
              handleRemove={handleRemove}
              onChangeBook={onChangeBook}
              key={book.title + index}
              book={book}
            />
          ))}
      </div>
      <div className="flex flex-1  flex-col gap-4">
        <h2>Complete</h2>
        {books
          .filter(({ status }) => status === "complete")
          .map((book, index) => (
            <Book
              handleRemove={handleRemove}
              onChangeBook={onChangeBook}
              key={book.title + index}
              book={book}
            />
          ))}
      </div>
    </div>
  );
};

export default BookList;
