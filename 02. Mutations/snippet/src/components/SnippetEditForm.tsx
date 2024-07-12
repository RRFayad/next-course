"use client";

import type { Snippet } from "@prisma/client";

interface SnippetEditFormProps {
  snippet: Snippet;
}

const SnippetEditForm = ({ snippet }: SnippetEditFormProps) => {
  return <div>Client Snippet is {snippet.title}</div>;
};

export default SnippetEditForm;
