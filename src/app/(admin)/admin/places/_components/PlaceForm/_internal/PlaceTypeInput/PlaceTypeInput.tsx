"use client";

import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Icon, PopupLayout, RadioOptionItem, RequiredText } from "@/components";
import { PLACE_TYPE_OPTIONS } from "../../../../_constants/PLACE_TYPE_OPTIONS";
import { PlaceFormValues } from "../../../../_types/PlaceFormValues";

const TYPE_OPTIONS = PLACE_TYPE_OPTIONS.filter((option) => option.value !== "");

interface PlaceTypeInputProps {
  /** 수정 화면에서는 타입을 바꿀 수 없어 비활성화한다. */
  disabled?: boolean;
}

const PlaceTypeInput = ({ disabled }: PlaceTypeInputProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { control, setValue } = useFormContext<PlaceFormValues>();
  const type = useWatch({ control, name: "type" });

  const label = TYPE_OPTIONS.find((option) => option.value === type)?.label ?? "";

  const handleSelect = (value: string) => {
    setValue("type", value as PlaceFormValues["type"], {
      shouldDirty: true,
      shouldValidate: true,
    });
    setIsOpen(false);
  };

  return (
    <>
      <section
        onClick={() => !disabled && setIsOpen(true)}
        className="flex items-center justify-between border-b border-flatGray-50 px-5 py-6"
        aria-disabled={disabled}
      >
        <span className="text-body1-medium text-neutral-normal-default placeholder:text-neutral-normal-placeholder">
          {label || "장소 종류를 선택해 주세요."} {!type && <RequiredText />}
        </span>
        {!disabled && (
          <button type="button" aria-label="장소 종류 선택" className="size-6">
            <Icon name="ArrowDown" size={24} />
          </button>
        )}
      </section>
      {disabled && (
        <p className="px-5 pb-2 text-caption1-regular text-layout-body-default">
          장소 종류는 등록 후 바꿀 수 없습니다. 바꾸려면 삭제 후 새로 등록해주세요.
        </p>
      )}

      <PopupLayout
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        className="w-full gap-8 px-5 py-10 flex-col-center"
      >
        <h2 className="text-h2-medium text-layout-header-default">장소 종류 선택</h2>
        <div className="w-full">
          {TYPE_OPTIONS.map((option) => (
            <RadioOptionItem
              key={option.value}
              option={option}
              selected={type}
              onChange={handleSelect}
              inputName="type"
            />
          ))}
        </div>
      </PopupLayout>
    </>
  );
};

export default PlaceTypeInput;
