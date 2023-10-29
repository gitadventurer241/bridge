import React from "react";
import { Labels } from "../labels/Label";
import styles from "../../UI/labels/Label.module.css";
import { Company, Job } from "../../../types/types";

interface DisplayMultiFilterProps {
  selectedValues: string[];
  onSelectChange: (selectedValues: string[]) => void;
  data: (Company | Job)[];
  onSearch: (results: (Company | Job)[]) => void;
  filterData: (
    selectedValues: string[],
    data: (Company | Job)[]
  ) => (Company | Job)[];
}

const DisplayMultiFilter: React.FC<DisplayMultiFilterProps> = ({
  selectedValues,
  onSelectChange,
  onSearch,
  data,
  filterData,
}) => {
  const handleLabelClose = (valueToRemove: string) => {
    const updatedSelectedValues = selectedValues.filter(
      (value) => value !== valueToRemove
    );
    onSelectChange(updatedSelectedValues);
    const selectedFilters = filterData(updatedSelectedValues, data);
    onSearch(selectedFilters);
  };

  const clearAllLabels = () => {
    onSelectChange([]);
    onSearch(data);
  };

  return (
    <>
      {selectedValues.map((value) => (
        <Labels
          key={value}
          labelName={value}
          customClass={styles.label}
          onCloseIcon={() => handleLabelClose(value)}
        />
      ))}
      {selectedValues.length > 0 && (
        <button onClick={clearAllLabels}>Clear All</button>
      )}
    </>
  );
};

export default DisplayMultiFilter;
