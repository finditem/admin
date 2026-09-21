"use client";

import { Icon } from "@/components/common";
import { BaseButtonProps } from "./BaseButtonPropsType";

const Search = ({ ariaLabel, ...props }: BaseButtonProps) => {
  return (
    <button {...props} aria-label={ariaLabel ?? "검색"}>
      <Icon name="Search" className="text-flatGray-900" />
    </button>
  );
};

export default Search;
