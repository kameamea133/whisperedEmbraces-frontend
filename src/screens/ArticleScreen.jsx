import { useParams } from "react-router-dom";
import { useGetPostQuery } from "@/slices/postsApiSlice";

const ArticleScreen = () => {
  const { id } = useParams();
  const { data: post, error, isLoading } = useGetPostQuery(id);

  if (isLoading) return <p>Chargement...</p>;
  if (error) return <p>Erreur de chargement de l&lsquo;article.</p>;

  return (
    <div>
  <div className="w-[50%] mx-auto p-6 pt-[200px]"></div>
  <div className="flex flex-col gap-10 p-8 w-[50%] max-h-screen mx-auto font-lora rounded-md shadow-lg bg-[url('/paperBg3.png')] bg-cover bg-no-repeat bg-center mt-10 mb-10">
    {post.headerImage && (
      <img
        src={post.headerImage}
        alt={post.title}
        className="w-[50%] h-auto object-cover rounded-md mb-4 shadow-lg"
      />
    )}
    <h1 className="text-3xl font-bold">{post.title}</h1>
    <div
      className="text-lg w-[80%]"
      dangerouslySetInnerHTML={{ __html: post.content }}
    ></div>
  </div>
</div>

  );
};

export default ArticleScreen;
