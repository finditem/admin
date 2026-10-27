"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { DAY_OF_WEEK_OPTIONS } from "../../../../_constants/DAY_OF_WEEK_OPTIONS";
import { PlaceFormValues } from "../../../../_types/PlaceFormValues";

const TIME_INPUT_CLASS =
  "h-10 w-full rounded-[8px] border border-divider-default bg-fill-neutral-strong-default px-2 text-body2-regular text-neutral-strong-entered";

const WeeklyScheduleInput = () => {
  const { register, control } = useFormContext<PlaceFormValues>();
  const weeklySchedules = useWatch({ control, name: "weeklySchedules" });

  return (
    <div className="flex flex-col gap-3 px-5 py-6">
      <p className="text-body2-medium text-layout-header-default">
        요일별 영업시간 <span className="text-system-warning">*</span>
      </p>

      <div className="flex flex-col gap-4">
        {DAY_OF_WEEK_OPTIONS.map(({ value, label }, index) => {
          const schedule = weeklySchedules?.[index];
          const isClosed = schedule?.isClosed;
          const hasBreak = schedule?.hasBreak;

          return (
            <div
              key={value}
              className="flex flex-col gap-2 rounded-[10px] border border-divider-default p-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-body1-medium text-layout-header-default">{label}</span>
                <label className="flex items-center gap-2 text-body2-regular text-layout-body-default">
                  <input type="checkbox" {...register(`weeklySchedules.${index}.isClosed`)} />
                  정기 휴무
                </label>
              </div>

              {!isClosed && (
                <>
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      aria-label={`${label} 영업 시작 시간`}
                      className={TIME_INPUT_CLASS}
                      {...register(`weeklySchedules.${index}.businessStart`, {
                        required: !isClosed,
                      })}
                    />
                    <span className="text-body2-regular text-layout-body-default">~</span>
                    <input
                      type="time"
                      aria-label={`${label} 영업 종료 시간`}
                      className={TIME_INPUT_CLASS}
                      {...register(`weeklySchedules.${index}.businessEnd`, {
                        required: !isClosed,
                      })}
                    />
                  </div>

                  <label className="flex items-center gap-2 text-body2-regular text-layout-body-default">
                    <input type="checkbox" {...register(`weeklySchedules.${index}.hasBreak`)} />
                    브레이크타임 추가
                  </label>

                  {hasBreak && (
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        aria-label={`${label} 브레이크타임 시작 시간`}
                        className={TIME_INPUT_CLASS}
                        {...register(`weeklySchedules.${index}.breakStart`, {
                          required: hasBreak,
                        })}
                      />
                      <span className="text-body2-regular text-layout-body-default">~</span>
                      <input
                        type="time"
                        aria-label={`${label} 브레이크타임 종료 시간`}
                        className={TIME_INPUT_CLASS}
                        {...register(`weeklySchedules.${index}.breakEnd`, {
                          required: hasBreak,
                        })}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
      <p className="text-caption1-regular text-layout-body-default">
        휴무가 아닌 요일마다 영업시간을 입력해야 저장할 수 있어요.
      </p>
    </div>
  );
};

export default WeeklyScheduleInput;
