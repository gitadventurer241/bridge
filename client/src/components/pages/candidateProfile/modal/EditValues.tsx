import React, { useEffect, useState } from "react";
import { Button, Modal, Input } from "antd";
import { IconEdit } from "@tabler/icons-react";
import { Labels } from "../../../UI/labels/Label";
import styling from "./EditValues.module.css";
import { Candidate } from "../../../../types/types";

interface EditValuesProps {
  candidate: Candidate;
  setCandidate: (updatedCandidate: Candidate) => void;
  icon: React.ReactNode;
  titleName: string;
  allLabels: string[];
  onSave?: (arg: Candidate) => void;
  visible: boolean;
  setVisible: (arg: boolean) => void;
  showModal: () => void;
}

const EditValues: React.FC<EditValuesProps> = ({
  candidate,
  icon,
  titleName,
  setCandidate,
  allLabels,
  onSave,
  visible,
  setVisible,
  showModal,
}) => {
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [candidateLabels, setCandidateLabels] = useState<string[]>([]); // Change the type to an array of strings
  const [filteredValues, setFilteredValues] = useState<string[]>([]); // Change the type to an array of strings

  useEffect(() => {
    setCandidateLabels(candidate?.values as string[]);
    updateFilteredValues(candidate?.values as string[]);
    if (candidate?.values && candidate?.values?.length > 0) {
      // Filter out values that are already in candidate.values
      const filteredValues = allLabels.filter(
        (label) => !candidate?.values?.includes(label)
      );
      setFilteredValues(filteredValues);
    } else {
      // If candidate.values is empty, set filteredValues to allLabels
      setFilteredValues(allLabels);
    }
  }, [candidate, allLabels]);

  const handleSearchTextChange = (searchText: string) => {
    setSearchText(searchText);
    updateFilteredValues(candidateLabels, searchText);
  };

  const updateFilteredValues = (
    valuesToDelete: string[],
    searchText?: string
  ) => {
    if (valuesToDelete?.length > 0) {
      const updatedFilteredValues = allLabels?.filter((value) => {
        const isValueInCandidate = valuesToDelete?.every(
          (candidateValue) => candidateValue !== value
        );
        if (!searchText) {
          return isValueInCandidate;
        }
      });
      setFilteredValues(updatedFilteredValues);
    }
    if (searchText) {
      const updatedFilteredValues = filteredValues?.filter((value) =>
        value.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredValues(updatedFilteredValues);
    }
  };

  const handleCloseValue = (valueToRemove: string) => {
    const updatedValues = candidateLabels.filter(
      (value) => value !== valueToRemove
    );
    setCandidateLabels(updatedValues);
    updateFilteredValues(updatedValues); // Update filteredValues
  };

  const addSkillToDeleteState = (skillToAdd: string) => {
    // Check if candidateLabels is not empty
    if (candidateLabels) {
      const updatedValues = [...candidateLabels, skillToAdd];
      setCandidateLabels(updatedValues);
      updateFilteredValues(updatedValues); // Update filteredValues
    } else {
      // If it's empty, initialize candidateLabels with an array containing the skillToAdd
      setCandidateLabels([skillToAdd]);
      updateFilteredValues([skillToAdd]); // Update filteredValues
    }
  };

  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setVisible(false);
      setCandidate({ ...candidate, values: candidateLabels });
      onSave && onSave({ ...candidate, values: candidateLabels } as Candidate);
      setSearchText("");
    }, 300);
  };

  const handleCancel = () => {
    setVisible(false);
    setCandidateLabels(candidate.values as string[]);
    setSearchText("");
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
        title={titleName}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleOk}
          >
            Update
          </Button>,
        ]}
      >
        {/* Candidates values */}
        <div className={styling.elementInOneRow}>
          {candidateLabels &&
            candidateLabels?.map((value, index) => (
              <Labels
                key={index}
                icon={icon}
                labelName={value}
                onCloseIcon={() => handleCloseValue(value)}
                disableCloseIcon={false}
                customClass={styling.labelClassSelected}
              />
            ))}
        </div>
        <Input
          className={styling.searchInput}
          placeholder="Search Values"
          value={searchText}
          onChange={(e) => handleSearchTextChange(e.target.value)}
        />
        {/* All values */}
        <div className={styling.elementInOneRow}>
          {filteredValues && (
            <>
              {filteredValues?.slice(0, 10).map((value, index) => (
                <Labels
                  key={index}
                  icon={icon}
                  labelName={value}
                  disableCloseIcon={true}
                  customClass={styling.labelClass}
                  onClickHandle={() => addSkillToDeleteState(value)}
                />
              ))}
              {filteredValues?.length > 10 && (
                <Labels
                  key="more-label"
                  icon={icon}
                  labelName={`+ ${filteredValues?.length - 10} more`}
                  disableCloseIcon={true}
                  customClass={styling.labelClass}
                />
              )}
            </>
          )}
        </div>
      </Modal>
    </>
  );
};

export { EditValues };
