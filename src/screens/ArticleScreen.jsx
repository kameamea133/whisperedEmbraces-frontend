import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { db } from "@/firebaseConfig";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { ArrowLeft, Feather } from "lucide-react";
import { useSelector } from "react-redux"; 
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";

const ArticleScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth); 
  const [alertMessage, setAlertMessage] = useState(null);
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likedByUser, setLikedByUser] = useState(false);
  const [showPopover, setShowPopover] = useState(false); 

  const defaultImageUrl = "/imgDefault.jpg";

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const docRef = doc(db, "posts", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const postData = docSnap.data();
          setPost({ ...postData, id: docRef.id });

          if (postData.likes?.includes(userInfo?.uid)) {
            setLikedByUser(true);
          }
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
  }, [id, userInfo?.uid]);

  const handleLikeToggle = async () => {
    if (!userInfo) {
      setAlertMessage("Vous devez être connecté pour mettre une résonance.");
      setShowPopover(true);
      return;
    }

    if (post.authorId === userInfo.uid) {
      setAlertMessage("Vous ne pouvez pas aimer votre propre texte.");
      setShowPopover(true);
      return;
    }

    try {
      const docRef = doc(db, "posts", id);
      if (likedByUser) {
        await updateDoc(docRef, {
          likes: arrayRemove(userInfo.uid),
        });
        setLikedByUser(false);
        setPost((prev) => ({
          ...prev,
          likes: prev.likes.filter((uid) => uid !== userInfo.uid),
        }));
      } else {
        await updateDoc(docRef, {
          likes: arrayUnion(userInfo.uid),
        });
        setLikedByUser(true);
        setPost((prev) => ({
          ...prev,
          likes: [...prev.likes, userInfo.uid],
        }));
      }
    } catch (error) {
      console.error("Erreur lors du like :", error);
    }
  };

  if (isLoading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;

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

        {/* Section Like avec Popover */}
        <Popover open={showPopover} onOpenChange={setShowPopover}>
  <PopoverTrigger asChild className="relative">
    <div className="relative flex items-center mt-4">
      <Feather
        className={`w-6 h-6 cursor-pointer ${likedByUser ? 'text-[#34B0CA]' : 'text-gray-400'}`}
        onClick={handleLikeToggle}
      />
      <span className="ml-2 text-gray-500">{post.likes?.length || 0} Résonance(s)</span>
    </div>
  </PopoverTrigger>

  {alertMessage && (
    <PopoverContent
      side="bottom"
      align="center"
      sideOffset={8} 
      className={`absolute right-[-7rem] lg:right-[5rem]  top-[-50px] rounded-md flex flex-col gap-0 transform -translate-x-1/2  bg-[#34B0CA] text-white p-2  shadow transition-opacity duration-[5000ms] ease-in-out 
        ${showPopover ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'}`}
    >
      {alertMessage}
      <button
        className="mt-2 text-sm w-[70px] border-none py-1 mx-auto block"
        onClick={() => setShowPopover(false)}
      >
        Fermer
      </button>
    </PopoverContent>
  )}
</Popover>


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
