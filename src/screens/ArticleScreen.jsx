import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { db } from "@/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { ArrowLeft } from "lucide-react";

const ArticleScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [post, setPost] = useState(null); 
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState(null); 
  
  const defaultImageUrl = "/imgDefault.jpg"; 
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const docRef = doc(db, "posts", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setPost(docSnap.data());
        } else {
          setError("Article non trouvé.");
        }
      } catch (err) {
        setError("Erreur de chargement de l'article.", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (isLoading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;

  console.log(post);

  return (
    <div className="min-h-screen flex flex-col justify-center px-4">
      <div className="w-full p-6 pt-[100px]"></div>
      
      <div className="flex flex-col gap-6 p-4 md:p-8 w-full md:w-[80%] lg:w-[70%] xl:w-[60%] mx-auto font-lora rounded-md shadow-lg bg-[url('/paperBg3.png')] bg-cover bg-no-repeat bg-center mt-10 mb-10">
        <img
          src={post.imageUrl || defaultImageUrl} 
          alt={post.title}
          className="w-full object-cover rounded-md mb-4 shadow-lg"
        />
        <h1 className="text-2xl md:text-3xl font-bold">{post.title}</h1>
        <p className="text-sm text-gray-500">
          Par <span className="text-blue-600 font-semibold">{post.authorName || "Anonyme"}</span> 
          {post.createdAt ? ` | ${new Date(post.createdAt.toDate()).toLocaleDateString()}` : ""}
        </p>
        <div
          className="text-base md:text-lg w-full break-words"
          dangerouslySetInnerHTML={{ __html: post.content }}
        ></div>

        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center mt-10 text-blue-600 hover:text-blue-800 transition"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Retour
        </button>
      </div>
    </div>
  );
};

export default ArticleScreen;
