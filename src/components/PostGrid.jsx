/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { Feather, Volume2 } from "lucide-react";
import { useTranslation } from 'react-i18next';
const PostGrid = ({ posts }) => {
  const navigate = useNavigate();
  const defaultImageUrl = "/imgDefault.jpg";
  const { t } = useTranslation();

  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  return (
    <div id="etreintes-section" className="w-[88%] mx-auto min-h-screen p-4 my-5">
      <h1 className="text-7xl my-[70px] font-thin text-center font-whisper text-shadow">
        {t('postGrid.title')}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {posts?.map((post) => (
          <div 
            key={post.id} 
            className="bg-white p-4 rounded-sm shadow-md shadow-teal-900/30 hover:shadow-xl transition-shadow cursor-pointer relative"
            onClick={() => navigate(`/post/${post.id}`)} 
          >
            <img 
              src={post.imageUrl || defaultImageUrl} 
              alt={post.title} 
              className="w-full h-48 object-cover rounded-md mb-4"
              loading="lazy"
              onError={(e) => {
                e.target.src = defaultImageUrl;
              }}
            />
            
            {post.audioUrl && (
              <div className="absolute top-2 right-2 bg-blue-600 text-white p-2 sm:p-2 p-3 rounded-full shadow-lg z-10">
                <Volume2 className="w-5 h-5 sm:w-4 sm:h-4" />
              </div>
            )}
            
            <h2 className="text-xl font-bold mb-2">{post.title}</h2>
            <p className="text-gray-700 break-words">{stripHtml(post.content).slice(0, 50)}...</p>
            
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center">
                <Feather className="w-5 h-5 text-[#34B0CA]" />
                <span className="ml-2 text-gray-500">{post.likes?.length || 0} Résonance(s)</span>
              </div>
              
              {post.audioUrl && (
                <div className="flex items-center text-blue-600 text-sm">
                  <Volume2 className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Audio</span>
                  <span className="sm:hidden">🎵</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostGrid;
