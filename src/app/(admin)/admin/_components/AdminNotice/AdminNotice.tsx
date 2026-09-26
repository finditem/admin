interface AdminNoticeProps {
  title: string;
  description: string;
}

/** 외부 연동 설정이 없거나 조회에 실패했을 때 보여주는 안내입니다. 서비스 통계와 DB 조회 화면에서 씁니다. */
const AdminNotice = ({ title, description }: AdminNoticeProps) => {
  return (
    <div role="status" className="rounded-[14px] px-5 py-6 bg-fill-neutral-subtle-default">
      <p className="text-body1-semibold text-layout-header-default">{title}</p>
      <p className="mt-1 text-body2-regular text-layout-body-default">{description}</p>
    </div>
  );
};

export default AdminNotice;
