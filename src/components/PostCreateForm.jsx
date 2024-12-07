import { useState } from "react";
import { useSelector } from "react-redux"; 
import { db } from "@/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import ReactQuill from "react-quill";
import { useTranslation } from 'react-i18next';
import "react-quill/dist/quill.snow.css"; 

const PostCreateForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [headerImage, setHeaderImage] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState("fr");
  const [allowSharing, setAllowSharing] = useState(true);

  const { t } = useTranslation();
  
  const userInfo = useSelector((state) => state.auth.userInfo); 

  const handleImageChange = (e) => {
    setHeaderImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let imageUrl = "";
      let publicId = "";
      
      if (headerImage) {
        const formData = new FormData();
        formData.append("file", headerImage);
        formData.append("upload_preset", "my_preset"); 

        const response = await fetch("https://api.cloudinary.com/v1_1/dhp8teilh/image/upload", {

          method: "POST",
          body: formData,
        });
        const data = await response.json();
        imageUrl = data.secure_url;
        publicId = data.public_id;
      }

      
      await addDoc(collection(db, "posts"), {
        title: title,
        content: content,
        language: language,
        imageUrl: imageUrl,
        publicId: publicId,
        createdAt: new Date(),
        allowSharing,
        authorId: userInfo?.uid,
        authorName: userInfo?.username || t('postForm.unknownAuthor'), 
        likes: [],
        comments: [],
      });

      setTitle("");
      setContent("");
      setHeaderImage(null);
      setIsFormVisible(false);
      setAllowSharing(true);
    } catch (err) {
      console.error(t('postForm.error'), err);
      setError(t('postForm.error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative mb-5 w-full max-w-3xl mx-auto">
      <Button onClick={() => setIsFormVisible(!isFormVisible)} className="flex items-center ml-16 space-x-2 lg:ml-10">
        <Plus className="w-5 h-5" />
        <span>{t('postForm.createPost')}</span>
      </Button>

      <AnimatePresence>
        {isFormVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="mt-4 p-6 border rounded-lg bg-white shadow-lg space-y-4"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label>{t('postForm.title')}</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="block w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label>{t('postForm.content')}</label>
                <ReactQuill value={content} onChange={setContent} className="h-50 break-words" />
              </div>
              <div>
                <label>{t('postForm.language')}</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="block w-full border rounded px-3 py-2"
                >
                  <option value="fr">{t('postForm.languageFrench')}</option>
                  <option value="en">{t('postForm.languageEnglish')}</option>
                </select>
              </div>

              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={allowSharing}
                    onChange={() => setAllowSharing(!allowSharing)}
                  />
                  {t('postForm.allowSharing')}
                </label>
              </div>

              <div>
                <label>{t('postForm.headerImage')}</label>
                <input type="file" onChange={handleImageChange} className="block w-full" />
              </div>
              <Button type="submit" disabled={isLoading} className="mr-2">
                {isLoading ? t('postForm.sending') : t('postForm.submit')}
              </Button>
              <Button type="button" onClick={() => setShowPreview(!showPreview)}>
                {showPreview ? t('postForm.hidePreview') : t('postForm.preview')}
              </Button>
              {error && <p className="text-red-500">{error}</p>}
            </form>

            {showPreview && (
              <div className="mt-6 p-4 border rounded-lg bg-gray-50">
                {headerImage && (
                  <img
                    src={URL.createObjectURL(headerImage)}
                    alt={t('postForm.headerImage')}
                    className="w-full h-auto object-cover rounded-md mb-4 shadow-lg"
                  />
                )}
                <h2 className="text-xl font-bold">{title}</h2>
                <div dangerouslySetInnerHTML={{ __html: content }} className="text-base" />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

};

export default PostCreateForm;