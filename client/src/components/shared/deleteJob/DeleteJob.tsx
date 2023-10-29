import { Button, Modal } from "antd";
import styling from "./DeleteJob.module.css";
import { deleteJob } from "../../../api/jobs";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SpinnerLoading from "../../UI/spinner/SpinnerTimeout";
import { useState } from "react";

const DeleteAccount = ({
  showModal,
  setShowModal,
  jobId,
}: {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  jobId: string;
}) => {
  // state

  const [isDeleting, setIsDeleting] = useState(false);

  const handleOnCancel = () => {
    setIsDeleting(false);
    setShowModal(false);
  };

  const handleOnDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteJob(jobId);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const contentJobDelete = (
    <div className={styling.main}>
      <p className={styling.text}>Are you sure you want to delete this job?</p>
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

  const jobBeingDeleted = (
    <div className={styling.main}>
      <p className={styling.text}>This job is being deleted...</p>
      <SpinnerLoading />
    </div>
  );

  return (
    <Modal
      title="Delete job posting"
      open={showModal}
      onCancel={handleOnCancel}
      footer={null}
    >
      {isDeleting ? jobBeingDeleted : contentJobDelete}
    </Modal>
  );
};

export default DeleteAccount;
