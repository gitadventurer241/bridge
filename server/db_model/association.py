from flask_login import UserMixin
from sqlalchemy import text

def init_association_model(db):
    class Association(db.Model, UserMixin):
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
        association_name = db.Column(db.String(80))
        logo = db.Column(db.String(256))
        address = db.Column(db.String(256))
        url = db.Column(db.String(256))  # URL to associations page as a string
        contact_details = db.Column(db.JSON)
        description = db.Column(db.String(1000))
        iniciatives = db.Column(
            db.JSON
        )  # Iniciatives as a JSON object of iniciatives ids
        invites = db.Column(db.JSON)  # Information about invites
        requests = db.Column(db.JSON) # Requests for initiatives
        size = db.Column(db.String(80))

        def __init__(
            self,
            user_id,
            password,
            email,
            association_name,
            logo=None,
            address=None,
            url=None,
            contact_details=None,
            description=None,
            iniciatives=None,
            invites=None,
            requests=None,
            size=None,
        ):
            """
            Initialize a new association object.

            Args:
                # Your additional fields here
            """
            self.user_id = user_id
            self.password = password
            self.email = email
            self.association_name = association_name
            self.logo = logo
            self.address = address
            self.url = url
            self.contact_details = contact_details
            self.description = description
            self.iniciatives = iniciatives
            self.invites = invites
            self.requests = requests
            self.size = size

        def to_dict(self):
            """
            Convert the company object to a dictionary.
            """
            return {
                "id": self.id,
                "user_id": self.user_id,
                "password": self.password,
                "email": self.email,
                "association_name": self.association_name,
                "logo": self.logo,
                "address": self.address,
                "url": self.url,
                "contact_details": self.contact_details,
                "description": self.description,
                "iniciatives": self.iniciatives,
                "invites": self.invites,
                "requests": self.requests,
                "size": self.size,
            }

    return Association
