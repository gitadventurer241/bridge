import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { Company, Job } from "../../../types/types";
import { IconFilter } from "@tabler/icons-react";
const { Option, OptGroup } = Select;

interface multiOptionProps {
  onSearch: (results: (Company | Job)[]) => void;
  data: (Company | Job)[];
  onSelectChange: (selectedValues: string[]) => void;
  selectedValues: string[];
  filterData: (
    selectedOptions: string[],
    data: (Company | Job)[]
  ) => (Company | Job)[];
}

const FilterSelect: React.FC<multiOptionProps> = ({
  data,
  onSearch,
  onSelectChange,
  selectedValues,
  filterData,
}) => {
  const filterGroups = [
    {
      groupName: "Employment Types",
      key: "employment_type",
      options: [
        { value: "Full Time", label: "Full Time" },
        { value: "Part Time", label: "Part Time" },
        { value: "Internship", label: "Internship" },
        { value: "Contract", label: "Contract" },
        { value: "Temporary", label: "Temporary" },
        { value: "Freelance", label: "Freelance" },
      ],
    },
    {
      groupName: "Work Locations",
      key: "work_location",
      options: [
        { value: "Remote", label: "Remote" },
        { value: "Hybrid", label: "Hybrid" },
        { value: "On-site", label: "On-site" },
      ],
    },
  ];
  const [internalSelectedOptions, setInternalSelectedOptions] =
    useState<string[]>(selectedValues);

  useEffect(() => {
    setInternalSelectedOptions(selectedValues);
  }, [selectedValues]);

  const handleSelectChange = (selectedValues: string[]) => {
    setInternalSelectedOptions(selectedValues);
    const selectedFilters = filterData(selectedValues, data);
    onSearch(selectedFilters);
    onSelectChange(selectedValues);
  };

  return (
    <Select
      style={{ width: 200 }}
      showSearch
      placeholder="Select a value"
      optionFilterProp="children"
      mode="multiple"
      onChange={handleSelectChange}
      value={internalSelectedOptions}
      maxTagCount={1}
      suffixIcon={<IconFilter />}
    >
      {filterGroups.map((group) => (
        <OptGroup label={group.groupName} key={group.key}>
          {group.options.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </OptGroup>
      ))}
    </Select>
  );
};

export default FilterSelect;
