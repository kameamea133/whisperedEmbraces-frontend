/* eslint-disable react/prop-types */

import { useNavigate } from "react-router-dom";

const PostGrid = ({ posts }) => {
  const navigate = useNavigate();

  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  return (
    <div id="etreintes-section" className="w-[98%] mx-auto h-screen p-4 my-5">
      <h1 className="text-7xl mt-5 font-thin mb-4 text-center font-whisper text-shadow">Les étreintes</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {posts?.map((post) => (
          <div 
            key={post._id} 
            className="bg-white p-4 rounded-sm shadow-md shadow-teal-900/30 hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => navigate(`/post/${post._id}`)} 
          >
            <img 
              src={post.headerImage} 
              alt={post.title} 
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-bold mb-2">{post.title}</h2>
            <p className="text-gray-700">{stripHtml(post.content).slice(0, 50)}...</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostGrid;
