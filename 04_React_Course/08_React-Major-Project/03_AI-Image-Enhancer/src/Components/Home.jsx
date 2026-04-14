import React, { useState } from "react";
import ImageUpload from "./ImageUpload";
import ImagePreview from "./ImagePreview";
import enhancedImageAPI from "../utils/enhancedImageApi";

const Home = () => {
  const [uploadImage, setUploadImage] = useState(null);
  const [enhancedImage, setEnhancedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const uploadImagehandler = async (file) => {
    console.log(URL.createObjectURL(file)); // console
    setUploadImage(URL.createObjectURL(file));
    setLoading(true);

    try {
      // code which may produce error
      const enhancedURL = await enhancedImageAPI(file);
      setEnhancedImage(enhancedURL);
      setLoading(false);
    } catch (error) {
      // code to handle the error and show message
      console.log(error);
      alert("Error while enhancing the image. Please try again later");
    }
  };

  return (
    <>
      {/* Parent rendered the ImageUpload component and passed a prop*/}
      <ImageUpload uploadImagehandler={uploadImagehandler} />
      <ImagePreview
        loading={loading}
        uploaded={uploadImage}
        enhanced={enhancedImage}
      />
    </>
  );
};

export default Home;
