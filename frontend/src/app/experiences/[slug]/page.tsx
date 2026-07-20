import { Suspense } from "react";
import { PageContent } from "../page";

export default async function ExperienceSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageContent initialSlug={slug} />
    </Suspense>
  );
}
