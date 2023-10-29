import React, { useEffect, useState } from "react";
import { Button, Modal, Input } from "antd";
import { IconEdit } from "@tabler/icons-react";
import { Labels } from "../../../UI/labels/Label";
import styling from "./EditTypeOfJobs.module.css";
import { Candidate } from "../../../../types/types";

interface TypeOfJobs {
  job_name: string;
  job_id: string;
}

interface EditTypeOfJobsProps {
  candidate: Candidate;
  setCandidate: (updatedCandidate: Candidate) => void;
  icon: React.ReactNode;
  titleName: string;
  allLabels: string[];
  onSave?: (arg: Candidate) => void;
  visible: boolean;
  setVisible: (arg: boolean) => void;
  showModal?: () => void;
}

const EditTypeOfJobs: React.FC<EditTypeOfJobsProps> = ({
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
  const [candidateLabels, setCandidateLabels] = useState<string[]>([]);
  const [filteredTypeOfJobs, setFilteredTypeOfJobs] = useState<string[]>([]);

  useEffect(() => {
    setCandidateLabels(candidate?.preferred_jobs as string[]);
    updateFilteredTypeOfJobs(candidate?.preferred_jobs as string[]);

    if (candidate?.preferred_jobs && candidate?.preferred_jobs?.length > 0) {
      // Filter out values that are already in candidate.values
      const filteredTypeOfJobs = allLabels.filter(
        (label) => !candidate?.preferred_jobs?.includes(label)
      );
      setFilteredTypeOfJobs(filteredTypeOfJobs);
    } else {
      // If candidate.values is empty, set filteredValues to allLabels
      setFilteredTypeOfJobs(allLabels);
    }
  }, [candidate, allLabels]);

  const handleSearchTextChange = (searchText: string) => {
    setSearchText(searchText);
    updateFilteredTypeOfJobs(candidateLabels, searchText);
  };

  const updateFilteredTypeOfJobs = (
    jobsToDelete: string[],
    searchText?: string
  ) => {
    if (jobsToDelete?.length > 0) {
      const updatedFilteredTypeOfJobss = allLabels?.filter((job) => {
        const isValueInCandidate = jobsToDelete?.every(
          (candidateValue) => candidateValue !== job
        );
        if (!searchText) {
          return isValueInCandidate;
        }
      });
      setFilteredTypeOfJobs(updatedFilteredTypeOfJobss);
    }
    if (searchText) {
      const updatedFilteredTypeOfJobss = filteredTypeOfJobs?.filter((job) =>
        job.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredTypeOfJobs(updatedFilteredTypeOfJobss);
    }
  };

  const handleCloseTypeOfJobs = (valueToRemove: string) => {
    const updatedTypeOfJobs = candidateLabels?.filter(
      (job) => job !== valueToRemove
    );
    setCandidateLabels(updatedTypeOfJobs);
    updateFilteredTypeOfJobs(updatedTypeOfJobs);
  };

  const addSkillToDeleteState = (jobToAdd: string) => {
    // Check if candidateLabels is not empty
    if (candidateLabels) {
      const updatedTypeOfJobss = [...candidateLabels, jobToAdd];
      setCandidateLabels(updatedTypeOfJobss);
      updateFilteredTypeOfJobs(updatedTypeOfJobss);
    } else {
      // If it's empty, initialize candidateLabels with an array containing the skillToAdd
      setCandidateLabels([jobToAdd]);
      updateFilteredTypeOfJobs([jobToAdd]);
    }
  };

  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setVisible(false);
      setCandidate({ ...candidate, preferred_jobs: candidateLabels });
      onSave &&
        onSave({
          ...candidate,
          preferred_jobs: candidateLabels,
        } as Candidate);
      setSearchText("");
    }, 300);
  };

  const handleCancel = () => {
    setVisible(false);
    setCandidateLabels(candidate?.preferred_jobs as string[]);
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
            candidateLabels?.map((job, index) => (
              <Labels
                key={index}
                icon={icon}
                labelName={job}
                onCloseIcon={() => handleCloseTypeOfJobs(job)}
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
        <div className={styling.elementInOneRow}>
          {filteredTypeOfJobs &&
            filteredTypeOfJobs?.map((job, index) => (
              <Labels
                key={index}
                icon={icon}
                labelName={job}
                disableCloseIcon={true}
                customClass={styling.labelClass}
                onClickHandle={() => addSkillToDeleteState(job)}
              />
            ))}
        </div>
      </Modal>
    </>
  );
};

export { EditTypeOfJobs };
