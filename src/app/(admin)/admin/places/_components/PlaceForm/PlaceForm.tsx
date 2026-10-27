"use client";

import { UseFormReturn, useWatch } from "react-hook-form";
import { InputText, WriteActionSection } from "@/components";
import { PlaceFormValues } from "../../_types/PlaceFormValues";
import PlaceTypeInput from "./_internal/PlaceTypeInput/PlaceTypeInput";
import PlaceThumbnailInput from "./_internal/PlaceThumbnailInput/PlaceThumbnailInput";
import WeeklyScheduleInput from "./_internal/WeeklyScheduleInput/WeeklyScheduleInput";

const canSubmit = (values: PlaceFormValues): boolean => {
  const basicFieldsFilled = Boolean(
    values.type &&
    values.name.trim() &&
    values.address.trim() &&
    values.latitude &&
    values.longitude &&
    values.station.trim() &&
    values.stationDistanceMeters &&
    (values.thumbnail || values.existingThumbnailUrl)
  );

  const scheduleFilled = values.weeklySchedules.every(
    (schedule) => schedule.isClosed || (schedule.businessStart && schedule.businessEnd)
  );

  const popupPeriodFilled =
    values.type !== "POPUP" || (values.operationStartDate && values.operationEndDate);

  return basicFieldsFilled && scheduleFilled && Boolean(popupPeriodFilled);
};

interface PlaceFormProps {
  methods: UseFormReturn<PlaceFormValues>;
  mode: "create" | "edit";
  onSubmit: (values: PlaceFormValues) => void;
  isPending: boolean;
}

const PlaceForm = ({ methods, mode, onSubmit, isPending }: PlaceFormProps) => {
  const values = useWatch({ control: methods.control });
  const isSubmitDisabled = !canSubmit(values as PlaceFormValues) || isPending;
  const isEdit = mode === "edit";

  return (
    <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col h-base">
      <PlaceTypeInput disabled={isEdit} />

      <div className="flex flex-col gap-4 border-b border-flatGray-50 px-5 py-6">
        <InputText
          label="이름"
          inputOption={{
            name: "name",
            placeholder: "예: 성수 카페",
            validation: {
              required: "이름을 입력해주세요",
              maxLength: { value: 50, message: "이름은 50자 이하로 입력해주세요" },
            },
          }}
        />
        <InputText
          label="영문 이름"
          inputOption={{
            name: "nameEn",
            placeholder: "예: Seongsu Cafe (선택)",
            validation: {
              maxLength: { value: 100, message: "영문 이름은 100자 이하로 입력해주세요" },
            },
          }}
        />
        <InputText
          label="주소"
          inputOption={{
            name: "address",
            placeholder: "예: 서울특별시 성동구 연무장길 1",
            validation: { required: "주소를 입력해주세요" },
          }}
        />
        <InputText
          label="영문 주소"
          inputOption={{
            name: "addressEn",
            placeholder: "영문 주소 (선택)",
            validation: {
              maxLength: { value: 510, message: "영문 주소는 510자 이하로 입력해주세요" },
            },
          }}
        />
        <div className="flex gap-3">
          <InputText
            label="위도"
            inputOption={{
              name: "latitude",
              type: "number",
              step: "any",
              placeholder: "37.5421",
              validation: {
                required: "위도를 입력해주세요",
                min: { value: -90, message: "위도는 -90~90 사이로 입력해주세요" },
                max: { value: 90, message: "위도는 -90~90 사이로 입력해주세요" },
              },
            }}
          />
          <InputText
            label="경도"
            inputOption={{
              name: "longitude",
              type: "number",
              step: "any",
              placeholder: "127.0549",
              validation: {
                required: "경도를 입력해주세요",
                min: { value: -180, message: "경도는 -180~180 사이로 입력해주세요" },
                max: { value: 180, message: "경도는 -180~180 사이로 입력해주세요" },
              },
            }}
          />
        </div>
        <InputText
          label="가까운 역"
          inputOption={{
            name: "station",
            placeholder: "예: 성수역",
            validation: {
              required: "가까운 역을 입력해주세요",
              maxLength: { value: 100, message: "역 이름은 100자 이하로 입력해주세요" },
            },
          }}
        />
        <InputText
          label="영문 역명"
          inputOption={{
            name: "stationEn",
            placeholder: "영문 역명 (선택)",
            validation: {
              maxLength: { value: 200, message: "영문 역명은 200자 이하로 입력해주세요" },
            },
          }}
        />
        <InputText
          label="역과의 거리(m)"
          inputOption={{
            name: "stationDistanceMeters",
            type: "number",
            placeholder: "320",
            validation: {
              required: "역과의 거리를 입력해주세요",
              min: { value: 0, message: "0 이상 정수로 입력해주세요" },
            },
          }}
        />
      </div>

      {values.type === "POPUP" && (
        <div className="flex flex-col gap-2 border-b border-flatGray-50 px-5 py-6">
          <p className="text-body2-medium text-layout-header-default">
            운영 기간 <span className="text-system-warning">*</span>
          </p>
          <div className="flex items-center gap-2">
            <input
              type="date"
              aria-label="운영 시작일"
              className="text-neutral-strong-entered h-10 w-full rounded-[8px] border border-divider-default px-2 text-body2-regular bg-fill-neutral-strong-default"
              {...methods.register("operationStartDate", { required: values.type === "POPUP" })}
            />
            <span className="text-body2-regular text-layout-body-default">~</span>
            <input
              type="date"
              aria-label="운영 종료일"
              className="text-neutral-strong-entered h-10 w-full rounded-[8px] border border-divider-default px-2 text-body2-regular bg-fill-neutral-strong-default"
              {...methods.register("operationEndDate", { required: values.type === "POPUP" })}
            />
          </div>
          <p className="text-caption1-regular text-layout-body-default">
            종료일은 시작일과 같거나 이후여야 합니다.
          </p>
        </div>
      )}

      <WeeklyScheduleInput />
      <PlaceThumbnailInput />

      <div className="sticky bottom-0 w-full max-w-[764px] border-t border-divider-default bg-white pc:max-w-none">
        <WriteActionSection disabled={isSubmitDisabled} label={isEdit ? "수정하기" : "등록하기"} />
      </div>
    </form>
  );
};

export default PlaceForm;
