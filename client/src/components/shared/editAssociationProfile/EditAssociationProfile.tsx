import React, { useState } from "react";
import { Modal as AntModal, Button, Input, Select } from "antd";
import styling from "./EditAssociationProfile.module.css";
import TextArea from "antd/es/input/TextArea";
import { companySizes } from "../../pages/helpers/helper";

const { Option } = Select;

interface ModalProps {
  open: boolean;
  onOk: (payload: any) => void;
  onCancel: () => void;
  associationId: string;
  associationInfo: any;
}

const EditAssociationProfile: React.FC<ModalProps> = ({
  open,
  onOk,
  onCancel,
  associationId,
  associationInfo,
}) => {
  // State
  const [association_name, setAssociationName] = useState<string>(
    associationInfo?.association_name || ""
  );
  const [association_size, setAssociationSize] = useState<string>(
    associationInfo?.size || ""
  );

  const [description, setDescription] = useState<string>(
    associationInfo?.description || ""
  );
  const [address, setAddress] = useState<string>(associationInfo.address || "");
  const [association_website, setAssociationWebsite] = useState<string>(
    associationInfo?.association_website || ""
  );
  const [logo, setLogo] = useState<string>(associationInfo?.logo || "");

  const handleOk = () => {
    const payload = {
      company_id: associationId,
      association_name: association_name,
      size: association_size,
      description: description,
      address: address,
      url: association_website,
      logo: logo,
    };

    onOk(payload);
  };

  return (
    <>
      <AntModal
        className={styling.modal}
        open={open}
        onCancel={onCancel}
        footer={[
          <Button key="back" className={styling.cancel} onClick={onCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            className={styling.save}
            onClick={handleOk}
          >
            Save
          </Button>,
        ]}
      >
        <h2 className={styling.header}>Edit your association information</h2>
        <div className={styling.twoColumn}>
          <div className={styling.section}>
            <p className={styling.sectionName}>Association name:</p>
            <Input
              className={styling.input}
              placeholder="Association name"
              value={association_name}
              onChange={(e) => setAssociationName(e.target.value)}
            />
          </div>

          <div className={styling.section}>
            <p className={styling.sectionName}>Association size:</p>
            <Select
              placeholder="Select Association size"
              className={styling.input}
              style={{ width: "100%" }}
              value={association_size}
              onChange={(value) => setAssociationSize(value)}
            >
              {companySizes?.map((size, index) => (
                <Option key={index} value={size}>
                  {size} employees
                </Option>
              ))}
            </Select>
          </div>
        </div>

        <div className={styling.twoColumn}>
          <div className={styling.section}>
            <p className={styling.sectionName}>Address:</p>
            <Input
              className={styling.input}
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className={styling.section}>
            <p className={styling.sectionName}>Logo URL:</p>
            <Input
              className={styling.input}
              placeholder="Logo URL"
              value={logo}
              onChange={(e) => setLogo(e.target.value)}
            />
          </div>
        </div>

        <div className={styling.section}>
          <p className={styling.sectionName}>Description:</p>
          <TextArea
            className={styling.description}
            placeholder="Description. Max 1000 characters"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className={styling.section}>
          <p className={styling.sectionName}>Association URL:</p>
          <Input
            className={styling.input}
            placeholder="Association URL"
            value={association_website}
            onChange={(e) => setAssociationWebsite(e.target.value)}
          />
        </div>
      </AntModal>
    </>
  );
};

export default EditAssociationProfile;
