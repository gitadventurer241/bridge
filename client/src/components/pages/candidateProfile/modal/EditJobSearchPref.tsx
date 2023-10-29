import React, { useEffect, useState } from "react";
import { Modal, Input, Select, Button } from "antd";
import { Candidate } from "../../../../types/types";
import { IconEdit } from "@tabler/icons-react";
import styling from "./EditJobSearchPref.module.css";

const { Option } = Select;

interface ContentBlockModalProps {
  visible: boolean;
  setVisible: (arg: boolean) => void;
  candidate: Candidate;
  showModal: () => void;
  onSave?: (arg: Candidate) => void;
}

const EditJobSearchPref: React.FC<ContentBlockModalProps> = ({
  visible,
  setVisible,
  candidate,
  showModal,
  onSave,
}) => {
  const [selectedField, setSelectedField] = useState<string>("");
  const [additionalFields, setAdditionalFields] = useState<string[]>([]);
  const [candidateFields, setCandidateFields] = useState<string[]>([]);
  const [salaryRange, setSalaryRange] = useState<string[]>([]);
  const [notice, setNotice] = useState<string>("");
  const [visaFields, setVisaFields] = useState<string[]>([]);
  const [workLocation, setWorkLocation] = useState<string[]>([]);
  const [typeOfWork, setTypeOfWork] = useState<string[]>([]);

  const fieldsToShow = [
    "Salary range",
    "Notice",
    "Visa Status",
    "Possible Work Locations",
    "Type of work",
  ];

  useEffect(() => {
    // Clear additionalFields when the component mounts
    setAdditionalFields([]);
    // Initialize candidateFields with the relevant data
    const initialCandidateFields = [];

    if (
      candidate?.salary_expectation &&
      candidate?.salary_expectation.length > 0
    ) {
      setSalaryRange(candidate?.salary_expectation);
      initialCandidateFields.push("Salary range");
    }
    if (candidate?.notice_period && candidate?.notice_period.length > 0) {
      setNotice(candidate?.notice_period);
      initialCandidateFields.push("Notice");
    }
    if (candidate?.visa_status && candidate?.visa_status.length > 0) {
      setVisaFields(candidate?.visa_status as string[]);
      initialCandidateFields.push("Visa Status");
    }
    if (
      candidate?.possible_work_locations &&
      candidate?.possible_work_locations.length > 0
    ) {
      setWorkLocation(candidate?.possible_work_locations);
      initialCandidateFields.push("Possible Work Locations");
    }
    if (candidate?.type_of_work && candidate?.type_of_work.length > 0) {
      setTypeOfWork(candidate?.type_of_work);
      initialCandidateFields.push("Type of work");
    }

    setCandidateFields(initialCandidateFields);
  }, []);

  const handleAddField = () => {
    if (selectedField) {
      if (
        additionalFields.includes(selectedField) ||
        candidateFields.includes(selectedField)
      ) {
        return; // Allow fields to be added only once
      }
      setAdditionalFields([...additionalFields, selectedField]);
      setSelectedField("");
    }
  };

  const handleUpdateField = () => {
    let updatedCandidate: Candidate = { ...candidate };

    updatedCandidate = {
      ...updatedCandidate,
      salary_expectation: salaryRange,
      notice_period: notice,
      visa_status: visaFields,
      possible_work_locations: workLocation,
      type_of_work: typeOfWork,
    };

    handleSave(updatedCandidate, true);
  };

  const handleSave = (updatedCandidate: Candidate, isOnCancel: boolean) => {
    onSave && onSave(updatedCandidate);

    if (isOnCancel) {
      onCancel();
    }
  };

  const onCancel = () => {
    setAdditionalFields([]);
    // setSalaryRange([]);
    // setNotice("");
    // setSelectedField("");
    // setTypeOfWork([]);
    setVisible(false);
  };

  const handleDeleteField = (field: string) => {
    // set states
    switch (field) {
      case "Salary range":
        setSalaryRange([]);
        break;
      case "Notice":
        setNotice("");
        break;
      case "Visa Status":
        setVisaFields([]);
        break;
      case "Possible Work Locations":
        setWorkLocation([]);
        break;
      case "Type of work":
        setTypeOfWork([]);
        break;
      default:
        break;
    }
    setAdditionalFields(additionalFields.filter((f) => f !== field));
  };

  const renderFields = (field: string, showDeleteButton: boolean) => {
    switch (field) {
      case "Salary range":
        return (
          <div>
            <h3>{field}</h3>
            <div className={styling.row}>
              <p>Min: </p>
              <Input
                value={salaryRange[0]}
                onChange={(e) =>
                  setSalaryRange([e.target.value, salaryRange[1]])
                }
                placeholder="Min Salary e.g 50'000"
              />
              <p>Max: </p>
              <Input
                value={salaryRange[1]}
                onChange={(e) =>
                  setSalaryRange([salaryRange[0], e.target.value])
                }
                placeholder="Max Salary e.g 80'000"
              />
              {showDeleteButton && (
                <Button
                  type="default"
                  danger
                  className={styling.deleteButton}
                  onClick={() => handleDeleteField(field)}
                >
                  Delete
                </Button>
              )}
            </div>
          </div>
        );
      case "Notice":
        return (
          <div>
            <h3>{field}</h3>
            <div className={`${styling.row} ${styling.inputButton}`}>
              <Select
                value={notice}
                onChange={(value) => setNotice(value)}
                style={{ minWidth: "100%" }}
              >
                <Option value="1 week">1 week</Option>
                <Option value="2 weeks">2 weeks</Option>
                <Option value="1 month">1 month</Option>
                <Option value="2 months">2 months</Option>
                <Option value="3 months">3 months</Option>
              </Select>
              {showDeleteButton && (
                <Button
                  type="default"
                  danger
                  className={styling.deleteButton}
                  onClick={() => handleDeleteField(field)}
                >
                  Delete
                </Button>
              )}
            </div>
          </div>
        );
      case "Visa Status":
        return (
          <div>
            <h3>{field}</h3>
            <div className={`${styling.row} ${styling.inputButton}`}>
              <Select
                value={visaFields}
                onChange={(value) => setVisaFields(value)}
                style={{ minWidth: "100%" }}
                mode="tags"
              >
                <Option value="EU">EU valid visa</Option>
                <Option value="CH">CH valid visa</Option>
                <Option value="US">US valid visa</Option>
              </Select>
              {showDeleteButton && (
                <Button
                  type="default"
                  danger
                  className={styling.deleteButton}
                  onClick={() => handleDeleteField(field)}
                >
                  Delete
                </Button>
              )}
            </div>
          </div>
        );
      case "Possible Work Locations":
        return (
          <div>
            <h3>{field}</h3>
            <div className={`${styling.row} ${styling.inputButton}`}>
              <Select
                value={workLocation}
                onChange={(value) => setWorkLocation(value)}
                style={{ minWidth: "100%" }}
                mode="tags"
              >
                <Option value="Zurich">Zurich</Option>
                <Option value="Bern">Bern</Option>
                <Option value="Basel">Basel</Option>
                <Option value="Geneva">Geneva</Option>
                <Option value="Lausanne">Lausanne</Option>
                <Option value="Lugano">Lugano</Option>
                <Option value="Luzern">Luzern</Option>
                <Option value="St. Gallen">St. Gallen</Option>
              </Select>
              {showDeleteButton && (
                <Button
                  type="default"
                  danger
                  className={styling.deleteButton}
                  onClick={() => handleDeleteField(field)}
                >
                  Delete
                </Button>
              )}
            </div>
          </div>
        );
      case "Type of work":
        return (
          <div>
            <h3>{field}</h3>
            <div className={`${styling.row} ${styling.inputButton}`}>
              <Select
                value={typeOfWork}
                onChange={(value) => setTypeOfWork(value)}
                style={{ minWidth: "100%" }}
                mode="tags"
              >
                <Option value="remote">Remote</Option>
                <Option value="partly-home">Partly Home</Option>
                <Option value="mostly-home">Mostly Home</Option>
                <Option value="in-office">In office</Option>
              </Select>
              {showDeleteButton && (
                <Button
                  type="default"
                  danger
                  className={styling.deleteButton}
                  onClick={() => handleDeleteField(field)}
                >
                  Delete
                </Button>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
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
          <Button
            key="save"
            type="primary"
            onClick={handleUpdateField}
            className={styling.button}
          >
            Save
          </Button>,
        ]}
      >
        {/* Display existing fields */}
        {candidateFields?.map((field, index) => (
          <div key={index}>
            {renderFields(field, true)}
            <hr />
          </div>
        ))}
        {/* Display fields */}
        {additionalFields.length > 0 &&
          additionalFields?.map((field, index) => (
            <div key={index + 1}>
              {renderFields(field, true)}
              <hr />
            </div>
          ))}
        {/* Add fields */}
        <div className={`${styling.row} ${styling.marginBottom}`}>
          <Select
            className={styling.select}
            value={selectedField}
            onChange={(value) => setSelectedField(value)}
            style={{ minWidth: "35rem", marginBottom: "1rem" }}
          >
            {fieldsToShow.map((field, index) => (
              <Option key={index + 2} value={field}>
                {field}
              </Option>
            ))}
          </Select>
          <Button onClick={handleAddField}>Add Field</Button>
        </div>
      </Modal>
    </>
  );
};

export { EditJobSearchPref };
