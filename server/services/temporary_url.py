import secrets
import time
import hashlib
import hmac
import base64
import os

ENV = os.environ.get("FLASK_ENV", "development")
print(f"ENV: {ENV}")

if ENV == "development":
    localhost = "http://localhost:3000"
else:
    localhost = "https://banana-builders-client.vercel.app"

route = "register"
# expiration_time = int(time.time()) + 24 * 60 * 60  # 24 hours in seconds
secret_key = os.environ.get("SECRET_KEY")


# Function to generate a temporary link with expiration
def generate_temporary_link(expiration_time, user_type):
    # Generate a random token
    token = secrets.token_urlsafe(32)

    # Combine the token and expiration time in a structured format
    temporary_link = f"{localhost}/{route}?token={token}&expires={expiration_time}&user_type={user_type}"

    return temporary_link


# Function to extract expiration timestamp from the link
def extract_expiration_timestamp(link):
    # Extract the expiration timestamp from the link (assuming it's in the query string)
    try:
        query_params = link.split("?")[1].split("&")
        for param in query_params:
            key_value = param.split("=")
            if len(key_value) == 2:  # Check if there are two elements (key and value)
                key, value = key_value
                if key == "expires":
                    return int(value)
        # If "expires" parameter is not found, return None
        return None
    except Exception as e:
        # Handle parsing errors here (e.g., log the error)
        print("Error:", e)
        return None


def is_token_expired(temporary_link):
    # Extract the expiration timestamp from the token
    expiration_timestamp = extract_expiration_timestamp(temporary_link)

    # Get the current timestamp
    current_time = int(time.time())
    print(f"current_time: {current_time}")
    print(f"expiration_timestamp: {expiration_timestamp}")

    # Check if the token is expired
    if expiration_timestamp and current_time <= expiration_timestamp:
        print("Link is still valid.")
        return True
    else:
        print("Link has expired.")
        return False


def get_token_data(user_type, association, expiration_time):
    token_data = f"{route}?token={secret_key}&expires={expiration_time}&user_type={user_type}&association={association}"
    return token_data


# Function to generate a temporary signed URL
def generate_temporary_link_signed(user_type, expiration_time, association):
    secret_key = os.environ.get("SECRET_KEY")
    # Create the token
    token_data = get_token_data(user_type, association, expiration_time)

    token = base64.urlsafe_b64encode(token_data.encode()).decode()

    # Create the signature
    signature = hmac.new(secret_key.encode(), token.encode(), hashlib.sha256).digest()
    signature_base64 = base64.urlsafe_b64encode(signature).decode()

    # Create the temporary link
    temporary_link = f"{localhost}/{token_data}&signature={signature_base64}"

    return temporary_link


# Function to verify a temporary signed URL
def verify_temporary_link_signed(temp_link, secret_key, user_type, association):
    parts = temp_link.split("?")
    if len(parts) != 2:
        return False

    query_string = parts[1]
    query_params = query_string.split("&")

    token = None
    signature = None
    expiration_time = None

    for param in query_params:
        key, *value = param.split("=")
        value = "=".join(value)
        if key == "token":
            token = value
        elif key == "signature":
            signature = value
        elif key == "expires":
            expiration_time = int(value)
        elif key == "user_type":
            user_type = value
        elif key == "association":
            association = value

    # print(
    #     f"token: {token}",
    #     f"signature: {signature}",
    #     f"expiration_time: {expiration_time}",
    #     f"user_type: {user_type}",
    #     f"association: {association}",
    #     sep="\n",
    # )
    if not token or not signature or expiration_time is None:
        return False

    token_data = get_token_data(user_type, association, expiration_time)

    token = base64.urlsafe_b64encode(token_data.encode()).decode()

    computed_signature = base64.urlsafe_b64encode(
        hmac.new(secret_key.encode(), token.encode(), hashlib.sha256).digest()
    ).decode()

    return computed_signature == signature
