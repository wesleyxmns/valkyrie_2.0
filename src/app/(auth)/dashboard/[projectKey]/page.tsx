interface BoardProps {
  params: {
    projectKey: string;
  };
}

export default async function BoardPage({ params }: BoardProps) {
  const { projectKey } = params;
  
  return (
    <div className="h-screen w-screen mt-20" >
      <h1>Board</h1>
    </div>
  )
}