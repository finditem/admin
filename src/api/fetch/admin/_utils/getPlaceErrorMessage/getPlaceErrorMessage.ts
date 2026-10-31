import { AxiosError } from "axios";
import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";

const PLACE_ERROR_MESSAGES: Record<string, string> = {
  "PLACE400-INVALID_REQUEST": "입력값을 다시 확인해주세요",
  "PLACE400-INVALID_SCHEDULE": "요일별 영업시간을 다시 확인해주세요",
  "PLACE400-INVALID_COORDINATE": "위도 또는 경도를 다시 확인해주세요",
  "PLACE400-INVALID_STATION_INFO": "가까운 역 정보를 다시 확인해주세요",
  "PLACE401-UNAUTHORIZED": "로그인이 필요해요",
  "PLACE403-ADMIN_ONLY": "운영진만 사용할 수 있어요",
  "PLACE404-NOT_FOUND": "장소를 찾을 수 없어요",
  "PLACE409-ALREADY_DELETED": "이미 삭제된 장소예요",
  "PLACE409-ALREADY_ACTIVE": "이미 활성 상태인 장소예요",
};

export const PLACE_FALLBACK_ERROR_MESSAGE = "요청을 처리할 수 없습니다. 잠시 후 다시 시도해주세요.";

/** 알고 있는 장소 API 오류 코드는 전용 메시지로, 그 외는 공통 폴백 메시지로 보여준다 (기획서 결정). */
export const getPlaceErrorMessage = (
  error: AxiosError<ApiBaseResponseType<null>>,
  fallback: string = PLACE_FALLBACK_ERROR_MESSAGE
): string => {
  const code = error.response?.data?.code;
  return (code && PLACE_ERROR_MESSAGES[code]) || fallback;
};
