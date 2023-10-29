import sendgrid
from sendgrid.helpers.mail import (
    Mail,
    From,
    To,
    Subject,
    PlainTextContent,
    HtmlContent,
    Attachment,
    FileContent,
    FileName,
    FileType,
    Disposition,
)
import sys, os
import base64

sys.path.append(os.path.abspath(__file__).split("services")[0])
from services.temporary_url import generate_temporary_link_signed
from dotenv import load_dotenv

load_dotenv()
import time

# Constants
email_from = os.environ.get("SMTPLIB_EMAIL")
api_key = os.environ.get("SENDGRID_API_KEY")


def func_send_email(recipient_email, user_type, association_name):
    # Initialize the SendGrid client
    sg = sendgrid.SendGridAPIClient(api_key=api_key)

    expiration_time = int(time.time()) + (24 * 60 * 60 * 1000) * 7  # 7 days

    temporary_link = generate_temporary_link_signed(
        user_type, expiration_time, association_name
    )

    file_path = "./services/bridge-logo.png"
    with open(file_path, "rb") as image_file:
        image_data = base64.b64encode(image_file.read()).decode()

    subject = (
        f"""Association {association_name} has cordially invited you to join Bridge"""
    )

    candidate_body = f"""
    <p>We’re pleased to invite you to our exclusive platform to find your new tech job called Bridge. Bridge offers you a platform to find entry level technical jobs at a range of companies that care for a diverse workforce.</p>

    <h3>What do you need to do?</h3>
    <p>When creating your account, make sure to directly head over to your profile and fill in all the details. </p>
    <p>On Bridge, we focus on skills and values, rather than purely on your work experience, so make sure to fill in as many as you have! </p>

    <h3>What can you expect?</h3>
    <p>Bridge offers you a platform to find entry level technical jobs at a range of companies that care for a diverse workforce. You’ll be able to browse jobs, see what skills are needed and what the companies’ values are.</p> 
    <p>On top, you’ll be find the companies and read their profiles and see other associations like us.</p>
    """

    company_body = f"""
    <p>We’re pleased to invite you to our exclusive platform for new technical talent called Bridge.
        Bridge offers you a platform to find entry level technical talent from a range of diverse backgrounds.</p>
    
    <h3>What do you need to do?</h3>
    <p>As a platform where talented job seekers are actively browsing opportunities, it is key that you present your company in an attractive way! Fill in the basic information about who you are, what you do and what your culture is. On Bridge, we would like to focus on company values a little more than normally, so please make sure you have them ready to go online! </p>

    <h3>What can you expect?</h3>
    <p>You’ll be able to browse candidates, see what skills they have and what their values are and also what they’ve worked on with us.</p>
    <p>If you like what you see, you can request their full information package, which includes their CV, certificates and contact information for you to directly snatch them off the market!</p>
    """

    association_body = f"""
    <p>We’re delighted to welcome you to our community at Bridge. Bridge is a hub that connects talented individuals, innovative companies, and dynamic associations.</p>

    <h3>What do you need to do?</h3>
    <p>If you represent an association, it's important to showcase your organization's mission, values, and the opportunities you offer. Create a profile that highlights the essence of your association and what you stand for.</p>
    <p>At Bridge, we believe in the power of collaboration, so ensure your association's unique values are well-defined.</p>

    <h3>What can you expect?</h3>
    <p>Bridge provides a platform for associations to connect with a diverse pool of talents and businesses. You can discover individuals with a wide range of skills and values that align with your organization's goals.</p>
    <p>Additionally, you'll be able to explore potential collaborations with companies and candidates, enabling mutually beneficial partnerships.</p>
    <p>Bridge is where associations like yours thrive, and we're excited to have you on board.</p>
    """

    body = f"""
    <html>
        <head></head>
        <body>
            <table width="100%" height="500" border="0" bgcolor="#597EF7" cellpadding="0" cellspacing="0" style="margin: 0; z-index: 20;">
                <tr>
                    <td bgcolor="#597EF7">&nbsp;</td>
                </tr>
                <tr>
                    <td>&nbsp;</td>
                    <td rowspan="2" bgcolor="#fff" align="center" width="700px" style="border: 1px solid #CCCC; margin: 0;">
                        <div style="width: 700px; display: block; background-color: #fff; color: black; margin-bottom: 30px;">
                            <img src="cid:bridge_logo" alt="bridge-logo" border="0" style="width: 200px; margin-top: 30px; margin-bottom: 60px;"/>
                            <h1 style="color: #595959; margin-top: 1px; font-size: 30px;">You've been invited to join Bridge.</h1>
                            <div style="width: 480px; text-align: left; margin-bottom: 60px; font-size: 1em;"> 
                                <p style="font-size: 1em;"><strong>{association_name}</strong> has invited you to join Bridge.</p>
                                {candidate_body if user_type == "candidate" else ""}
                                {company_body if user_type == "company" else ""}
                                {association_body if user_type == "association" else ""}                          
                                <p style="font-size: 1em;">Click the button below to access Bridge and be part of this inspiring journey.</p>
                                <p style="font-size: 1em;">The invitation link will <strong>expire in 7 days.</strong></p>
                            </div>
                            <button style="background-color: #597EF7; padding: 18px 25px; border: none; border-radius: 10px;">
                                <a style="color: #fff;" style="text-decoration: none;" href="{temporary_link}"><strong>Join Bridge</strong></a>
                            </button>
                        </div>
                    </td>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td bgcolor="#fff">&nbsp;</td>
                    <td bgcolor="#fff">&nbsp;</td>
                </tr>

                <tr bgcolor="#fff">
                    <td colspan="3">&nbsp;</td>
                </tr>

                <tr bgcolor="#fff">
                    <td colspan="3" align="center" style="color: #CCCC">
                        (c) The Bridge Software Team
                    </td>
                </tr>
                <tr bgcolor="#fff">
                    <td colspan="3" align="center" style="color: #CCCC">
                        Terms & Conditions | Privacy Policy
                    </td>
                </tr>
            </table>
        </body>
    </html>
    """

    # Create the email message
    message = Mail(
        from_email=From(email_from, "Shift4"),
        to_emails=To(recipient_email),
        subject=Subject(subject),
        plain_text_content=PlainTextContent(body),
        html_content=HtmlContent(body),
    )

    # Attach the image
    att = Attachment()
    att.file_content = FileContent(image_data)
    att.file_name = FileName("bridge-logo.png")
    att.file_type = FileType("image/png")
    att.disposition = Disposition("inline")
    att.content_id = "bridge_logo"
    message.add_attachment(att)

    try:
        # Send the email
        response = sg.send(message)
        if response.status_code == 202:
            print(f"Email sent successfully to {recipient_email}")
            return {"message": "success", "link": temporary_link}
        else:
            print(f"Email sending failed with status code: {response.status_code}")
            return {"message": f"error {response.status_code}: {response.body} "}

    except Exception as e:
        print(f"Email sending failed with exception: {str(e)}")
        return {"message": "error"}
