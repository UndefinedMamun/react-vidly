import React from "react";

const Search = ({ onChange, value }) => {
  return (
    <input
      type="text"
      className="form-control my-3"
      placeholder="Search"
      onChange={e => onChange(e.currentTarget.value)}
      value={value}
    />
  );
};

export default Search;
