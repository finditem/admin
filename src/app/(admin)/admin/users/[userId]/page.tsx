import { notFound } from "next/navigation";
import { DetailHeader } from "@/components";
import { UserDetailView } from "./_components";

interface PageProps {
  params: Promise<{ userId: string }>;
}

const page = async ({ params }: PageProps) => {
  const { userId } = await params;
  const id = Number(userId);

  if (!Number.isInteger(id) || id <= 0) notFound();

  return (
    <div className="min-h-dvh">
      <DetailHeader title="유저 정보" />
      <h1 className="sr-only">유저 상세 정보</h1>

      <UserDetailView userId={id} />
    </div>
  );
};

export default page;
