import React from 'react';
import css from './ImageUploader.module.css';

const ImageUploader = ({
  register,
  setValue,
  imagePreview,
  setImagePreview,
  errors,
}) => {
  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setValue('image', e.target.files);
    }
  };

  return (
    <div className={css.uploadBox}>
      <label className={css.customUploadBtn}>
        <input
          type="file"
          {...register('image')}
          onChange={handleImageChange}
        />
        {errors.image && <p>{errors.image.message}</p>}
        {imagePreview && <img src={imagePreview} alt="Recipe Preview" />}
        <span>Upload a photo</span>
      </label>
    </div>
  );
};

export default ImageUploader;
