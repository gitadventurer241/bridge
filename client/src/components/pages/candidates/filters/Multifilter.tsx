import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { IconFilter } from "@tabler/icons-react";
import { Candidate } from "../../../../types/types";

const { Option, OptGroup } = Select;

interface MultiFilterProps {
  data: Candidate[];
  skillsOptions: string[];
  softSkillsOptions: string[];
  valuesOptions: string[];
  selectedValues: string[];
  onFilterChange: (
    filteredCandidates: Candidate[],
    selectedValues: string[]
  ) => void;
}

const MultiFilter: React.FC<MultiFilterProps> = ({
  data,
  skillsOptions,
  softSkillsOptions,
  valuesOptions,
  selectedValues,
  onFilterChange,
}) => {
  const [newSelectedValues, setNewSelectedValues] = useState<string[]>([]);
  const [internalSelectedValues, setInternalSelectedValues] = useState<
    string[]
  >([]);

  useEffect(() => {
    if (selectedValues) {
      setInternalSelectedValues(selectedValues);
      setNewSelectedValues(selectedValues);
    }

    setInternalSelectedValues(newSelectedValues);
    setNewSelectedValues(newSelectedValues);
    filterCandidatesBySelection(newSelectedValues);
  }, [newSelectedValues]);

  const handleSelectChange = (newSelectedValues: string[]) => {
    setNewSelectedValues(newSelectedValues);
  };

  const filterCandidatesBySelection = (selectedValues: string[]) => {
    const filteredCandidates = data.filter((candidate) => {
      return selectedValues.every(
        (value) =>
          candidate.skills?.some(
            (skill) => skill.skill_name.toLowerCase() === value.toLowerCase()
          ) ||
          candidate?.soft_skills?.some(
            (softSkill) => softSkill.toLowerCase() === value.toLowerCase()
          ) ||
          candidate?.values?.some(
            (candidateValue) =>
              candidateValue.toLowerCase() === value.toLowerCase()
          )
      );
    });

    onFilterChange(filteredCandidates, selectedValues);
  };

  return (
    <Select
      style={{ width: 200 }}
      showSearch
      placeholder="Select filters"
      optionFilterProp="children"
      mode="multiple"
      onChange={handleSelectChange}
      defaultValue={internalSelectedValues}
      maxTagCount={1}
      suffixIcon={<IconFilter />}
    >
      <OptGroup label="Skills">
        {skillsOptions.map((option: string, index: number) => (
          <Option key={`skill_${index}`} value={option}>
            {option}
          </Option>
        ))}
      </OptGroup>
      <OptGroup label="Soft Skills">
        {softSkillsOptions.map((option: string) => (
          <Option key={option} value={option}>
            {option}
          </Option>
        ))}
      </OptGroup>
      <OptGroup label="Values">
        {valuesOptions.map((option: string) => (
          <Option key={option} value={option}>
            {option}
          </Option>
        ))}
      </OptGroup>
    </Select>
  );
};

export default MultiFilter;
