import { useState } from "react";
import { useCreatePostMutation } from "../slices/postsApiSlice";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; 

const PostCreateForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [headerImage, setHeaderImage] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [createPost, { isLoading, isError, error }] = useCreatePostMutation();

  const handleImageChange = (e) => {
    setHeaderImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (headerImage) formData.append("headerImage", headerImage);

    try {
      await createPost(formData).unwrap();
      setTitle("");
      setContent("");
      setHeaderImage(null);
      setIsFormVisible(false);
    } catch (err) {
      console.error("Erreur de création du texte:", err);
    }
  };

  return (
    <div className="relative mb-5">
      <Button onClick={() => setIsFormVisible(!isFormVisible)} className="flex items-center space-x-2">
        <Plus className="w-5 h-5" /> 
        <span>Créer un texte</span>
      </Button>

      
      <AnimatePresence>
        {isFormVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="mt-4 p-6 border rounded-lg bg-white shadow-lg"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label>Titre</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="block w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label>Contenu</label>
                <ReactQuill
                  value={content}
                  onChange={setContent}
                  className="h-50"
                />
              </div>
              <div className="py-8">
                <label>Image d’en-tête (optionnelle)</label>
                <input type="file" onChange={handleImageChange} className="block w-full" />
              </div>
              <Button type="submit" disabled={isLoading} className="mr-2">
                Soumettre
              </Button>
              <Button type="button" onClick={() => setShowPreview(!showPreview)}>
                {showPreview ? "Masquer la Prévisualisation" : "Prévisualiser"}
              </Button>
              {isError && <p className="text-red-500">{error?.data?.message}</p>}
            </form>

           
            {showPreview && (
              <div className="flex flex-col gap-10 p-8 max-h-screen mx-auto font-lora rounded-md shadow-lg bg-[url('/paperBg3.png')] bg-cover bg-no-repeat bg-center mt-10 mb-10 ">
              
              {headerImage && (
                  <img
                    src={URL.createObjectURL(headerImage)}
                    alt="Prévisualisation de l'image"
                    className="w-[50%] h-auto object-cover rounded-md mb-4 shadow-lg"
                  />
                )}
                <h2 className="text-3xl font-bold">{title}</h2>
                <div dangerouslySetInnerHTML={{ __html: content }} className="text-lg w-[80%]"/>
               
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PostCreateForm;
