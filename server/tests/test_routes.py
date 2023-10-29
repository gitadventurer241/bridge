import unittest
from flask import Flask
import sys, os
sys.path.append(os.path.abspath(__file__).split("tests")[0])
from main import app, db, User, Candidate, Company
from dotenv import load_dotenv

load_dotenv()
import os

class TestApp(unittest.TestCase):

    def setUp(self):
        """
        Set up a testing environment.
        """
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get("DATABASE_URI_TEST")  # Use an SQLite in-memory database for testing
        self.app = app.test_client()
        db.create_all()


    def test_register_route(self):
        """
        Test the registration route.
        """
        # Send a POST request to the registration route with valid data
        data = {
            "username": "testuser1",
            "password": "testpassword",
            "email": "test1@example.com",
            "user_type": "candidate"
        }
        response = self.app.post('/register', json=data)

        # Check if the response status code is 200 OK
        self.assertEqual(response.status_code, 200)

        # Check if the response message indicates successful registration
        self.assertIn(b"User registered successfully", response.data)

        # Check if the user is saved in the database
        user = User.query.filter_by(username="testuser").first()
        self.assertIsNotNone(user)
        self.assertEqual(user.user_type, "candidate")

    def test_find_user_route(self):
        """
        Test the find_user route.
        """
        # Send a POST request to the find_user route with the test user's username
        data = {"username": "testuser1"}
        response = self.app.post('/find_user', json=data)

        # Check if the response status code is 200 OK
        self.assertEqual(response.status_code, 200)

        # Check if the response contains the correct user type
        self.assertIn(b'{"user":"candidate"}', response.data)

    def test_login_route(self):
        """
        Test the login route.
        """
        # Send a POST request to the login route with valid login credentials
        data = {"username": "testuser1", "password": "testpassword"}
        response = self.app.post('/login', json=data)

        # Check if the response status code is 200 OK
        self.assertEqual(response.status_code, 200)

        # Check if the response message indicates successful login
        self.assertIn(b"Login successful", response.data)

if __name__ == '__main__':
    # If you want to run only the test_register_route method:
    # unittest.main(argv=[''], testRunner=None, testLoader=unittest.TestLoader(), defaultTest='TestApp.test_register_route')

    # If you want to run only the test_find_user_route method:
    # unittest.main(argv=[''], testRunner=None, testLoader=unittest.TestLoader(), defaultTest='TestApp.test_find_user_route')

    # If you want to run only the test_login_route method:
    unittest.main(argv=[''], testRunner=None, testLoader=unittest.TestLoader(), defaultTest='TestApp.test_login_route')