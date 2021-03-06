import React from "react";
import { DropdownButton, MenuItem } from "react-bootstrap";

const FilterDropdown = ({
  label,
  value,
  valueLabel,
  options,
  handleChange,
}) => {
  return (
    <div className="dropdown" id="filter_parameter_container">
      <DropdownButton
        id="filter_params"
        title={
          <>
            {label} <span id="curr-filter-type">{valueLabel}</span>
          </>
        }
      >
        {options.map((o) => (
          <MenuItem
            id={"filter_option_" + o.id}
            key={o.id}
            eventKey={o.id}
            onSelect={handleChange}
            active={o.id === value}
          >
            {o.label}
          </MenuItem>
        ))}
      </DropdownButton>
    </div>
  );
};

export default FilterDropdown;
