import { notFound } from "next/navigation";
import { db } from "@/db";

import SnippetEditForm from "@/components/SnippetEditForm";

interface SnippetEditPageProps {
  params: {
    id: string;
  };
}

const SnippetEditPage = async ({ params }: SnippetEditPageProps) => {
  const id = parseInt(params.id);
  const snippet = await db.snippet.findFirst({ where: { id } });

  if (!snippet) {
    return notFound();
  }

  return (
    <div>
      <SnippetEditForm snippet={snippet} />
    </div>
  );
};

export default SnippetEditPage;
