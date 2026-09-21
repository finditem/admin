import { RegisterOptions, useFormContext } from "react-hook-form";

export const useFormInput = () => {
  const { setValue, clearErrors } = useFormContext();

  // 값 삭제
  const onDelete = (name: string) => {
    setValue(name, "", {
      shouldValidate: false,
      shouldDirty: false,
      shouldTouch: false,
    });
    clearErrors(name);
  };

  return {
    onDelete,
  };
};
