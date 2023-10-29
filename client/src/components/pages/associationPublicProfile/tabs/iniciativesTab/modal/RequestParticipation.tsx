import { Modal, Button } from "antd";
import { toast } from "react-toastify";
import { updateAssociationById } from "../../../../../../api/associations";
import { Association } from "../../../../../../types/types";

interface RequestParticipationProps {
  initiativeName: string;
  association: Association;
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const RequestParticipation: React.FC<RequestParticipationProps> = ({
  initiativeName,
  association,
  visible,
  setVisible,
}) => {
  const candidateId = JSON.parse(localStorage.getItem("auth") || "{}")?.user
    ?.id;
  const existingRequests =
    (association?.requests &&
      association?.requests.length > 0 &&
      association?.requests) ||
    [];
  const formData = {
    candidateId: candidateId,
    initiativeName: initiativeName,
  };

  const onOk = async () => {
    toast.success(`Request sent`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    try {
      const data = [...existingRequests, formData];
      const response = await updateAssociationById(association?.user_id, {
        requests: data,
      });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
    setVisible(false);
  };

  const onCancel = () => {
    setVisible(false);
  };

  return (
    <Modal
      title="Request participation"
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={onOk}>
          Request
        </Button>,
      ]}
    >
      <div>
        <p>
          Do you want to request participation confirmation for the{" "}
          <strong>{initiativeName}</strong> initiative?
        </p>
      </div>
    </Modal>
  );
};

export default RequestParticipation;
