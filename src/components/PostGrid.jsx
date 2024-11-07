/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { Feather } from "lucide-react";

const PostGrid = ({ posts }) => {
  const navigate = useNavigate();
  const defaultImageUrl = "/imgDefault.jpg";

  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  return (
    <div id="etreintes-section" className="w-[78%] mx-auto min-h-screen p-4 my-5">
      <h1 className="text-7xl my-[70px] font-thin text-center font-whisper text-shadow">Les étreintes</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {posts?.map((post) => (
          <div 
            key={post.id} 
            className="bg-white p-4 rounded-sm shadow-md shadow-teal-900/30 hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => navigate(`/post/${post.id}`)} 
          >
            <img 
              src={post.imageUrl || defaultImageUrl} 
              alt={post.title} 
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-bold mb-2">{post.title}</h2>
            <p className="text-gray-700">{stripHtml(post.content).slice(0, 50)}...</p>
            <div className="flex items-center mt-2">
              <Feather className="w-5 h-5 text-[#34B0CA]" />
              <span className="ml-2 text-gray-500">{post.likes?.length || 0} Résonance(s)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostGrid;
