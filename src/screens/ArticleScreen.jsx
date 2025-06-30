import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { db } from "@/firebaseConfig";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { ArrowLeft, Feather, Volume2, Play, Pause, Square } from "lucide-react";
import { useSelector, useDispatch } from "react-redux"; 
import { setPlaying } from "../slices/musicSlice";
import SEOHead from "@/components/SEOHead";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  WhatsappShareButton,
  WhatsappIcon,
  XIcon
} from "react-share";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";


const ArticleScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth); 
  const dispatch = useDispatch();
  const backgroundMusicState = useSelector(state => state.music.isPlaying);
  const [alertMessage, setAlertMessage] = useState(null);
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likedByUser, setLikedByUser] = useState(false);
  const [showPopover, setShowPopover] = useState(false); 
  const [newComment, setNewComment] = useState("");
  const [username, setUsername] = useState(userInfo?.username || "");
  const [comments, setComments] = useState([]);
  const [audioState, setAudioState] = useState('stopped'); // 'stopped', 'playing', 'paused'
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [wasBackgroundMusicPlaying, setWasBackgroundMusicPlaying] = useState(false);
  const audioRef = useRef(null);

  const { t } = useTranslation();

  const defaultImageUrl = "/imgDefault.jpg";

  // Fonction pour formater le temps en MM:SS
  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Fonction pour nettoyer le HTML et extraire le texte
  const stripHtml = (html) => {
    if (!html) return "";
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  useEffect(() => {
    const fetchPost = async () => {

      try {
        const docRef = doc(db, "posts", id);
        
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const postData = docSnap.data();
          setPost({ ...postData, id: docRef.id });
          setComments(postData.comments || []);

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

  // Initialiser l'audio quand le post est chargé
  useEffect(() => {
    if (post?.audioUrl) {
      audioRef.current = new Audio(post.audioUrl);
      
      audioRef.current.onended = () => {
        setAudioState('stopped');
        setCurrentTime(0);
        // Remettre la musique de fond si elle était en cours
        if (wasBackgroundMusicPlaying) {
          dispatch(setPlaying(true));
        }
      };
      
      audioRef.current.onerror = () => {
        setAudioState('stopped');
        alert("Erreur lors de la lecture audio");
        // Remettre la musique de fond en cas d'erreur
        if (wasBackgroundMusicPlaying) {
          dispatch(setPlaying(true));
        }
      };

      audioRef.current.onplay = () => {
        setAudioState('playing');
      };

      audioRef.current.onpause = () => {
        setAudioState('paused');
      };

      audioRef.current.onloadedmetadata = () => {
        setDuration(audioRef.current.duration);
      };

      audioRef.current.ontimeupdate = () => {
        if (!isSeeking) {
          setCurrentTime(audioRef.current.currentTime);
        }
      };
    }

    // Cleanup
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      // Remettre la musique de fond quand on quitte la page
      if (wasBackgroundMusicPlaying) {
        dispatch(setPlaying(true));
      }
    };
  }, [post?.audioUrl, isSeeking, wasBackgroundMusicPlaying, dispatch]);

  const handleAudioPlay = () => {
    if (audioRef.current) {
      // Vérifier si la musique de fond est en cours et la sauvegarder
      if (backgroundMusicState) {
        setWasBackgroundMusicPlaying(true);
        dispatch(setPlaying(false)); // Couper la musique de fond
      }

      if (audioState === 'paused') {
        audioRef.current.play();
      } else {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    }
  };

  const handleAudioPause = () => {
    if (audioRef.current && audioState === 'playing') {
      audioRef.current.pause();
    }
  };

  const handleAudioStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setAudioState('stopped');
      setCurrentTime(0);
      
      // Remettre la musique de fond si elle était en cours
      if (wasBackgroundMusicPlaying) {
        dispatch(setPlaying(true));
        setWasBackgroundMusicPlaying(false);
      }
    }
  };

  const handleSeek = (e) => {
    if (audioRef.current && duration) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = clickX / rect.width;
      const newTime = percentage * duration;
      
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleSeekStart = () => {
    setIsSeeking(true);
  };

  const handleSeekEnd = () => {
    setIsSeeking(false);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment = {
      username: username || t("comments.anonymous"),
      content: newComment,
      isApproved: false, 
      createdAt: new Date().toISOString(),
    };

    

    try {
      const docRef = doc(db, "posts", id);
      
      await updateDoc(docRef, {
        comments: arrayUnion(comment),
      });
      


      
      setNewComment("");
      setUsername(userInfo?.username || ""); 
      alert("Votre commentaire a été soumis pour approbation.");
    } catch (error) {
      console.error("Erreur lors de l'ajout du commentaire :", error.message, error.code, error);
    }
  };

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

  const postUrl = `${window.location.origin}/post/${id}`;
  const postTitle = post?.title || "Poème";

  return (
    <>
      {post && (
        <SEOHead 
          title={post.title}
          description={stripHtml(post.content).substring(0, 160) + "..."}
          keywords={`poésie, ${post.title}, littérature, partage, ${post.authorName}`}
          image={post.imageUrl || "/imgDefault.jpg"}
          url={`/post/${post.id}`}
          type="article"
          author={post.authorName}
        />
      )}
      <div className="min-h-screen flex flex-col justify-center px-4">
        <div className="w-full p-6 pt-[100px]"></div>
        <div className="flex flex-col gap-6 p-4 md:p-8 w-full md:w-[80%] lg:w-[70%] xl:w-[60%] mx-auto font-lora rounded-md shadow-lg bg-[url('/paperBg3.png')] bg-cover bg-no-repeat bg-center mt-10 mb-10">
          <img
            src={post.imageUrl || defaultImageUrl}
            alt={post.title}
            className="w-full object-cover rounded-md mb-4 shadow-lg"
          />
          <div className="flex justify-between items-start gap-4">
            <h1 className="text-2xl md:text-3xl font-bold flex-1">{post.title}</h1>
            
            {/* Contrôles audio */}
            {post?.audioUrl && (
              <div className="flex flex-col gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-md transition-colors min-w-[200px] shadow-md">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4" />
                  <span className="text-sm">Version audio</span>
                  
                  {/* Bouton Play/Pause */}
                  <button
                    onClick={audioState === 'playing' ? handleAudioPause : handleAudioPlay}
                    className="p-1 hover:bg-blue-800 rounded transition-colors"
                    title={audioState === 'playing' ? 'Pause' : 'Lecture'}
                  >
                    {audioState === 'playing' ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </button>
                  
                  {/* Bouton Stop */}
                  <button
                    onClick={handleAudioStop}
                    className="p-1 hover:bg-blue-800 rounded transition-colors"
                    title="Stop"
                  >
                    <Square className="w-4 h-4" />
                  </button>
                </div>

                {/* Barre de progression */}
                <div className="w-full">
                  <div 
                    className="w-full h-2 bg-blue-800 rounded-full cursor-pointer relative"
                    onClick={handleSeek}
                    onMouseDown={handleSeekStart}
                    onMouseUp={handleSeekEnd}
                    onTouchStart={handleSeekStart}
                    onTouchEnd={handleSeekEnd}
                  >
                    <div 
                      className="h-full bg-white rounded-full transition-all duration-100"
                      style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                    ></div>
                  </div>
                  
                  {/* Temps écoulé / total */}
                  <div className="flex justify-between text-xs mt-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm text-gray-500">
              {t('article.by')} <span className="text-black font-semibold">{post.authorName || t('article.anonymous')}</span>
              {post.createdAt ? ` | ${new Date(post.createdAt.toDate()).toLocaleDateString()}` : ""}
            </p>
            
            {post?.audioUrl && post?.narrator && (
              <p className="text-sm text-gray-500 italic">
               {t('article.voice')} : <span className="text-black font-semibold">{post.narrator}</span>
              </p>
            )}
          </div>

          <div
            className="text-base md:text-lg w-full break-words"
            dangerouslySetInnerHTML={{ __html: post.content }}
          ></div>

          {post.allowSharing && (
            <div className="flex space-x-4 mt-6">
              <FacebookShareButton url={postUrl} quote={postTitle}>
                <FacebookIcon size={30} round bgStyle={{ fill: '#3b82f6' }}/>
              </FacebookShareButton>
              <TwitterShareButton url={postUrl} title={postTitle}>
                <XIcon size={30} round  bgStyle={{ fill: '#3b82f6' }}/>
              </TwitterShareButton>
              <WhatsappShareButton url={postUrl} title={postTitle}>
                <WhatsappIcon size={30} round bgStyle={{ fill: '#3b82f6' }}/>
              </WhatsappShareButton>
            </div>
          )}
         
          <Popover open={showPopover} onOpenChange={setShowPopover}>
            <PopoverTrigger asChild className="relative">
              <div onClick={handleLikeToggle} className="relative flex items-center mt-4">
                <Feather
                  className={`w-6 h-6 cursor-pointer ${likedByUser ? 'text-[#34B0CA]' : 'text-gray-400'}`}
                />
                <span className="ml-2 text-gray-500 cursor-pointer">{post.likes?.length || 0} Résonance(s)</span>
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
            {t('article.back')}
          </button>
        </div>

        <form onSubmit={handleAddComment} className="flex flex-col gap-6 p-4 md:p-8 w-full md:w-[80%] lg:w-[70%] xl:w-[60%] mx-auto font-lora rounded-md shadow-lg mt-10 mb-10">
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Entrez votre nom (optionnel)"
            value={userInfo?.username || username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={!!userInfo?.username}
          />
          <textarea
            className="w-full p-2 border rounded"
            rows="3"
            placeholder={t("comments.leaveComment")}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          ></textarea>
          <Button type="submit" className="mt-4 w-full">
            {t("comments.addButton")}
          </Button>
        </form>

        <div className="flex flex-col gap-6 p-4 md:p-8 w-full md:w-[80%] lg:w-[70%] xl:w-[60%] mx-auto font-lora rounded-md shadow-lg bg-[url('/paperBg3.png')] bg-cover bg-no-repeat bg-center mt-10 mb-10">
          <h2 className="text-xl font-bold mb-4">{t("comments.title")}</h2>
          {comments.filter(comment => comment.isApproved).map((comment, index) => (
            <div key={index} className="bg-gray-100 p-4 rounded mb-4">
              <p className="text-sm text-gray-700">{t("comments.by")} {comment.username}</p>
              <p className="text-xs text-gray-500">
                 {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : t("comments.unknownDate")}
              </p>
              <p className="mt-2">{comment.content}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ArticleScreen;
