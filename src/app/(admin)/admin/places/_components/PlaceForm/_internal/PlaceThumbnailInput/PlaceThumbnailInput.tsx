"use client";

import { useRef } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Icon } from "@/components";
import { PlaceFormValues } from "../../../../_types/PlaceFormValues";

/** 등록/수정 폼의 썸네일 첨부 입력입니다. 새로 고른 파일이 있으면 미리보기를, 없으면 기존 썸네일을 보여줍니다. */
const PlaceThumbnailInput = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setValue, control } = useFormContext<PlaceFormValues>();

  const thumbnail = useWatch({ control, name: "thumbnail" });
  const existingThumbnailUrl = useWatch({ control, name: "existingThumbnailUrl" });

  const previewUrl = thumbnail ? URL.createObjectURL(thumbnail) : existingThumbnailUrl || null;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue("thumbnail", file, { shouldDirty: true });
    }
  };

  return (
    <div className="flex flex-col gap-2 px-5 py-6">
      <p className="text-body2-medium text-layout-header-default">
        썸네일 <span className="text-system-warning">*</span>
      </p>

      <input
        type="file"
        accept="image/png, image/jpeg, image/jpg"
        className="hidden"
        ref={fileInputRef}
        onChange={handleChange}
      />

      <button
        type="button"
        aria-label="썸네일 선택"
        onClick={() => fileInputRef.current?.click()}
        className="relative size-[104px] overflow-hidden rounded-[6px] bg-flatGray-25 flex-col-center"
      >
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewUrl} alt="썸네일 미리보기" className="h-full w-full object-cover" />
        ) : (
          <Icon name="Camera" size={32} className="text-neutralInversed-strong-default" />
        )}
      </button>
      <span className="text-caption1-regular text-neutral-normal-placeholder">
        수정 시 선택하지 않으면 기존 썸네일을 그대로 씁니다.
      </span>
    </div>
  );
};

export default PlaceThumbnailInput;
