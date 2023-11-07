# Our Backend 👩🏾‍💻

Welcome to our backend project! We've built this backend with Flask, and it's organized with blueprints for clear and maintainable routing. We handle authentication using Flask-Login and establish a database connection through SQLAlchemy. Our database instance is hosted on AWS RDS.

## Key Backend Components

### Flask Framework

We've chosen Flask as our framework for its simplicity and flexibility. It provides an excellent foundation for building RESTful APIs and web applications.

### Blueprint Organization

To keep our codebase clean and organized, we use blueprints to structure our routes. Each blueprint is responsible for a specific area of functionality, making it easier to manage and extend the application.

### Authentication with Flask-Login

User authentication is managed through Flask-Login, which simplifies user session management and allows us to protect routes and resources that require authorization.

### AWS RDS as Database

Our data is stored in an AWS RDS (Relational Database Service) instance. This ensures the security, reliability, and scalability of our data storage.

### Main User Table

We maintain all user information in the `user` table. The user's unique ID from this table is used as a reference throughout the application. This ensures a consistent and efficient way to associate data with users.

### Additional Tables

We have several other tables such as `candidate`, `admin`, `company`, and `associations` all of which use the `user_id` as a foreign key to link to the main `user` table. This approach simplifies data management and ensures data integrity.

### Deployment on Render with Docker

Our server is deployed on Render using a Docker file. This allows for easy and efficient deployment, scaling, and management of our application.

<br/>

## Requirements

Before you begin, ensure you have the following requirements installed on your system:

- Python 3.11 or higher
- Docker (optional, for Docker deployment)

<br/>

## Get Started 🚀

To run the backend locally, follow these steps:

1. Clone this repository to your local machine.

```bash
 git clone https://github.com/WomenPlusPlus/deploy-impact-23-shift-4.git
```

2. Navigate to the `server` folder in your project directory.

```bash
cd server
```

3. Create a virtual environment and activate it (optional but recommended).

```bash
python3 -m venv venv
source venv/bin/activate
```

4. Install the required Python packages from the requirements.txt file.

```bash
pip3 install -r requirements.txt
```

5. Make sure you have the .env file in the server root with the define enviroment variables described in the `.env.example`.

6. To run the Flask application locally, use the following command.

```bash
python3 main.py
```

The application will be accessible at http://localhost:5001.

<br/>

## Docker 🐳

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
