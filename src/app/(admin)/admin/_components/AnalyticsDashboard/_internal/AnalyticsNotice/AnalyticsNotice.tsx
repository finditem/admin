interface AnalyticsNoticeProps {
  title: string;
  description: string;
}

/** GA 설정이 없거나 조회에 실패했을 때 보여주는 안내입니다. */
const AnalyticsNotice = ({ title, description }: AnalyticsNoticeProps) => {
  return (
    <div role="status" className="rounded-[14px] bg-fill-neutral-subtle-default px-5 py-6">
      <p className="text-body1-semibold text-layout-header-default">{title}</p>
      <p className="mt-1 text-body2-regular text-layout-body-default">{description}</p>
    </div>
  );
};

export default AnalyticsNotice;
