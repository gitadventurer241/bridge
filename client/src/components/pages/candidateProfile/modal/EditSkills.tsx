import React, { useEffect, useState } from "react";
import { Button, Modal, Input, Select } from "antd";
import { IconEdit } from "@tabler/icons-react";
import { Labels } from "../../../UI/labels/Label";
import styling from "./EditSkills.module.css";
import { AllSkill, Candidate, Skill } from "../../../../types/types";

const { Option } = Select;

interface EditSkillsProps {
  candidate: Candidate;
  setCandidate: (updatedCandidate: Candidate) => void;
  icon: React.ReactNode;
  titleName: string;
  allHardSkills: AllSkill[];
  allSoftSkills: string[];
  onSave?: (arg: Candidate) => void;
  visible: boolean;
  setVisible: (arg: boolean) => void;
  showModal: () => void;
}

const EditSkills: React.FC<EditSkillsProps> = ({
  candidate,
  icon,
  titleName,
  setCandidate,
  allHardSkills,
  allSoftSkills,
  onSave,
  visible,
  setVisible,
  showModal,
}) => {
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchSoftSkills, setSearchSoftSkills] = useState("");
  const [candidateHardSkills, setCandidateHardSkills] = useState<Skill[]>([]);
  const [candidateSoftSkills, setCandidateSoftSkills] = useState<string[]>([]);
  const [filteredSkills, setFilteredSkills] = useState<AllSkill[]>([]);
  const [filteredSoftSkills, setFilteredSoftSkills] = useState<string[]>([]);

  const fetchSkills = async () => {
    setCandidateHardSkills(candidate?.skills as Skill[]);
    setCandidateSoftSkills(candidate?.soft_skills as string[]);

    const hardSkills = (allHardSkills as AllSkill[])?.filter(
      (skill) => skill?.category === "hard_skill"
    );
    const softSkills = (allHardSkills as AllSkill[])?.filter(
      (skill) => skill?.category === "soft_skill"
    );
    if (!candidate?.skills) {
      setFilteredSkills(hardSkills);
    } else {
      // Filter out the candidate's skills from hardSkills
      const filteredHardSkills = hardSkills?.filter(
        (skill) =>
          !candidateHardSkills?.some(
            (cSkill) => cSkill?.skill_name === skill?.name
          )
      );
      setFilteredSkills(filteredHardSkills);
    }
    if (!candidate?.soft_skills) {
      setFilteredSoftSkills(softSkills?.map((skill) => skill?.name));
    } else {
      // Filter out the candidate's skills from softSkills
      const filteredSoftSkills = softSkills?.filter(
        (skill) => !candidateSoftSkills.includes(skill?.name)
      );
      setFilteredSoftSkills(filteredSoftSkills.map((skill) => skill?.name));
    }
    updateFilteredSkills(candidate?.skills as Skill[]);
    updateFilteredSoftSkills(candidate?.soft_skills as string[]);
  };

  useEffect(() => {
    fetchSkills();
  }, [candidate, allHardSkills]);

  const handleSearchTextChange = (searchText: string) => {
    setSearchText(searchText);
    updateFilteredSkills(candidateHardSkills, searchText);
  };

  const handleSearchSoftSkills = (searchText: string) => {
    setSearchSoftSkills(searchText);
    updateFilteredSoftSkills(candidateSoftSkills, searchText);
  };

  const updateFilteredSkills = (
    skillsToDelete?: Skill[],
    searchText?: string
  ) => {
    if (skillsToDelete) {
      const updatedFilteredSkills = allHardSkills?.filter((skill) => {
        const isSkillInCandidate = skillsToDelete?.every(
          (candidateSkill) => candidateSkill?.skill_name !== skill?.name
        );
        if (!searchText) {
          return isSkillInCandidate;
        }
      });
      setFilteredSkills(updatedFilteredSkills);
    }
    if (searchText) {
      const updatedFilteredSkills = filteredSkills?.filter((skill) => {
        return (
          skill?.name?.toLowerCase().startsWith(searchText.toLowerCase()) ||
          skill?.name?.toLowerCase().includes(searchText.toLowerCase())
        );
      });
      setFilteredSkills(updatedFilteredSkills);
    }
  };

  const handleCloseHardSkill = (skillToRemove: string) => {
    const updatedSkills = candidateHardSkills.filter(
      (skill) => skill?.skill_name !== skillToRemove
    );
    setCandidateHardSkills(updatedSkills as Skill[]);
    updateFilteredSkills(updatedSkills);
  };

  const updateFilteredSoftSkills = (
    skillsToDelete?: string[],
    searchText?: string
  ) => {
    if (skillsToDelete) {
      const updatedFilteredSkills = allSoftSkills?.filter((skill) => {
        const isSkillInCandidate = skillsToDelete?.every(
          (candidateSkill) => candidateSkill !== skill
        );
        if (!searchText) {
          return isSkillInCandidate;
        }
      });
      setFilteredSoftSkills(updatedFilteredSkills);
    }
    if (searchText) {
      const updatedFilteredSkills = filteredSoftSkills?.filter((skill) => {
        return (
          skill?.toLowerCase().startsWith(searchText.toLowerCase()) ||
          skill?.toLowerCase().includes(searchText.toLowerCase())
        );
      });
      setFilteredSoftSkills(updatedFilteredSkills);
    }
  };

  const handleCloseSoftSkill = (skillToRemove: string) => {
    const updatedSkills = candidateSoftSkills.filter(
      (skill) => skill !== skillToRemove
    );
    setCandidateSoftSkills(updatedSkills as string[]);
    updateFilteredSoftSkills(updatedSkills);
  };

  const addSoftSkillToCandidateSkills = (skillToAdd: string) => {
    // Check if candidateHardSkills is not empty
    if (candidateSoftSkills && skillToAdd) {
      const updatedSkills = [...candidateSoftSkills, skillToAdd];
      setCandidateSoftSkills(updatedSkills);
      updateFilteredSoftSkills(updatedSkills);
    } else {
      // If it's empty, initialize candidateHardSkills with an array containing the skillToAdd
      setCandidateSoftSkills([skillToAdd]);
      updateFilteredSoftSkills([skillToAdd]);
    }
  };

  const addSkillToCandidateSkills = (skillToAdd: AllSkill) => {
    // Check if candidateHardSkills is not empty
    const candidateSkill: Skill = {
      skill_id: "",
      skill_name: skillToAdd?.name,
      skill_level: "",
    };

    if (candidateHardSkills) {
      const updatedSkills = [...candidateHardSkills, candidateSkill];
      setCandidateHardSkills(updatedSkills);
      updateFilteredSkills(updatedSkills);
    } else {
      // If it's empty, initialize candidateHardSkills with an array containing the skillToAdd
      setCandidateHardSkills([candidateSkill]);
      updateFilteredSkills([candidateSkill]);
    }
  };

  const handleOk = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setVisible(false);
      setCandidate({
        ...candidate,
        skills: candidateHardSkills,
        soft_skills: candidateSoftSkills,
      });
      onSave &&
        onSave({
          ...candidate,
          skills: candidateHardSkills,
          soft_skills: candidateSoftSkills,
        } as Candidate);
      setSearchText("");
    }, 300);
  };

  const handleCancel = () => {
    setVisible(false);
    setCandidateHardSkills(candidate?.skills as Skill[]);
    setFilteredSkills(allHardSkills);
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
        style={{ minWidth: "1000px" }}
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
        <div className={styling.editSkillsDiv}>
          {/* Candidates skills */}
          <div className={styling.candidateSkills}>
            {/* Candidates hard skills */}
            <div className={styling.candidateHardSkills}>
              {candidateHardSkills &&
                candidateHardSkills?.map((skill, index) => (
                  <div className={styling.row} key={index}>
                    <Labels
                      icon={icon}
                      labelName={skill.skill_name}
                      onCloseIcon={() => handleCloseHardSkill(skill.skill_name)}
                      disableCloseIcon={false}
                      customClass={styling.labelClassSelected}
                    />
                    <Select
                      style={{ width: "50%" }}
                      placeholder="Select skill level"
                      defaultValue={skill.skill_level}
                      onChange={(value) => {
                        const updatedSkills = candidateHardSkills?.map((item) =>
                          item.skill_name === skill.skill_name
                            ? { ...item, skill_level: value }
                            : item
                        );
                        setCandidateHardSkills(updatedSkills);
                      }}
                    >
                      <Option value="beginner">🌱 Beginner</Option>
                      <Option value="intermediate">🌟 Intermediate</Option>
                      <Option value="advanced">🚀 Advanced</Option>
                      <Option value="pro">🌌 Pro</Option>
                    </Select>
                  </div>
                ))}
            </div>
            {/* Candidates soft skills */}
            <div className={styling.candidateSoftSkills}>
              {/* Candidate soft skills */}
              {candidateSoftSkills &&
                candidateSoftSkills?.length > 0 &&
                candidateSoftSkills?.map((skill, index) => (
                  <div className={styling.row} key={index}>
                    <Labels
                      icon={icon}
                      labelName={skill}
                      onCloseIcon={() => handleCloseSoftSkill(skill)}
                      disableCloseIcon={false}
                      customClass={styling.labelClassSelected}
                    />
                  </div>
                ))}
            </div>
          </div>
          {/* All skills */}
          <div className={styling.allSkills}>
            {/* Search bar Hard skills */}
            <div className={styling.hardSkillDiv}>
              <Input
                className={styling.searchInput}
                style={{ width: "100%" }}
                placeholder="Search Hard Skills"
                value={searchText}
                onChange={(e) => handleSearchTextChange(e.target.value)}
              />
              {/* Hard Skills */}
              <h3>Hard Skills</h3>
              <div className={styling.elementInOneRow}>
                {filteredSkills && (
                  <>
                    {filteredSkills?.slice(0, 10).map((skill, index) => (
                      <Labels
                        key={index}
                        icon={icon}
                        labelName={skill.name}
                        disableCloseIcon={true}
                        customClass={styling.labelHardSkill}
                        onClickHandle={() => addSkillToCandidateSkills(skill)}
                      />
                    ))}
                    {filteredSkills?.length > 10 && (
                      <Labels
                        key="more-label"
                        labelName={`+ ${filteredSkills.length - 10} more`}
                        customClass={styling.labelHardSkill}
                        disableCloseIcon={true}
                      />
                    )}
                  </>
                )}
              </div>
            </div>
            {/* Soft skills */}
            {/* Search bar Soft skills */}
            <div className={styling.softSkillDiv}>
              <Input
                className={styling.searchInput}
                style={{ width: "100%" }}
                placeholder="Search Soft Skills"
                value={searchSoftSkills}
                onChange={(e) => handleSearchSoftSkills(e.target.value)}
              />
              <h3>Soft Skills</h3>
              <div className={styling.elementInOneRow}>
                {filteredSoftSkills && (
                  <>
                    {filteredSoftSkills?.slice(0, 10).map((skill, index) => (
                      <Labels
                        key={index}
                        icon={icon}
                        labelName={skill}
                        disableCloseIcon={true}
                        customClass={styling.labelSoftSkill}
                        onClickHandle={() =>
                          addSoftSkillToCandidateSkills(skill)
                        }
                      />
                    ))}
                    {filteredSoftSkills?.length > 10 && (
                      <Labels
                        key="more-label"
                        labelName={`+ ${filteredSkills.length - 10} more`}
                        customClass={styling.labelSoftSkill}
                        disableCloseIcon={true}
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export { EditSkills };
