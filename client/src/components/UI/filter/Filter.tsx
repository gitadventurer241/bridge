import { Select } from "antd";
import { useEffect, useState } from "react";

const { Option } = Select;

interface FilterProps {
  options: string[];
  data: any[];
  criteria: string;
  placeholder: string;
  onFilterChange: (filteredData: any[]) => void;
}

const Filter = ({
  options,
  data,
  criteria,
  placeholder,
  onFilterChange,
}: FilterProps) => {
  const [selectedCriteria, setSelectedCriteria] = useState<string[]>([]);

  const handleChange = (value: any) => {
    setSelectedCriteria(value);
  };

  const filterData = (filteredCriteria: string[]) => {
    const filteredData =
      filteredCriteria.length === 0
        ? data
        : data.filter((item) => {
            if (item[criteria] && criteria === "iniciatives") {
              if (
                item[criteria].some((field: any) =>
                  selectedCriteria.includes(field.title)
                )
              ) {
                return item;
              }
            } else if (
              item[criteria] &&
              (criteria === "associations" || criteria === "values")
            ) {
              if (
                item[criteria].some((field: any) =>
                  selectedCriteria.includes(field)
                )
              ) {
                return item;
              }
            } else if (item[criteria]) {
              if (selectedCriteria.includes(item[criteria])) {
                return item;
              }
            } else {
              return false;
            }
          });

    onFilterChange(filteredData);
  };

  useEffect(() => {
    filterData(selectedCriteria);
  }, [selectedCriteria]);

  return (
    <div className="filter">
      <Select
        mode="multiple"
        style={{ minWidth: 200 }}
        placeholder={placeholder}
        value={selectedCriteria}
        onChange={handleChange}
        maxTagCount={3}
        maxTagTextLength={10}
        dropdownStyle={{ maxHeight: 200, overflowY: "auto" }}
      >
        {options.map((option) => (
          <Option key={option} value={option}>
            {option}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default Filter;
