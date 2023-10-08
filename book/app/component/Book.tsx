"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectProps } from "@radix-ui/react-select";
import { BookData } from "../types";
import { useState } from "react";
interface BookProps {
  book: BookData;
  onChangeBook: (
    val: "to-read" | "in-progress" | "complete",
    books: BookData
  ) => void;
  handleRemove: (book: BookData) => void;
}

export const Book: React.FC<BookProps> = ({
  book,
  onChangeBook,
  handleRemove,
}) => {
  const handleOnchange: SelectProps["onValueChange"] = (
    value: "to-read" | "in-progress" | "complete"
  ) => {
    onChangeBook(value, book);
  };
  return (
    <div className="grid grid-cols-[2fr,1fr,1fr] gap-4 items-center">
      {/* Add buttons for transitioning, moving, and deleting books */}
      <div className="bg-white p-2 rounded shadow grid">
        <h3>{book.title}</h3>
      </div>
      <div>
        <Select onValueChange={handleOnchange}>
          <SelectTrigger>
            <SelectValue placeholder={parseStatus(book.status)} />
          </SelectTrigger>
          <SelectContent defaultValue={book.status}>
            <SelectItem value="to-read">To Read</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="complete">Complete</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid items-center justify-center">
        <button onClick={() => handleRemove(book)}>Remove</button>
      </div>
    </div>
  );
};

const parseStatus = (status: Status) => {
  switch (status) {
    case "complete":
      return "Complete";
    case "in-progress":
      return "In Progress";
    default:
      return "To Read";
  }
};

type Status = "to-read" | "in-progress" | "complete";
