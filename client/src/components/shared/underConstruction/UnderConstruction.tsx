import React from "react";
import styling from "./UnderConstruction.module.css";
import BananaIcon from "../../../media/banana-icon.png";
import WorkInProgress from "../../../media/work.png";
import { Modal } from "antd";

interface ModalProps {
  subtitle: string;
  isOpen: boolean;
  onClose: () => void;
}

const UnderConstruction: React.FC<ModalProps> = ({
  subtitle,
  isOpen,
  onClose,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <Modal
      title={null}
      open={isOpen}
      onCancel={onClose}
      closable={true}
      footer={null}
    >
      <div className={styling.main}>
        <div className={styling.text}>
          <img src={WorkInProgress} alt={"icon"} className={styling.workIcon} />
          <div className={styling.title}>{subtitle}</div>
          <div className={styling.footer}>
            <img src={BananaIcon} alt={"icon"} className={styling.icon} />
            <p className={styling.footerText}>By Banana Builders</p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default UnderConstruction;
