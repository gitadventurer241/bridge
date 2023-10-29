import React, { useState } from "react";
import { Modal, Input, Select } from "antd";
import { Candidate } from "../../../../types/types";
import { ContentBlock } from "../../../UI/container/SectionContainer";
import { IconEdit } from "@tabler/icons-react";
import { Button } from "../../../UI/button/Button";

interface ContentBlockModalProps {
  visible: boolean;
  setVisible: (arg: boolean) => void;
  candidate: Candidate;
  showModal: () => void;
  onSave?: (arg: Candidate) => void;
}

const EditSection: React.FC<ContentBlockModalProps> = ({
  visible,
  setVisible,
  candidate,
  showModal,
}) => {
  const [editedSections, setEditedSections] = useState(
    candidate?.visible_information as []
  );

  const handleSave = () => {
    // Handle saving the edited sections back to the candidate
    // You may want to make an API call or update the state in the parent component
    onCancel();
  };

  const onCancel = () => {
    setVisible(false);
  };

  return (
    <>
      <IconEdit
        color="black"
        style={{ cursor: "pointer" }}
        onClick={showModal}
      />
      <Modal
        open={visible}
        title="Edit Information"
        onCancel={onCancel}
        footer={[
          <Button key="cancel" onClick={onCancel}>
            Cancel
          </Button>,
          <Button key="save" onClick={handleSave}>
            Save
          </Button>,
        ]}
      >
        <ContentBlock sections={candidate?.visible_information as []} />
        <button onClick={handleSave}>Save</button>
      </Modal>
    </>
  );
};

export { EditSection };
