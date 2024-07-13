"use client";

import { useState } from "react";
import type { Snippet } from "@prisma/client";
import { Editor } from "@monaco-editor/react";
import * as actions from "@/actions";

interface SnippetEditFormProps {
  snippet: Snippet;
}

const SnippetEditForm = ({ snippet }: SnippetEditFormProps) => {
  const [code, setCode] = useState(snippet.code);

  const editorChangeHandler = async (value: string = "") => {
    setCode(value);
  };

  return (
    <div>
      <Editor
        height={"40vh"}
        theme="vs-dark"
        language="javascript"
        defaultValue={snippet.code}
        options={{ minimap: { enabled: false } }}
        onChange={editorChangeHandler}
      />
    </div>
  );
};

export default SnippetEditForm;
