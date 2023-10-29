import React, { useState } from "react";
import { Modal, Switch } from "antd";
import { Button } from "../../UI/button/Button";
import styling from "./ToggleModal.module.css";
import TextArea from "antd/es/input/TextArea";

interface StringSelectorModalProps {
  visible: boolean;
  allCategories: string[];
  selectedStrings: boolean[];
  title: string;
  subtitle?: string;
  buttonText: string;
  onToggle: (index: number) => void;
  onAcceptWithEnabledStrings: (
    enabledStrings: string[],
    textAreaValue: string
  ) => void;
  onCancel: () => void;
  isTextAreaVisible?: boolean;
}

const ToggleModal: React.FC<StringSelectorModalProps> = ({
  visible,
  allCategories,
  selectedStrings,
  title,
  subtitle,
  buttonText,
  onToggle,
  onAcceptWithEnabledStrings,
  onCancel,
  isTextAreaVisible = true,
}) => {
  const [textAreaValue, setTextAreaValue] = useState("");
  const handleOk = () => {
    const enabledStrings = allCategories.filter(
      (_, index) => selectedStrings[index]
    );
    onAcceptWithEnabledStrings(enabledStrings, textAreaValue);
  };
  return (
    <Modal
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      footer={[
        <div className={styling.buttonContainer} key={"footer"}>
          <Button className={styling.button} onClick={handleOk}>
            {buttonText}
          </Button>
        </div>,
      ]}
    >
      <h2 className={styling.title}>{title}</h2>
      <p className={styling.subtitle} hidden={!subtitle}>
        {subtitle}
      </p>
      <div className={styling.center}>
        {allCategories?.map((string, index) => (
          <div key={index} className={styling.options}>
            <p className={styling.field}>{string}</p>
            <Switch
              checked={selectedStrings[index]}
              onChange={() => onToggle(index)}
            />
          </div>
        ))}
        {isTextAreaVisible && (
          <TextArea
            className={styling.text}
            placeholder="Message to recruiter (optional)"
            value={textAreaValue}
            onChange={(e) => setTextAreaValue(e.target.value)}
          />
        )}
      </div>
    </Modal>
  );
};

export default ToggleModal;
