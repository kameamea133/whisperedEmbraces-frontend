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
        audioUrl: null,
        audioPublicId: null,
        narrator: null,
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
    // NOUVEAU : Container en colonne avec padding responsive
    <div className="my-16 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center space-y-6">
        
        {/* BOUTON "Créer un texte" */}
        <Button 
          onClick={() => setIsFormVisible(!isFormVisible)} 
          className="flex items-center space-x-2 px-6 py-3"
        >
          <Plus className="w-5 h-5" />
          <span>{t('postForm.createPost')}</span>
        </Button>

        {/* FORMULAIRE */}
        <AnimatePresence>
          {isFormVisible && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full p-4 sm:p-6 border rounded-lg bg-white shadow-lg"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* TITRE */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('postForm.title')}
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Entrez le titre de votre texte..."
                  />
                </div>

                {/* CONTENU - NOUVEAU : Container responsive pour ReactQuill */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('postForm.content')}
                  </label>
                  <div className="w-full overflow-hidden">
                    <div className="quill-container">
                      <ReactQuill 
                        value={content} 
                        onChange={setContent} 
                        className="h-[18rem] sm:h-[20rem] lg:h-[22rem]"
                        modules={{
                          toolbar: [
                            [{ 'header': [1, 2, false] }],
                            ['bold', 'italic', 'underline'],
                            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                            ['link'],
                            ['clean']
                          ],
                        }}
                        formats={[
                          'header', 'bold', 'italic', 'underline',
                          'list', 'bullet', 'link'
                        ]}
                      />
                    </div>
                  </div>
                </div>

                {/* LANGUE */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('postForm.language')}
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="fr">{t('postForm.languageFrench')}</option>
                    <option value="en">{t('postForm.languageEnglish')}</option>
                  </select>
                </div>

                {/* PARTAGE AUTORISÉ */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="allowSharing"
                    checked={allowSharing}
                    onChange={() => setAllowSharing(!allowSharing)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="allowSharing" className="ml-2 text-sm text-gray-700">
                    {t('postForm.allowSharing')}
                  </label>
                </div>

                {/* IMAGE D'EN-TÊTE */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('postForm.headerImage')}
                  </label>
                  <input 
                    type="file" 
                    onChange={handleImageChange} 
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    accept="image/*"
                  />
                </div>

                {/* BOUTONS D'ACTION */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button 
                    type="submit" 
                    disabled={isLoading} 
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {isLoading ? t('postForm.sending') : t('postForm.submit')}
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => setShowPreview(!showPreview)}
                    variant="outline"
                    className="flex-1"
                  >
                    {showPreview ? t('postForm.hidePreview') : t('postForm.preview')}
                  </Button>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}
              </form>

              {/* PRÉVISUALISATION */}
              {showPreview && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 p-4 border rounded-lg bg-gray-50 overflow-hidden"
                >
                  {headerImage && (
                    <img
                      src={URL.createObjectURL(headerImage)}
                      alt={t('postForm.headerImage')}
                      className="w-full h-48 sm:h-64 object-cover rounded-md mb-4 shadow-lg"
                    />
                  )}
                  <h2 className="text-xl font-bold mb-3 break-words">{title || "Titre de votre texte"}</h2>
                  <div 
                    dangerouslySetInnerHTML={{ __html: content || "<p>Votre contenu apparaîtra ici...</p>" }} 
                    className="prose prose-sm sm:prose max-w-none break-words"
                  />
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PostCreateForm;