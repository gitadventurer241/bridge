import { useState } from "react";
import styling from "./Settings.module.css";
import { Button, Input } from "antd";
import DeleteAccount from "./modal/DeleteAccount";
import { changePassword } from "../../../api/user";
import { toast } from "react-toastify";
import SpinnerLogin from "../../UI/spinner/LoginSpinner";

const Settings = () => {
  const userId = JSON.parse(localStorage.getItem("auth")!)?.user?.id;
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [checkingPassword, setCheckingPassword] = useState<boolean>(false);

  const handleShowModal = () => {
    setShowModal(true);
  };

  const checkPasswords = () => {
    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleChangePassword = async () => {
    setCheckingPassword(true);
    if (checkPasswords()) {
      try {
        const response = await changePassword(
          userId,
          newPassword,
          currentPassword
        );
        if (response === 200) {
          setNewPassword("");
          setConfirmNewPassword("");
          setCurrentPassword("");
          toast.success("Password changed successfully");
          setCheckingPassword(false);
        } else if (response === 400) {
          toast.error("Incorrect current password");
          setCheckingPassword(false);
        } else {
          toast.error("Oops, something went wrong. Please try again later.");
          setCheckingPassword(false);
        }
      } catch (error) {
        console.error("Error:", error);
        setCheckingPassword(false);
      }
    }
    setCheckingPassword(false);
  };

  const [showPassword, setShowPassword] = useState(false); // Add this state

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styling.main}>
      <h1 className="header">Settings</h1>
      {/* Password container */}
      <div className={styling.passwordDiv}>
        <div className={styling.row}>
          <div className={styling.width}>
            <h1 className={styling.passwordTitle}>Password</h1>
          </div>
          <div className={styling.column}>
            <p className={styling.changePTtitle}>Change your password</p>
            <p>
              Changing your password will log you out of all your active Bridge
              sessions.
            </p>
            <div>
              <p>Current password</p>
              <Input
                placeholder="Current password"
                type={showPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className={`${styling.row} ${styling.spaceBetween}`}>
              <div className={styling.allWidth}>
                <p>New password</p>
                <Input
                  placeholder="New password"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className={styling.allWidth}>
                <p>Confirm New password</p>
                <Input
                  placeholder="Confirm New password"
                  type={showPassword ? "text" : "password"}
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                />
              </div>
            </div>
            <a
              onClick={togglePasswordVisibility}
              className={styling.showPassword}
            >
              {showPassword ? "Hide Password" : "Show Password"}
            </a>

            <Button
              className={styling.buttonPassword}
              type="primary"
              onClick={handleChangePassword}
            >
              {checkingPassword ? <SpinnerLogin /> : "Update password"}
            </Button>
          </div>
        </div>
      </div>

      {/* Delete account container */}
      <div className={styling.deleteAccDiv}>
        <div className={styling.row}>
          <div className={styling.width}>
            <h1 className={styling.passwordTitle}>My Account</h1>
          </div>
          <div className={styling.column}>
            <p className={styling.changePTtitle}>Delete my account</p>
            <p>
              Bridge makes it easy to delete your account and all data
              associated with it. You cannot undo this.
            </p>
            <Button
              type="default"
              danger
              className={styling.deleteButton}
              onClick={handleShowModal}
            >
              Delete my account
            </Button>
            <DeleteAccount
              showModal={showModal}
              setShowModal={setShowModal}
              userId={userId}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
