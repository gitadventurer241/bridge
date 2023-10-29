import React, { useState } from "react";
import { Modal, Checkbox } from "antd";

interface Props {
  onAgreeChange: (value: boolean) => void;
}

const TermsAndConditions: React.FC<Props> = ({ onAgreeChange }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [agree, setAgree] = useState(false);

  const checkboxHandler = () => {
    setAgree(!agree);
    onAgreeChange(!agree);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <div className="App">
      <div className="container">
        <div>
          <Checkbox checked={agree} onChange={checkboxHandler}>
            I agree to{" "}
            <b
              onClick={() => setModalVisible(true)}
              style={{ textDecoration: "underline", cursor: "pointer" }}
            >
              terms and conditions
            </b>
          </Checkbox>
        </div>
      </div>
      <Modal
        title="Terms and Conditions"
        visible={modalVisible}
        onOk={closeModal}
        onCancel={closeModal}
      >
        <p>
          By ticking this box, I agree to the terms and conditions that apply of
          using this platform, including the data processing of potentially
          personal identifiable information.
        </p>
      </Modal>
    </div>
  );
};

export default TermsAndConditions;
