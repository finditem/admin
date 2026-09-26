/**
 * 페이지 `searchParams`의 값 하나를 문자열로 좁힙니다.
 *
 * @remarks
 * - 같은 키가 여러 번 오면 배열이 되므로 첫 번째 값을 씁니다.
 *
 * @example
 * ```ts
 * getSingleSearchParam("forbidden"); // "forbidden"
 * getSingleSearchParam(["a", "b"]); // "a"
 * getSingleSearchParam(undefined); // undefined
 * ```
 */

export const getSingleSearchParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;
