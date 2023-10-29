import React, { useEffect, useState } from "react";

import { Modal as AntdModal, Input, Select, Divider, AutoComplete } from "antd";
import { Button } from "../../UI/button/Button";
import { Labels } from "../../UI/labels/Label";

import { AllSkill, Job, Skill } from "../../../types/types";

import { getAllSkills } from "../../../api/skills";

import styling from "./AddEditJob.module.css";

const { TextArea } = Input;
const { Option } = Select;

interface ModalProps {
  open: boolean;
  onOk?: (payload: any) => void;
  onCancel: () => void;
  confirmLoading: boolean;
  companyId: string;
  companyValues: string[];
  associations: string[];
  onEdit?: (jobId: string, payload: any) => void;
  job?: Job;
}

const AddEditJob: React.FC<ModalProps> = ({
  open,
  onOk,
  onCancel,
  confirmLoading,
  companyId,
  companyValues,
  associations,
  onEdit,
  job,
}) => {
  // Constants
  const skillLevels = ["beginner", "intermediate", "advanced", "pro"];

  // State
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [hiring_process_duration, setHiringProcessDuration] =
    useState<string>("");
  const [minSalary, setMinSalary] = useState<string>("");
  const [maxSalary, setMaxSalary] = useState<string>("");
  const [location_city, setLocationCity] = useState<string>("");
  const [location_country, setLocationCountry] = useState<string>("");
  const [work_location, setWorkLocation] = useState<string>("");
  const [employment_type, setEmploymentType] = useState<string>("");
  const [selectedHardSkill, setSelectedHardSkill] = useState<string>("");
  const [selectedSoftSkill, setSelectedSoftSkill] = useState<string>("");
  const [selectedSoftSkills, setSelectedSoftSkills] = useState<string[]>([]);
  const [selectedHardSkills, setSelectedHardSkills] = useState<Skill[]>([]);
  const [selectedSkillLevel, setSelectedSkillLevel] = useState<string>("");
  // Initial state of skills
  const [softSkillSource, setSoftSkillSource] = useState<string[]>();
  const [hardSkillSource, setHardSkillSource] = useState<string[]>();
  // Filtered skill through autocomplete
  const [filteredSoftSkills, setFilteredSoftSkills] = useState<string[]>();
  const [filteredHardSkills, setFilteredHardSkills] = useState<string[]>();

  /**
   * Handle the ok button click
   */
  const handleCreate = () => {
    const payload = {
      associations: associations,
      company_id: companyId,
      title: title,
      description: description,
      values: companyValues,
      skills: selectedHardSkills,
      soft_skills: selectedSoftSkills,
      hiring_process_duration: hiring_process_duration,
      matching_candidates: [],
      salary: [minSalary, maxSalary],
      location_city: location_city,
      location_country: location_country,
      work_location: work_location,
      employment_type: employment_type,
    };

    if (job && onEdit) {
      onEdit(job.id, payload);
    } else if (onOk) {
      onOk(payload);
    }
  };

  /**
   * Add a hard skill to the selected skills array
   */
  const addHardSkill = () => {
    if (
      selectedHardSkill &&
      filteredHardSkills?.includes(selectedHardSkill) &&
      !selectedHardSkills.some(
        (skill) => skill.skill_name === selectedHardSkill
      )
    ) {
      const newSkill = {
        skill_name: selectedHardSkill,
        skill_level: selectedSkillLevel,
      };
      setSelectedHardSkills([...selectedHardSkills, newSkill]);
      setSelectedHardSkill("");
    }
  };

  /**
   * Remove a hard skill from the selected skills array
   * @param skillName the name of the skill to remove
   */
  const removeHardSkill = (skillName: string) => {
    setSelectedHardSkills(
      selectedHardSkills?.filter((skill) => skill?.skill_name !== skillName)
    );
  };

  /**
   * Add a hard skill to the selected skills array
   */
  const addSoftSkill = () => {
    if (
      selectedSoftSkill &&
      filteredSoftSkills?.includes(selectedSoftSkill) &&
      !selectedSoftSkills.includes(selectedSoftSkill)
    ) {
      setSelectedSoftSkills([...selectedSoftSkills, selectedSoftSkill]);
      setSelectedSoftSkill("");
    }
  };

  /**
   * Remove a soft skill from the selected skills array
   * @param skillName the name of the skill to remove
   */
  const removeSoftSkill = (selectedSkill: string) => {
    setSelectedSoftSkills(
      selectedSoftSkills?.filter((skill) => skill !== selectedSkill)
    );
  };

  /**
   * Fetches all skills from the server
   */
  const fetchInfo = async () => {
    const allSkills = await getAllSkills();

    const skillsWithCategory = allSkills?.map((skill: AllSkill) => ({
      name: skill.name,
      category: skill.category,
    }));

    // Separate soft and hard skills
    const softSkills = skillsWithCategory.filter(
      (skill: AllSkill) => skill.category === "soft_skill"
    );
    const hardSkills = skillsWithCategory.filter(
      (skill: AllSkill) => skill.category === "hard_skill"
    );

    // Extract just the names for your purposes
    const softSkillNames = softSkills.map((skill: AllSkill) => skill.name);
    const hardSkillNames = hardSkills.map((skill: AllSkill) => skill.name);

    setSoftSkillSource(softSkillNames);
    setHardSkillSource(hardSkillNames);
  };

  /**
   * Fetches all skills on component mount
   */
  useEffect(() => {
    if (job) {
      setTitle(job?.title ?? "");
      setDescription(job?.description ?? "");
      setHiringProcessDuration(job?.hiring_process_duration ?? "");
      setMinSalary(job?.salary?.map((salary) => salary)[0] ?? "");
      setMaxSalary(job?.salary?.map((salary) => salary)[1] ?? "");
      setLocationCity(job?.location_city ?? "");
      setLocationCountry(job?.location_country ?? "");
      setWorkLocation(job?.work_location ?? "");
      setEmploymentType(job?.employment_type ?? "");
      setSelectedHardSkills(job?.skills ?? []);
      setSelectedSoftSkills(job?.soft_skills ?? []);
    }
    fetchInfo();
  }, [job]);

  return (
    <AntdModal
      className={styling.modal}
      open={open}
      onOk={handleCreate}
      onCancel={onCancel}
      confirmLoading={confirmLoading}
      okText={job ? "Save" : "Create"}
    >
      <h2 className={styling.header}>Create new job</h2>
      <Divider>Job Info</Divider>
      <Input
        className={styling.input}
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextArea
        className={styling.description}
        placeholder="Description. Max 10000 characters"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className={styling.twoColumn}>
        <div className={styling.sider}>
          <Divider>Hard Skills</Divider>
          <div className={styling.autocomplete}>
            <AutoComplete
              placeholder="Search for skills"
              value={selectedHardSkill}
              options={filteredHardSkills?.map((skill) => ({ value: skill }))}
              onSelect={(value) => {
                setSelectedHardSkill(value);
              }}
              style={{ width: "100%" }}
              popupClassName="scrollable-dropdown"
              popupMatchSelectWidth={false}
              onSearch={(searchText) => {
                setSelectedHardSkill(searchText);
                if (searchText === "") {
                  setFilteredHardSkills(hardSkillSource);
                } else {
                  const filterSkills = hardSkillSource?.filter((skill) =>
                    skill.toLowerCase().includes(searchText.toLowerCase())
                  );
                  setFilteredHardSkills(filterSkills);
                }
              }}
              onBlur={() => {
                if (!selectedHardSkill) {
                  // When the input field is cleared, reset the filteredSkills to the initial options
                  setFilteredHardSkills(hardSkillSource);
                }
              }}
            />
            <Select
              placeholder="Skill Level"
              value={selectedSkillLevel}
              onChange={(value) => setSelectedSkillLevel(value)}
              style={{ width: "100%" }}
            >
              {skillLevels.map((level) => (
                <Option key={level} value={level}>
                  {level}
                </Option>
              ))}
            </Select>

            <Button onClick={addHardSkill}>Add</Button>
          </div>
          <div className={styling.labelContainer}>
            {selectedHardSkills?.map((skill: any, index: number) => (
              <Labels
                key={index}
                customClass={styling.label}
                labelName={`${skill?.skill_name} | ${skill?.skill_level}`}
                onCloseIcon={() => removeHardSkill(skill?.skill_name)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className={styling.twoColumn}>
        <div className={styling.sider}>
          <Divider>Soft skills</Divider>
          <div className={styling.autocomplete}>
            <AutoComplete
              placeholder="Search for skills"
              value={selectedSoftSkill}
              options={filteredSoftSkills?.map((skill) => ({ value: skill }))}
              onSelect={(value) => {
                setSelectedSoftSkill(value);
              }}
              style={{ width: "100%" }}
              popupClassName="scrollable-dropdown"
              popupMatchSelectWidth={false}
              onSearch={(searchText) => {
                setSelectedSoftSkill(searchText);
                if (searchText === "") {
                  setFilteredSoftSkills(softSkillSource);
                } else {
                  const filterSkills = softSkillSource?.filter((skill) =>
                    skill.toLowerCase().includes(searchText.toLowerCase())
                  );
                  setFilteredSoftSkills(filterSkills);
                }
              }}
              onBlur={() => {
                if (!selectedSoftSkill) {
                  // When the input field is cleared, reset the filteredSkills to the initial options
                  setFilteredSoftSkills(softSkillSource);
                }
              }}
            />

            <Button onClick={addSoftSkill}>Add</Button>
          </div>
          <div className={styling.labelContainer}>
            {selectedSoftSkills?.map((skill: any, index: number) => (
              <Labels
                key={index}
                customClass={styling.label}
                labelName={skill}
                onCloseIcon={() => removeSoftSkill(skill)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className={styling.twoColumn}>
        <div className={styling.sider}>
          <Divider>Job details</Divider>
          <p className={styling.sectionName}>Employment type:</p>
          <Select
            className={styling.dropdown}
            placeholder="Employment Type"
            value={employment_type}
            onChange={(value) => setEmploymentType(value)}
          >
            <Option value="Full time">Full time</Option>
            <Option value="Part time">Part time</Option>
            <Option value="Internship">Internship</Option>
          </Select>

          <p className={styling.sectionName}>Hiring process duration:</p>
          <Input
            className={styling.input}
            placeholder="Hiring Process Duration"
            value={hiring_process_duration}
            onChange={(e) => setHiringProcessDuration(e.target.value)}
          />

          <p className={styling.sectionName}>Annual salary:</p>
          <div className={styling.salary}>
            <Input
              className={styling.input}
              placeholder="Minimum Salary e.g 50'000"
              value={minSalary}
              onChange={(e) => setMinSalary(e.target.value)}
            />
            <Input
              className={styling.input}
              placeholder="Maximum Salary e.g 100'000"
              value={maxSalary}
              onChange={(e) => setMaxSalary(e.target.value)}
            />
          </div>
        </div>

        <div className={styling.sider}>
          <Divider>Location</Divider>
          <p className={styling.sectionName}>Work location:</p>
          <Select
            className={styling.dropdown}
            placeholder="Work Location"
            value={work_location}
            onChange={(value) => setWorkLocation(value)}
          >
            <Option value="On site">On site</Option>
            <Option value="Hybrid">Hybrid</Option>
            <Option value="Remote">Remote</Option>
          </Select>

          <p className={styling.sectionName}>City:</p>
          <Select
            className={styling.input}
            placeholder="City"
            value={location_city}
            onChange={(e) => setLocationCity(e)}
            style={{ minWidth: "100%" }}
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

          <p className={styling.sectionName}>Country:</p>
          <Input
            className={styling.input}
            placeholder="Country"
            value={location_country}
            onChange={(e) => setLocationCountry(e.target.value)}
          />
        </div>
      </div>
    </AntdModal>
  );
};

export default AddEditJob;
