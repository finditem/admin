import { InfiniteData, keepPreviousData } from "@tanstack/react-query";
import useAppInfiniteQuery from "@/api/_base/query/useAppInfiniteQuery";
import { CategoryType, ItemStatus } from "@/types";
import { AdminMarketingPostItem, GetMarketingPostsResponse } from "../types/MarketingPostsType";

/**
 * 다음 페이지 요청에 쓸 커서를 만듭니다.
 *
 * @remarks
 * - 백엔드는 마지막 게시글 ID(`cursor`)에 더해, 조회수순과 즐겨찾기순 정렬에서는 마지막 게시글의
 *   조회수(`cursorViewCount`)나 즐겨찾기 수(`cursorFavCount`)를 함께 받아야 다음 페이지를 이어서 준다.
 */
const getNextCursor = (lastPage: GetMarketingPostsResponse, sort: string) => {
  const { hasNext, nextCursor, content } = lastPage.result;
  if (!hasNext || nextCursor === null) return undefined;

  const lastPost = content.at(-1);
  if (sort === "MOST_VIEWED" && lastPost) {
    return { cursor: nextCursor, cursorViewCount: lastPost.viewCount };
  }
  if (sort === "MOST_FAVORITED" && lastPost) {
    return { cursor: nextCursor, cursorFavCount: lastPost.favoriteCount };
  }
  return { cursor: nextCursor };
};

interface UseGetMarketingPostsParams {
  sort?: string;
  category?: CategoryType;
  postStatus?: ItemStatus;
  startDate?: string;
  endDate?: string;
  size?: number;
  keyword?: string;
}

interface UseGetMarketingPostsOptions {
  enabled?: boolean;
}

export const useGetMarketingPosts = (
  {
    sort = "LATEST",
    category,
    postStatus,
    startDate,
    endDate,
    size = 10,
    keyword,
  }: UseGetMarketingPostsParams,
  { enabled = true }: UseGetMarketingPostsOptions = {}
) => {
  const params = new URLSearchParams();
  params.set("size", String(size));
  params.set("sortType", sort);

  if (category) params.set("category", category);
  if (postStatus) params.set("postStatus", postStatus);
  if (startDate) params.set("startDate", startDate);
  if (endDate) params.set("endDate", endDate);
  if (keyword) params.set("keyword", keyword);

  return useAppInfiniteQuery<GetMarketingPostsResponse, unknown, AdminMarketingPostItem[]>(
    "auth",
    ["marketing-posts", sort, category, postStatus, startDate, endDate, size, keyword],
    `/admin/posts/content-policy?${params.toString()}`,
    {
      enabled,
      placeholderData: keepPreviousData,
      getNextPageParam: (lastPage) => getNextCursor(lastPage, sort),
      select: (data: InfiniteData<GetMarketingPostsResponse>) =>
        data.pages.flatMap((page) => page.result.content ?? []),
    }
  );
};
