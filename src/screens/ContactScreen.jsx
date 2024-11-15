import { useRef } from 'react';
import FormContainer from '@/components/FormContainer';
import emailjs from 'emailjs-com';

const ContactScreen = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        form.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY 
      )
      .then(
        (result) => {
          console.log('Email envoyé avec succès:', result.text);
          form.current.reset(); 
        },
        (error) => {
          console.error('Échec de l\'envoi de l\'email:', error.text);
        }
      );
  };

  return (
    <FormContainer>
      <h1 className="text-2xl font-bold mb-6 text-center">Contactez-nous</h1>
      <form ref={form} onSubmit={sendEmail} className="flex flex-col space-y-4">
        <label>Nom</label>
        <input type="text" name="user_name" className="border p-2" required />
        <label>Email</label>
        <input type="email" name="user_email" className="border p-2" required />
        <label>Message</label>
        <textarea name="message" className="border p-2" rows="5" required />
        <input
          type="submit"
          value="Envoyer"
          className="mt-3 w-full bg-gray-900 text-white text-md py-2 px-4 rounded-md hover:bg-gray-900/80 transition duration-1000 hover:text-gray-100"
        />
      </form>
    </FormContainer>
  );
};

export default ContactScreen;