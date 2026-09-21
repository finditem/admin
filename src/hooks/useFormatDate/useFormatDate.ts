import formatDate from "@/utils/formatDate/formatDate/formatDate";

const useFormatDate = () => {
  return (date: string) =>
    formatDate(date, {
      now: "지금",
      minutesAgo: (minutes) => `${minutes}분 전`,
      hoursAgo: (hours) => `${hours}시간 전`,
      yesterday: "어제",
    });
};

export default useFormatDate;
