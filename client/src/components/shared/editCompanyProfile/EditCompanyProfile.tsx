import React, { useEffect, useState } from "react";
import { Modal as AntModal, AutoComplete, Input, Select, Button } from "antd";

import styling from "./EditCompanyProfile.module.css";
import TextArea from "antd/es/input/TextArea";
import { Labels } from "../../UI/labels/Label";
import { getAllValues } from "../../../api/values";
import { companySizes } from "../../pages/helpers/helper";
import { Company } from "../../../types/types";

const { Option } = Select;

interface EditCompanyProfileProps {
  open: boolean;
  onOk: (payload: any) => void;
  onCancel: () => void;
  confirmLoading: boolean;
  companyId: string;
  companyInfo: Company;
  associations?: string[];
}

const EditCompanyProfile: React.FC<EditCompanyProfileProps> = ({
  open,
  onOk,
  onCancel,
  confirmLoading,
  companyId,
  companyInfo,
}) => {
  const MAX_LABELS_DISPLAYED = 6;

  // State
  const [company_name, setCompanyName] = useState<string>(
    companyInfo?.company_name || ""
  );
  const [company_size, setCompanySize] = useState<string>(
    companyInfo?.company_size || ""
  );

  const [description, setDescription] = useState<string>(
    companyInfo?.company_description || ""
  );
  const [values, setValues] = useState<string[]>(companyInfo?.values || []);
  const [address, setAddress] = useState<string>(companyInfo?.address || "");
  const [company_website, setCompanyWebsite] = useState<string>(
    companyInfo?.company_website || ""
  );
  const [company_culture, setCompanyCulture] = useState<string>(
    companyInfo?.company_culture || ""
  );
  const [kununu_url, setKununuUrl] = useState<string>(
    companyInfo?.kununu_url || ""
  );
  const [linkedin_url, setLinkedinUrl] = useState<string>(
    companyInfo?.linkedin_url || ""
  );
  const [logo, setLogo] = useState<string>(companyInfo?.logo || "");
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [valueDataSource, setValueDataSource] = useState<string[]>([]);
  const [allValues, setAllValues] = useState<string[]>([]);
  /**
   * Fetches all values from the database and sets the state
   */
  const fetchValues = async () => {
    const values = await getAllValues();

    const arrayOfValues = values?.map((value: any) => value?.name);

    setValueDataSource(arrayOfValues);
    setAllValues(arrayOfValues);
  };

  useEffect(() => {
    fetchValues();
  }, []);

  const handleOk = () => {
    const payload = {
      company_id: companyId,
      company_name: company_name,
      company_size: company_size,
      company_description: description,
      company_culture: company_culture,
      address: address,
      values: values,
      kununu_url: kununu_url,
      linkedin_url: linkedin_url,
      company_website: company_website,
      logo: logo,
    };

    onOk(payload);
  };

  const addValue = () => {
    if (
      selectedValue &&
      valueDataSource.includes(selectedValue) &&
      !values.includes(selectedValue)
    ) {
      setValues([...values, selectedValue]);
      setSelectedValue("");
    }
  };

  const removeValue = (value: string) => {
    setValues(values.filter((v) => v !== value));
  };

  const renderValueLabels = () => {
    const visibleValues = values.slice(0, MAX_LABELS_DISPLAYED);
    const hiddenValueCount = values.length - MAX_LABELS_DISPLAYED;

    return (
      <div className={styling.labelContainer}>
        {visibleValues?.map((value) => (
          <Labels
            customClass={styling.label}
            labelName={value}
            onCloseIcon={() => removeValue(value)}
            key={value}
          />
        ))}
        {hiddenValueCount > 0 && (
          <Labels
            customClass={styling.label}
            labelName={`+${hiddenValueCount}`}
            disableCloseIcon={true}
          />
        )}
      </div>
    );
  };

  return (
    <>
      <AntModal
        className={styling.modal}
        open={open}
        confirmLoading={confirmLoading}
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
        <h2 className={styling.header}>Edit company information</h2>
        <div className={styling.twoColumn}>
          <div className={styling.section}>
            <p className={styling.sectionName}>Company name:</p>
            <Input
              className={styling.input}
              placeholder="Company name"
              value={company_name}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>

          <div className={styling.section}>
            <p className={styling.sectionName}>Company size:</p>
            <Select
              placeholder="Select Company size"
              className={styling.input}
              style={{ width: "100%" }}
              value={company_size}
              onChange={(value) => setCompanySize(value)}
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
            placeholder="Company Description. Max 1000 characters"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className={styling.section}>
          <p className={styling.sectionName}>Company Culture:</p>
          <TextArea
            className={styling.culture}
            placeholder="Company Culture. Max 1000 characters"
            value={company_culture}
            onChange={(e) => setCompanyCulture(e.target.value)}
          />
        </div>

        <div className={styling.section}>
          <p className={styling.sectionName}>Values:</p>
          <div className={styling.autocomplete}>
            <AutoComplete
              placeholder="Search for values"
              value={selectedValue}
              options={valueDataSource?.map((value) => ({ value: value }))}
              onSelect={(value) => {
                setSelectedValue(value);
              }}
              style={{ width: "100%" }}
              onSearch={(searchText) => {
                setSelectedValue(searchText);

                if (searchText === "") {
                  setValueDataSource(allValues);
                } else {
                  const filteredValues = valueDataSource?.filter((value) =>
                    value.toLowerCase().includes(searchText.toLowerCase())
                  );
                  setValueDataSource(filteredValues);
                }
              }}
            />

            <Button onClick={addValue}>Add</Button>
          </div>

          {renderValueLabels()}
        </div>

        <div className={styling.section}>
          <p className={styling.sectionName}>Company URL:</p>
          <Input
            className={styling.input}
            placeholder="Company URL"
            value={company_website}
            onChange={(e) => setCompanyWebsite(e.target.value)}
          />
        </div>

        <div className={styling.section}>
          <p className={styling.sectionName}>LinkedIn URL:</p>
          <Input
            className={styling.input}
            placeholder="LinkedIn URL"
            value={linkedin_url}
            onChange={(e) => setLinkedinUrl(e.target.value)}
          />
        </div>

        <div className={styling.section}>
          <p className={styling.sectionName}>Kununu URL:</p>
          <Input
            className={styling.input}
            placeholder="Kununu URL"
            value={kununu_url}
            onChange={(e) => setKununuUrl(e.target.value)}
          />
        </div>
      </AntModal>
    </>
  );
};

export default EditCompanyProfile;
