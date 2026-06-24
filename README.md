# WebApp_Sport_App
### Final Exam Project - Web Application Programming

A Sports Web Application designed to manage amateur tournaments and allow users to book sport fields. The project features a complete client-server architecture:

- **Front-end:** A React application for the user interface
- **Back-end:** A Node.js/Express server that handles data storage, authentication, and API logic
- **OSS**: development of the back-end and front-end was done using Cors to work on two separated servers. This was done in order to restart only a server when changes were done. The complete project here presented doesn't Cors and simply serves the front-end to the back-end. 
- 

---

## Docker Architecture

The project uses Docker for easy deployment. It runs on two synchronized containers:

| Container | Description |
|-----------|-------------|
| **App Container** | Runs the Node.js back-end (which also serves the React front-end) |
| **Mongo Container** | Runs MongoDB to store all application data |

---

## How to Run the Project

### Prerequisites
Make sure **Docker Desktop** is installed and running in the background.

### Step-by-Step Instructions

1. Clone this repository to your computer
2. Open your terminal inside the project folder
3. Run the following command to build and start the application:

    ```bash
    docker-compose up --build
    ```

4. Wait a little
6. Open your browser and visit [http://localhost:5000](http://localhost:5000)

---

## Database & Demo Data

The project includes an automatic **Database Initializer**.

When you run `docker-compose up` for the first time, the application will automatically build the database structure and populate it with demo data — including users, tournaments, teams, fields, bookings, and matches.

> **To reset the database** to its original demo state, simply delete the `data` folder and restart Docker.
