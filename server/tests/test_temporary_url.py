import pytest
import sys, os
import time

sys.path.append(os.path.abspath(__file__).split("/tests")[0])
from services.temporary_url import (
    route,
    localhost,
    is_token_expired,
    expiration_time,
    generate_temporary_link_signed,
    verify_temporary_link,
    secret_key,
)


# Run `pytest -s tests/test_temporaryURL.py`
def test_temporary_url():
    # Example usage
    temporary_link = f"{localhost}/{route}?token=8y-5QSv5dz1sQpHrl8dtliA6qyRBX5LWvefUrz9IdDc&expires=1695841503"

    # Simulate checking if the link is still valid after 2 minutes
    response = is_token_expired(temporary_link)
    assert response is False


@pytest.mark.skip()
def test_expiration_time():
    assert expiration_time == int(time.time()) + 24 * 60 * 60


def test_signed_url():
    # Test the signed token validity
    user_type = "candidate"
    temporary_link = generate_temporary_link_signed(user_type, expiration_time)

    if verify_temporary_link(temporary_link, secret_key):
        print("Temporary link is valid.")
    else:
        print("Temporary link is not valid.")
