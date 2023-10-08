from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import psycopg2
from typing import List
import os
from dotenv import load_dotenv

load_dotenv()

# Use os.environ to access the DATABASE_URL environment variable
db_url = os.environ.get("DATABASE_URL")

print(db_url)

# Check if the environment variable is set
if db_url is None:
    raise Exception("DATABASE_URL environment variable is not set")

conn = psycopg2.connect(db_url)

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Book(BaseModel):
    title: str
    status: str

@app.get("/ping")
async def root():
    return {"message": "pong"}

@app.get("/get-books/")
async def get_books():
    cursor = conn.cursor()
    select_query = "SELECT * FROM books;"
    
    try:
        cursor.execute(select_query)
        books = cursor.fetchall()
        cursor.close()
        
        # Create a list of dictionaries representing all books
        book_list = []
        for book in books:
            book_dict = {
                "id": book[0],
                "title": book[1],
                "status": book[2],
            }
            book_list.append(book_dict)
        
        return book_list
    except Exception as e:
        conn.rollback()  # Rollback the transaction in case of an error
        return {"error": str(e)}

@app.post("/add-book/")
async def add_book(book: Book):
    # Create a cursor object to interact with the database
    cursor = conn.cursor()

    # SQL statement to insert the book into the database
    insert_query = "INSERT INTO books (title, status) VALUES (%s, %s) RETURNING id, title, status"

    print(book)
    try:
        # Execute the SQL statement with the book data and fetch the inserted row
        cursor.execute(insert_query, (book.title, book.status))
        inserted_book = cursor.fetchone()

        # Commit the transaction to save the changes to the database
        conn.commit()

        # Close the cursor
        cursor.close()

        if inserted_book:
            # Convert the inserted_book tuple to a dictionary for a clean response
            book_dict = {
                "id": inserted_book[0],
                "title": inserted_book[1],
                "status": inserted_book[2]
            }
            return book_dict
        else:
            return {"error": "Failed to fetch the inserted book data"}

    except Exception as e:
        conn.rollback()  # Rollback the transaction in case of an error
        return {"error": str(e)}

@app.delete("/delete-books/")
async def remove_book(id: int):
    # Create a cursor object to interact with the database
    cursor = conn.cursor()

    try:
        # Define a SQL query to remove a book based on its ID
        query = "DELETE FROM books WHERE id = %s"
        cursor.execute(query, (id,))
        conn.commit()

        # Check if any rows were affected by the DELETE operation
        if cursor.rowcount == 1:
            return {"message": f"Book with ID {id} removed successfully"}
        else:
            return {"error": f"Book with ID {id} not found"}

    except Exception as e:
        # Handle any errors that may occur during the database operation
        conn.rollback()
        return {"error": str(e)}
    finally:
        # Close the cursor to release resources
        cursor.close()

@app.put("/update-books/")
async def update_books(books: List[Book]):
    # Create a cursor object to interact with the database
    cursor = conn.cursor()

    try:
        # Loop through the list of books and update each one in the database
        for book in books:
            # SQL statement to update a book based on its title
            update_query = "UPDATE books SET status = %s WHERE title = %s"
            
            # Execute the SQL statement with the book data
            cursor.execute(update_query, (book.status, book.title))
        
        # Commit the transaction to save the changes to the database
        conn.commit()

        # Close the cursor
        cursor.close()

        return {"message": "Books updated successfully"}
    except Exception as e:
        conn.rollback()  # Rollback the transaction in case of an error
        return {"error": str(e)}