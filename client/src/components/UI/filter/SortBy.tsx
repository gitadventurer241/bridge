import React, { useState } from 'react';
import { Select } from 'antd';
const { Option } = Select;

interface SortByProps {
  onChange: (value: string) => void;
}

const SortBy: React.FC<SortByProps> = ({ onChange }) => {
    const [sortOrder, setSortOrder] = useState<string | undefined>(undefined);
    const handleSortChange = (value: string) => {
    setSortOrder(value);
    onChange(value);
  };

  return (
    <div>
      <span>Sort by date: </span>
      <Select
        defaultValue="Date"
        style={{ width: 120 }}
        onChange={handleSortChange}
        placeholder="Date"
      >
        <Option value="asc">Ascending</Option>
        <Option value="desc">Descending</Option>
      </Select>
    </div>
  );
};

export default SortBy;
