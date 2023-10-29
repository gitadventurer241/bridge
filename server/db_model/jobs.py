from sqlalchemy import text


def init_jobs_model(db):
    class Jobs(db.Model):
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
        associations = db.Column(db.ARRAY(db.String), nullable=False)
        company_id = db.Column(
            db.String(80), db.ForeignKey("user.id"), nullable=False
        )  # Company ID as a string from the user table
        title = db.Column(db.String(256))  # Title as a string
        description = db.Column(db.String(10000))  # Description as a string
        values = db.Column(
            db.ARRAY(db.String)
        )  # Values as an array of foreign keys (integer)
        skills = db.Column(db.JSON)  # Skills as an array of foreign keys (integer)
        soft_skills = db.Column(
            db.ARRAY(db.String)
        )  # Soft skills as an array of strings
        hiring_process_duration = db.Column(
            db.String(256)
        )  # Interview process duration as a string
        matching_candidates = db.Column(
            db.JSON
        )  # Matching candidates as an array of foreign keys (integer)
        salary = db.Column(
            db.ARRAY(db.String)
        )  # Salary expectation as an array of strings e.g ['50k', '70k']
        location_city = db.Column(db.String(256))  # Location as a string
        location_country = db.Column(db.String(256))  # Location as a string
        work_location = db.Column(
            db.String(256)
        )  # Job type as a string (hybrid, remote, onsite)
        employment_type = db.Column(
            db.String(256)
        )  # Job type as a string (full-time, part-time, internship)
        date_created = db.Column(db.DateTime, default=db.func.current_timestamp())

        def __init__(
            self,
            associations,
            company_id,
            title,
            description=None,
            values=None,
            skills=None,
            soft_skills=None,
            hiring_process_duration=None,
            matching_candidates=None,
            salary=None,
            location_city=None,
            location_country=None,
            date_created=None,
            work_location=None,
            employment_type=None,
        ):
            """
            Initialize a new job object.

            Args:
                # Your additional fields here
            """
            self.company_id = company_id
            self.associations = associations
            self.title = title
            self.description = description
            self.values = values
            self.skills = skills
            self.soft_skills = soft_skills
            self.hiring_process_duration = hiring_process_duration
            self.matching_candidates = matching_candidates
            self.salary = salary
            self.location_city = location_city
            self.location_country = location_country
            self.work_location = work_location
            self.employment_type = employment_type
            self.date_created = date_created

        def to_dict(self):
            """
            Convert the job object to a dictionary.
            """
            return {
                "id": self.id,
                "associations": self.associations,
                "company_id": self.company_id,
                "title": self.title,
                "description": self.description,
                "values": self.values,
                "skills": self.skills,
                "soft_skills": self.soft_skills,
                "hiring_process_duration": self.hiring_process_duration,
                "matching_candidates": self.matching_candidates,
                "salary": self.salary,
                "location_city": self.location_city,
                "location_country": self.location_country,
                "work_location": self.work_location,
                "employment_type": self.employment_type,
                "date_created": self.date_created.isoformat()
                if self.date_created
                else None,
            }

    return Jobs
