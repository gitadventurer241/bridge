import React, { useEffect, useState } from "react";
import {
  Divider,
  Input,
  Modal,
  Radio,
  Upload,
  UploadProps,
  message,
} from "antd";
import { IconInbox } from "@tabler/icons-react";
import Dragger from "antd/es/upload/Dragger";

import styling from "./SendInviteModal.module.css";
import { SendInviteModalProps } from "../../../types/types";
import UnderConstruction from "../underConstruction/UnderConstruction";

const SendInviteModal: React.FC<SendInviteModalProps> = ({
  isOpen,
  defaultOption,
  handleSend,
  onClose,
}) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [checked, setChecked] = useState<string | null>(defaultOption);
  const [constractionModal, setConstractionModal] = useState(false);

  const handleEmailChange = (e: any) => {
    setEmail(e.target.value);
  };

  const handleNameChange = (e: any) => {
    setName(e.target.value);
  };

  const onChange = (e: any) => {
    setChecked(e.target.value);
  };

  const createPayload = () => {
    const payload = {
      user_type: checked?.toLowerCase()!,
      recipient_email: email,
      association_name: "",
      name: name,
    };
    return payload;
  };

  useEffect(() => {
    setChecked(defaultOption);
  }, [defaultOption]);

  const options = [
    { label: "Company", value: "Company" },
    { label: "Candidate", value: "Candidate" },
    { label: "Association", value: "Association" },
  ];

  const props: UploadProps = {
    disabled: true,
    beforeUpload: (file) => {
      const isCSV = file.type === ".csv";
      if (!isCSV) {
        message.error(`${file.name} is not a csv file`);
      }
      return isCSV || Upload.LIST_IGNORE;
    },
    onChange: (info) => {
      console.log(info.fileList);
    },
  };

  const handleConstructionModal = () => {
    setConstractionModal(!constractionModal);
  };

  return (
    <>
      <Modal
        className={styling.modal}
        title="Send invite"
        open={isOpen}
        onCancel={onClose}
        onOk={(e: React.MouseEvent<HTMLButtonElement>) => {
          const payload = createPayload();
          handleSend(payload);
        }}
        okText="Send"
      >
        <Radio.Group onChange={onChange} value={checked}>
          {options.map((option) => (
            <Radio key={option.value} value={option.value}>
              {option.label}
            </Radio>
          ))}
        </Radio.Group>

        <Divider> Send individual invitation</Divider>

        <p>Name:</p>
        <Input
          placeholder="Enter name"
          value={name}
          onChange={handleNameChange}
        />
        <p>Email:</p>
        <Input
          placeholder="Enter email"
          value={email}
          onChange={handleEmailChange}
        />
        <Divider> Or send in bulk</Divider>
        <div onClick={handleConstructionModal}>
          <Dragger {...props}>
            <p className="ant-upload-drag-icon">
              <IconInbox />
            </p>
            <p className="ant-upload-text">
              Click or drag a CSV file to upload
            </p>
            <p className="ant-upload-hint">
              Support for a single upload. Strictly prohibited from uploading
              company data or other banned files.
            </p>
          </Dragger>
        </div>
      </Modal>

      <UnderConstruction
        isOpen={constractionModal}
        onClose={handleConstructionModal}
        subtitle="Send in bulk coming soon!"
      />
    </>
  );
};

export default SendInviteModal;
