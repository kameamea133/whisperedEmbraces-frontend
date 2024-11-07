import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { db } from "@/firebaseConfig";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { ArrowLeft, Feather } from "lucide-react";
import { useSelector } from "react-redux"; // Pour obtenir l'utilisateur actuel

const ArticleScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth); // Obtenir l'ID utilisateur
  
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const defaultImageUrl = "/imgDefault.jpg";

  const fetchPost = async () => {
    try {
      const docRef = doc(db, "posts", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPost({ id: docSnap.id, ...docSnap.data() });
      } else {
        setError("Article non trouvé.");
      }
    } catch (err) {
      setError("Erreur de chargement de l'article.", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  const handleLikeToggle = async () => {
    const postRef = doc(db, "posts", id);
    const likedByUser = post.likes?.includes(userInfo.uid);

    try {
      await updateDoc(postRef, {
        likes: likedByUser
          ? arrayRemove(userInfo.uid) // Supprime l'utilisateur des likes
          : arrayUnion(userInfo.uid)  // Ajoute l'utilisateur aux likes
      });
      fetchPost(); // Actualiser les données du post
    } catch (error) {
      console.error("Erreur lors du like/unlike :", error);
    }
  };

  if (isLoading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;

  const likedByUser = post.likes?.includes(userInfo?.uid);

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
          Par <span className="text-blue-400 font-semibold">{post.authorName || "Anonyme"}</span>
          {post.createdAt ? ` | ${new Date(post.createdAt.toDate()).toLocaleDateString()}` : ""}
        </p>
        <div
          className="text-base md:text-lg w-full break-words"
          dangerouslySetInnerHTML={{ __html: post.content }}
        ></div>

        {/* Bouton pour liker/unliker */}
        <div className="flex items-center mt-4">
          <Feather
            className={`w-6 h-6 cursor-pointer ${likedByUser ? 'text-[#34B0CA]' : 'text-gray-400'}`}
            onClick={handleLikeToggle}
          />
          <span className="ml-2 text-gray-500">{post.likes?.length || 0} Résonance(s)</span>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-lg justify-center mt-10 text-[#34B0CA] hover:text-[#34B0CA]/70 transition"
        >
          <ArrowLeft className="w-5 h-5 mr-2 text-[#34B0CA]" />
          Retour
        </button>
      </div>
    </div>
  );
};

export default ArticleScreen;
