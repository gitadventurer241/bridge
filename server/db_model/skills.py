from sqlalchemy import text


def init_skills_model(db):
    class Skills(db.Model):
        """
        Postgres table schema for skills
        """

        id = db.Column(
            db.String(80),
            primary_key=True,
            server_default=text("uuid_generate_v4()"),
            unique=True,
            nullable=False,
        )
        name = db.Column(db.String(256), nullable=False, unique=True)
        category = db.Column(
            db.String(256), nullable=False
        )  # category: hard_skill or soft_skill

        def __init__(self, name, category):
            """
            Initialize a new skill object.

            Args:
                name (str): Name of the skill.
                category (str): category of the skill.
            """
            self.name = name
            self.category = category

        def to_dict(self):
            """
            Convert the skill object to a dictionary.
            """
            return {
                "id": self.id,
                "name": self.name,
                "category": self.category,
            }

    return Skills
