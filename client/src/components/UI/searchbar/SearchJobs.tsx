import React, { useState } from "react";
import { Input } from "antd";
import { Company, Job } from "../../../types/types";
const { Search } = Input;

interface SearchJobsProps {
  onSearch: (results: (Company | Job)[]) => void;
  data: (Company | Job)[];
}

interface SearchableField {
  title?: string;
  work_location?: string;
  employment_type?: string;
  location_city?: string;
  salary?: string;
}

const SearchJobs: React.FC<SearchJobsProps> = ({ onSearch, data }) => {
  const [searchValue, setSearchValue] = useState<string>("");

  const keys: (keyof SearchableField)[] = [
    "title",
    "work_location",
    "location_city",
    "salary",
    "employment_type",
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchValue(value);
    const result = data.filter((item) =>
      keys.some((key) => {
        const fieldValue = (item as SearchableField)[key];
        return (
          typeof fieldValue === "string" &&
          fieldValue.toLowerCase().includes(value.toLowerCase())
        );
      })
    );
    onSearch(result);
  };

  return (
    <div>
      <Search
        placeholder="Search..."
        allowClear
        value={searchValue}
        onChange={handleSearchChange}
      />
    </div>
  );
};

export default SearchJobs;
