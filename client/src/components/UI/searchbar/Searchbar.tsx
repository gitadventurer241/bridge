import React from "react";
import { Input } from "antd";

const { Search } = Input;

interface SearchbarProps {
  placeholder: string;
  width: string | number;
  onSearch: (value: string) => void;
}

const Searchbar: React.FC<SearchbarProps> = ({
  placeholder,
  width,
  onSearch,
}) => (
  <Search
    placeholder={placeholder}
    allowClear
    onSearch={onSearch}
    style={width ? { width: width } : { width: "100%" }}
  />
);

export default Searchbar;
