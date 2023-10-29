import { GoogleLogin } from "@react-oauth/google";
import styling from "./GoogleButton.module.css";

interface GoogleButtonProps {
  text: "signin_with" | "signup_with" | "continue_with" | "signin" | undefined;
}

const GoogleButton = (
  {
    text,
    isDisabled,
  }: { text: GoogleButtonProps["text"]; isDisabled?: boolean } = {
    text: "signin_with",
    isDisabled: false,
  }
) => {
  return (
    <div className={isDisabled ? styling.disabled : ""}>
      <GoogleLogin
        text={text}
        onSuccess={(credentialResponse) => {
          console.log(credentialResponse);
        }}
        onError={() => {
          console.log("Login Failed");
        }}
      />
    </div>
  );
};

export { GoogleButton };
