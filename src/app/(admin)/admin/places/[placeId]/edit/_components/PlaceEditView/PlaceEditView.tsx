"use client";

import { useEffect } from "react";
import Link from "next/link";
import { FormProvider, useForm } from "react-hook-form";
import { useGetPlaceDetail } from "@/api/fetch/admin";
import { Button, EmptyState, LoadingState } from "@/components";
import { PlaceForm } from "../../../../_components";
import { PlaceFormValues } from "../../../../_types/PlaceFormValues";
import {
  DEFAULT_PLACE_FORM_VALUES,
  toPlaceFormDefaultValues,
} from "../../../../_utils/toPlaceFormDefaultValues";
import { useSubmitPlace } from "../../../../_hooks/useSubmitPlace";

const PlaceEditView = ({ placeId }: { placeId: number }) => {
  const { data, isLoading, isError } = useGetPlaceDetail({ placeId });
  const { submitPlace, isPending } = useSubmitPlace(placeId);

  const methods = useForm<PlaceFormValues>({
    defaultValues: DEFAULT_PLACE_FORM_VALUES,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    if (data?.result) {
      // reset은 필드 ref를 비우고 다시 렌더링될 때 register가 입력값을 채우게 두는데,
      // React Compiler가 register 호출을 메모이즈해 입력값이 비어 있게 된다. ref를 유지해 곧바로 채운다.
      methods.reset(toPlaceFormDefaultValues(data.result), { keepFieldsRef: true });
    }
  }, [data?.result, methods]);

  if (isLoading) return <LoadingState title="장소 정보를 불러오고 있어요" />;

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-6">
        <EmptyState
          icon={{ iconName: "NoPublicDataSearch", iconSize: 70 }}
          title="장소 정보를 불러오지 못했어요"
          description={"없는 장소이거나 접근 권한이 없을 수 있어요.\n목록에서 다시 선택해 주세요."}
        />
        <Button as={Link} href="/admin/places" size="small">
          목록으로 돌아가기
        </Button>
      </div>
    );
  }

  return (
    <FormProvider<PlaceFormValues> {...methods}>
      <PlaceForm methods={methods} mode="edit" onSubmit={submitPlace} isPending={isPending} />
    </FormProvider>
  );
};

export default PlaceEditView;
