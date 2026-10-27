import { notFound } from "next/navigation";
import { DetailHeader } from "@/components";
import { PlaceEditView } from "./_components";

interface PageProps {
  params: Promise<{ placeId: string }>;
}

const page = async ({ params }: PageProps) => {
  const { placeId } = await params;
  const id = Number(placeId);

  if (!Number.isInteger(id) || id <= 0) notFound();

  return (
    <>
      <DetailHeader title="장소 수정" />
      <h1 className="sr-only">장소 수정</h1>

      <PlaceEditView placeId={id} />
    </>
  );
};

export default page;
