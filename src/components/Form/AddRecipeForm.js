import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import yupSchema from './yupSchema';
import axios from 'axios';
import css from './Form.module.css';
import Select from 'react-select';
import FormTitle from './FormTiltle';
import CookingTimeCounter from './CookingTimeCounter';
import ImageUploader from './ImageUploader';
import IngredientSelector from './IngredientSelector';

const AddRecipeForm = () => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const [categories, setCategories] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [cookingTime, setCookingTime] = useState(1);

  useEffect(() => {
    // Fetch categories and ingredients from backend
    axios.get('/api/categories').then(response => setCategories(response.data));
    axios
      .get('/api/ingredients')
      .then(response => setIngredients(response.data));
  }, []);

  const onSubmit = data => {
    const formData = new FormData();
    formData.append('image', data.image[0]);
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('category', data.category);
    formData.append('cookingTime', data.cookingTime);
    formData.append('instructions', data.instructions);
    selectedIngredients.forEach((ingredient, index) => {
      formData.append(`ingredients[${index}][name]`, ingredient.name);
      formData.append(`ingredients[${index}][quantity]`, ingredient.quantity);
    });

    axios
      .post('/api/recipes', formData)
      .then(() => {
        // Redirect to user page on success
        window.location.href = '/userPage';
      })
      .catch(error => {
        alert('Error: ' + error.response.data.message);
      });
  };

  const handleReset = () => {
    reset();
    setImagePreview(null);
    setSelectedIngredients([]);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={css.form}>
      <FormTitle />
      <div className={css.formWraper}>
        <div className={css.uploadBox}>
          <ImageUploader
            register={register}
            setValue={setValue}
            imagePreview={imagePreview}
            setImagePreview={setImagePreview}
            errors={errors}
          />
        </div>
        <div className={css.formElements}>
          <div>
            <input
              type="text"
              {...register('title')}
              placeholder="The name of the recipe"
            />
            {errors.title && <p>{errors.title.message}</p>}
          </div>

          <div>
            <textarea
              {...register('description')}
              maxLength="200"
              placeholder="Enter the description of the dish"
            />
            <span>{watch('description')?.length || 0}/200</span>
            {errors.description && <p>{errors.description.message}</p>}
          </div>

          <div>
            <label>Category</label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={categories}
                  placeholder="Select a category"
                />
              )}
            />
            {errors.category && <p>{errors.category.message}</p>}
          </div>

          <CookingTimeCounter
            cookingTime={cookingTime}
            setCookingTime={setCookingTime}
          />
          {errors.cookingTime && <p>{errors.cookingTime.message}</p>}

          <IngredientSelector
            control={control}
            register={register}
            setValue={setValue}
            watch={watch}
            ingredients={ingredients}
            selectedIngredients={selectedIngredients}
            setSelectedIngredients={setSelectedIngredients}
            errors={errors}
          />

          <div className={css.recipePreparation}>
            <label>Recipe preparation</label>
            <div>
              <textarea
                {...register('instructions')}
                maxLength="200"
                placeholder="Enter recipe"
              />
              <span>{watch('instructions')?.length || 0}/200</span>
              {errors.instructions && <p>{errors.instructions.message}</p>}
            </div>
          </div>

          <button type="button" onClick={handleReset}>
            Clear
          </button>
          <button type="submit">Publish</button>
        </div>
      </div>
    </form>
  );
};

export default AddRecipeForm;
