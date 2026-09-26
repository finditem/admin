/** DB 값 하나를 표에 쓸 문자열로 바꿉니다. `null`은 빈 문자열과 구분되도록 `NULL`로 적습니다. */
export const formatDbCell = (value: unknown) => {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
};
