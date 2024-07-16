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

  // Here we can have a server action, preloaded with our state arguments
  const editSnippetAction = actions.editSnippet.bind(null, snippet.id, code); // Remember the 'bind()' is like preconfiguring the function with the arguments I want (and not running it yet)

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
      <form action={editSnippetAction}>
        <button type="submit" className="p-2 border rounded">
          Save
        </button>
      </form>
    </div>
  );
};

export default SnippetEditForm;
