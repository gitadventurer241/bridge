from flask_login import UserMixin
from sqlalchemy import text


def init_user_model(db):
    class User(db.Model, UserMixin):
        """
        Postgres table schema
        """

        id = db.Column(
            db.String(80),
            primary_key=True,
            server_default=text("uuid_generate_v4()"),
            unique=True,
            nullable=False,
        )
        password = db.Column(
            db.String(128), nullable=False
        )  # Store the hashed password
        email = db.Column(db.String(120), unique=True, nullable=False)
        user_type = db.Column(db.String(120), unique=False, nullable=False)

        def __init__(self, password, email, user_type):
            """
            Initialize a new user object.

            Args:
                email (str): The user's email address.
                password (str): The user's password (plaintext).
                user_type (str): The user's type (candidate, company, association).
            """
            self.password = password
            self.email = email
            self.user_type = user_type

        def to_dict(self):
            """
            Convert the user object to a dictionary.
            """
            return {
                "id": self.id,
                "password": self.password,
                "email": self.email,
                "user_type": self.user_type,
            }

    return User
