# Flask API README

This is a Flask API for user registration, login, and authentication. It includes user registration, login, authentication, and some protected routes. This README provides an overview of the application and instructions on how to run it using Docker.

## Table of Contents

- [Application Overview](#application-overview)
- [Requirements](#requirements)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Docker](#docker)

## Application Overview

### Dependencies

This Flask application utilizes the following dependencies:

- Flask for building the API.
- Flask-CORS for Cross-Origin Resource Sharing configuration.
- Flask-SQLAlchemy for database interaction.
- Flask-Login for user session management.
- Passlib for password hashing.
- Python-dotenv for environment variable management.

### Functionality

This Flask API provides the following functionality:

- User registration with username, password, email, and user type (candidate or company).
- User authentication and login.
- User session management using Flask-Login.
- Authentication middleware for protecting routes.
- User data stored in a PostgreSQL database.

## Requirements

Before you begin, ensure you have the following requirements installed on your system:

- Python 3.11 or higher
- Docker (optional, for Docker deployment)

## Installation

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/your-username/your-repo.git
   ```

2. Navigate to the project directory:

```bash
cd your-repo
```

3. Create a virtual environment and activate it (optional but recommended):

```bash
python -m venv venv
source venv/bin/activate
```

4. Install the required Python packages from the requirements.txt file:

```bash
pip install -r requirements.txt
```

5. Create a .env file in the project root and define the following environment variables:

- **DATABASE_URI_TEST:** The URI for your PostgreSQL database.
- **SECRET_KEY:** A secret key for session management and security.

Example .env file:

```plaintext
DATABASE_URI_TEST=postgresql://your-db-user:your-db-password@localhost/your-db-name
SECRET_KEY=your-secret-key
```

## Running the Application

To run the Flask application locally, use the following command:

```bash
python3 main.py
```

The application will be accessible at http://localhost:5001.

## API Endpoints

### User Registration

- **Endpoint**: `/api/register`
- **Method**: POST
- **Description**: Register a new user.
- **Request JSON Body**:
  - `username` (str): The username for the new user.
  - `password` (str): The password for the new user (will be hashed).
  - `email` (str): The email address of the new user.
  - `user_type` (str): The type of user (e.g., "candidate" or "company").

### User Login

- **Endpoint**: `/api/login`
- **Method**: POST
- **Description**: Authenticate and log in a user.
- **Request JSON Body**:
  - `username` (str): The username of the user trying to log in.
  - `password` (str): The password provided by the user.

### User Logout

- **Endpoint**: `/api/logout`
- **Method**: GET
- **Description**: Log out the currently authenticated user.

### Protected Route

- **Endpoint**: `/api/protected`
- **Method**: GET
- **Description**: A protected route that requires authentication.

### User Deletion (Admin)

- **Endpoint**: `/api/delete_user`
- **Method**: POST
- **Description**: Delete a user by username (Admin only).

## Docker

To run the application using Docker, follow these steps:

1. Build the Docker image (from the project directory where your Dockerfile is located):

```bash
docker build -t your-image-name .
```

Run the Docker container, mapping host port 5001 to container port 5001 (or specify the desired port if needed):

```bash
docker run -p 5001:5001 your-image-name
```

The Flask API will be accessible at http://localhost:5001.
