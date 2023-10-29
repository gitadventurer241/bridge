import { Button, Modal } from "antd";
import styling from "./DeleteAccount.module.css";
import { deleteUser } from "../../../../api/user";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SpinnerLoading from "../../../UI/spinner/SpinnerTimeout";
import { useState } from "react";

const DeleteAccount = ({
  showModal,
  setShowModal,
  userId,
}: {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  userId: string;
}) => {
  // state
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOnCancel = () => {
    setIsDeleting(false);
    setShowModal(false);
  };

  const handleOnDelete = async () => {
    setIsDeleting(true);
    try {
      const response_status = await deleteUser(userId);
      setTimeout(() => {
        if (response_status === 200) {
          localStorage.removeItem("user_type");
          localStorage.removeItem("auth");
          localStorage.removeItem("saved_items");
          localStorage.removeItem("progress");
        } else {
          toast.error("Error deleting user");
        }
        navigate(`/login`);
      }, 3000);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const contentDeleteAccount = (
    <div className={styling.main}>
      <p className={styling.text}>
        Are you sure you want to delete your account?
      </p>
      <p className={styling.text}>This action cannot be undone.</p>
      <div className={styling.buttons}>
        <Button className={styling.buttonCancel} onClick={handleOnCancel}>
          Cancel
        </Button>
        <Button
          className={styling.buttonDelete}
          onClick={() => handleOnDelete()}
          danger
          type="primary"
        >
          Delete
        </Button>
      </div>
    </div>
  );

  const contentAccountBeingDeleted = (
    <div className={styling.main}>
      <p className={styling.text}>Your account is being deleted...</p>
      <SpinnerLoading />
    </div>
  );

  return (
    <Modal
      title="Delete Account"
      open={showModal}
      onCancel={handleOnCancel}
      footer={null}
    >
      {isDeleting ? contentAccountBeingDeleted : contentDeleteAccount}
    </Modal>
  );
};

export default DeleteAccount;
