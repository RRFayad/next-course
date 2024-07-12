interface SnippetEditPageProps {
  params: {
    id: string;
  };
}

const SnippetEditPage = ({ params }: SnippetEditPageProps) => {
  const id = parseInt(params.id);

  return <div>Editing snippet with id {id}</div>;
};

export default SnippetEditPage;
