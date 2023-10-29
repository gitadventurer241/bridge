from flask_login import UserMixin
from sqlalchemy import text


def init_admin_model(db):
    class Admin(db.Model, UserMixin):
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
        user_id = db.Column(
            db.String(80),
            db.ForeignKey("user.id"),
            nullable=False,
        )
        password = db.Column(db.String(128), nullable=False)
        email = db.Column(db.String(120), unique=True, nullable=False)
        admin_name = db.Column(db.String(80))
        contact_details = db.Column(db.JSON)

        def __init__(
            self,
            user_id,
            password,
            email,
            admin_name,
            contact_details=None,
        ):
            """
            Initialize a new admin object.

            Args:
                # Your additional fields here
            """
            self.user_id = user_id
            self.password = password
            self.email = email
            self.admin_name = admin_name
            self.contact_details = contact_details

        def to_dict(self):
            """
            Convert the company object to a dictionary.
            """
            return {
                "id": self.id,
                "user_id": self.user_id,
                "password": self.password,
                "email": self.email,
                "admin_name": self.admin_name,
                "contact_details": self.contact_details,
            }

    return Admin
