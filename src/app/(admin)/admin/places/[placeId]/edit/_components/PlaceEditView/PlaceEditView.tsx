"use client";

import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useGetPlaceDetail } from "@/api/fetch/admin";
import { LoadingState } from "@/components";
import { PlaceForm } from "../../../../_components";
import { PlaceFormValues } from "../../../../_types/PlaceFormValues";
import {
  DEFAULT_PLACE_FORM_VALUES,
  toPlaceFormDefaultValues,
} from "../../../../_utils/toPlaceFormDefaultValues";
import { useSubmitPlace } from "../../../../_hooks/useSubmitPlace";

const PlaceEditView = ({ placeId }: { placeId: number }) => {
  const { data, isLoading } = useGetPlaceDetail({ placeId });
  const { submitPlace, isPending } = useSubmitPlace(placeId);

  const methods = useForm<PlaceFormValues>({
    defaultValues: DEFAULT_PLACE_FORM_VALUES,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    if (data?.result) {
      methods.reset(toPlaceFormDefaultValues(data.result));
    }
  }, [data?.result, methods]);

  if (isLoading) return <LoadingState title="장소 정보를 불러오고 있어요" />;

  return (
    <FormProvider<PlaceFormValues> {...methods}>
      <PlaceForm methods={methods} mode="edit" onSubmit={submitPlace} isPending={isPending} />
    </FormProvider>
  );
};

export default PlaceEditView;
