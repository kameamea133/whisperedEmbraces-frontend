/* eslint-disable react/prop-types */
const FormContainer = ({ children }) => {
  return (
    <div className="flex justify-center items-center min-h-screen p-4 sm:p-6 bg-gray-100">
      <div className="w-full max-w-md bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-md">
        {children}
      </div>
    </div>
  );
};

export default FormContainer;
