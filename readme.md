## Book Manager

### How to Run

To get started with the Book Manager application, follow these steps:

**Step 1: Build the Database Container**

Before running the application, you'll need to build the database container. To do this, use the following command:

```bash
docker-compose -f db.yml up --build
```

This command will initialize and build the PostgreSQL database container for the Book Manager.

**Step 2: Build and Start the Application**

Once the database container is up and running, you can proceed to build and start the application. Run the following command:

```bash
docker-compose -f app.yml up --build
```

This command will build and start the Book Manager application container.

Your Book Manager application is now up and running, and you can access it through the specified ports and endpoints.
