import pytest
import sys, os
sys.path.append(os.path.abspath(__file__).split("tests")[0])
from services.send_email import func_send_email

def test_send_email():
    # Replace "youremail@gmail.com" with your actual email
    recipient_email = "youremail@gmail.com"
    func_send_email(recipient_email)

