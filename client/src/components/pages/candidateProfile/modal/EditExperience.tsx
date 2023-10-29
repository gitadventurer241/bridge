import { IconEdit } from "@tabler/icons-react";
import { Candidate, Experience } from "../../../../types/types";
import { Button, Input, Modal, Divider } from "antd";
import { useEffect, useState } from "react";
import styling from "./EditExperience.module.css";

interface EditExperienceProps {
  candidate: Candidate;
  setCandidate: (updatedCandidate: Candidate) => void;
  icon?: React.ReactNode;
  titleName?: string;
  onSave?: (arg: Candidate) => void;
  visible: boolean;
  setVisible: (arg: boolean) => void;
  showModal?: () => void;
}

const EditExperience: React.FC<EditExperienceProps> = ({
  candidate,
  icon,
  titleName,
  setCandidate,
  onSave,
  visible,
  setVisible,
  showModal,
}) => {
  const [experience, setExperience] = useState<Experience[]>([]);
  const [currentRole, setCurrentRole] = useState("");
  const [currentIndustries, setCurrentIndustries] = useState("");
  const [currentYearsOfExperience, setCurrentYearsOfExperience] = useState("");
  const [saveDisabled, setSaveDisabled] = useState(true);

  useEffect(() => {
    if (candidate && candidate.experience) {
      setExperience(candidate.experience as Experience[]);
    }
  }, [candidate.experience, candidate]);

  const handleSave = () => {
    const updatedCandidate = { ...candidate, experience: experience };
    setCandidate(updatedCandidate);
    if (onSave) {
      onSave(updatedCandidate);
    }
    setVisible(false);
    setSaveDisabled(true);
  };

  const onCancel = () => {
    setVisible(false);
    setSaveDisabled(true);
  };

  const addExperience = () => {
    if (currentRole && currentIndustries) {
      const newExperience: Experience = {
        role: currentRole,
        industries: currentIndustries,
      };
      if (currentYearsOfExperience) {
        newExperience.years_of_experience = currentYearsOfExperience;
      }
      setExperience((prevExperience) => [...prevExperience, newExperience]);
      setCurrentRole("");
      setCurrentIndustries("");
      setCurrentYearsOfExperience("");
      setSaveDisabled(false);
    }
  };

  const updateExperience = (index: number) => {
    const updatedExperience = [...experience];
    updatedExperience[index] = {
      role: currentRole,
      industries: currentIndustries,
      years_of_experience: currentYearsOfExperience || "",
    };
    setExperience(updatedExperience);
    handleSave();
  };

  // Function to delete experience by index
  const deleteExperience = (index: number) => {
    const updatedExperience = [...experience];
    updatedExperience.splice(index, 1);
    setExperience(updatedExperience);
    setSaveDisabled(false);
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
        title="Edit Experience"
        onCancel={onCancel}
        footer={[
          <Button key="cancel" onClick={onCancel}>
            Cancel
          </Button>,
          <Button
            key="save"
            type="primary"
            onClick={handleSave}
            disabled={saveDisabled}
          >
            Save
          </Button>,
        ]}
      >
        {/* Show current experience */}
        {experience &&
          experience?.map((exp, index) => (
            <div key={index}>
              <Divider>Experience {index + 1}</Divider>
              <h4 className={styling.margin}>Role:</h4>
              <Input
                placeholder="Role"
                value={exp.role}
                onChange={(e) => {
                  const updatedExperience = [...experience];
                  updatedExperience[index].role = e.target.value;
                  setExperience(updatedExperience);
                  setSaveDisabled(false);
                }}
              />
              <div className={styling.row}>
                <div className={styling.rowContainer}>
                  <h4 className={styling.margin}>Industries:</h4>
                  <Input
                    placeholder="Industries"
                    value={exp.industries}
                    onChange={(e) => {
                      const updatedExperience = [...experience];
                      updatedExperience[index].industries = e.target.value;
                      setExperience(updatedExperience);
                      setSaveDisabled(false);
                    }}
                  />
                </div>
                <div className={styling.rowContainer}>
                  <h4 className={styling.margin}>Years of Experience:</h4>
                  <Input
                    placeholder="Years of Experience"
                    value={exp.years_of_experience?.toString() || ""}
                    onChange={(e) => {
                      const updatedExperience = [...experience];
                      updatedExperience[index].years_of_experience =
                        e.target.value;
                      setExperience(updatedExperience);
                      setSaveDisabled(false);
                    }}
                  />
                </div>
              </div>
              <div key={index}>
                {/* ... (other input fields) */}
                <Button
                  className={styling.buttonExperience}
                  onClick={() => updateExperience(index)}
                  type="primary"
                  ghost
                >
                  Update Experience
                </Button>
                <Button
                  className={styling.buttonExperience}
                  onClick={() => deleteExperience(index)}
                  danger
                >
                  Delete Experience
                </Button>
              </div>
            </div>
          ))}
        {experience && experience.length > 0 && <hr />}
        {/* Add new experience */}
        <Divider>Add New Experience</Divider>
        <h4 className={styling.margin}>Role:</h4>
        <Input
          placeholder="Role"
          value={currentRole}
          onChange={(e) => setCurrentRole(e.target.value)}
        />
        <div className={styling.row}>
          <div className={styling.rowContainer}>
            <h4 className={styling.margin}>Industries:</h4>
            <Input
              placeholder="Industries"
              value={currentIndustries}
              onChange={(e) => setCurrentIndustries(e.target.value)}
            />
          </div>
          <div className={styling.rowContainer}>
            <h4 className={styling.margin}>Years of Experience:</h4>
            <Input
              placeholder="Experience. e.g 6 months"
              value={currentYearsOfExperience}
              onChange={(e) => setCurrentYearsOfExperience(e.target.value)}
            />
          </div>
        </div>
        <Button className={styling.buttonExperience} onClick={addExperience}>
          Add Experience
        </Button>
      </Modal>
    </>
  );
};

export { EditExperience };
