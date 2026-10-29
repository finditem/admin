"use client";

import { FormProvider, useForm } from "react-hook-form";
import { DetailHeader } from "@/components";
import { PlaceForm } from "../_components";
import { PlaceFormValues } from "../_types/PlaceFormValues";
import { DEFAULT_PLACE_FORM_VALUES } from "../_utils/toPlaceFormDefaultValues";
import { useSubmitPlace } from "../_hooks/useSubmitPlace";

const PlaceNewPage = () => {
  const methods = useForm<PlaceFormValues>({
    defaultValues: DEFAULT_PLACE_FORM_VALUES,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const { submitPlace, isPending } = useSubmitPlace(null);

  return (
    <>
      <DetailHeader title="장소 등록" />
      <h1 className="sr-only">장소 등록</h1>

      <FormProvider<PlaceFormValues> {...methods}>
        <PlaceForm methods={methods} mode="create" onSubmit={submitPlace} isPending={isPending} />
      </FormProvider>
    </>
  );
};

export default PlaceNewPage;
