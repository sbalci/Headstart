import React from "react";

const SearchLang = ({ children: value }) => {
  return (
    // html template starts here
    <span id="search_lang" className="context_item">
      {value}
    </span>
    // html template ends here
  );
};

export default SearchLang;
