import { ReactNode } from "react";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useAppInfiniteQuery from "./useAppInfiniteQuery";

const mockGet = jest.fn();

jest.mock("../axios/useAxios", () => ({
  __esModule: true,
  default: () => ({ get: mockGet }),
}));

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
    {children}
  </QueryClientProvider>
);

type Page = { result: { next: unknown } };

describe("useAppInfiniteQuery", () => {
  beforeEach(() => {
    mockGet.mockReset();
  });

  it("다음 페이지 커서가 값 하나면 pageParamName으로 붙인다", async () => {
    mockGet
      .mockResolvedValueOnce({ data: { result: { next: 10 } } })
      .mockResolvedValueOnce({ data: { result: { next: null } } });

    const { result } = renderHook(
      () =>
        useAppInfiniteQuery<Page>("auth", ["single"], "/items?size=2", {
          getNextPageParam: (lastPage) => lastPage.result.next ?? undefined,
        }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.hasNextPage).toBe(true));
    await act(() => result.current.fetchNextPage());

    expect(mockGet).toHaveBeenNthCalledWith(1, "/items?size=2");
    expect(mockGet).toHaveBeenNthCalledWith(2, "/items?size=2&cursor=10");
  });

  it("다음 페이지 커서가 객체면 각 키를 쿼리 파라미터로 붙인다", async () => {
    mockGet
      .mockResolvedValueOnce({ data: { result: { next: { cursor: 5, cursorViewCount: 42 } } } })
      .mockResolvedValueOnce({ data: { result: { next: null } } });

    const { result } = renderHook(
      () =>
        useAppInfiniteQuery<Page>("auth", ["object"], "/items", {
          getNextPageParam: (lastPage) => lastPage.result.next ?? undefined,
        }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.hasNextPage).toBe(true));
    await act(() => result.current.fetchNextPage());

    expect(mockGet).toHaveBeenNthCalledWith(2, "/items?cursor=5&cursorViewCount=42");
  });
});
