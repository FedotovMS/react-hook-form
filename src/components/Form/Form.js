import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import yupSchema from './yupSchema';
import axios from 'axios';
import css from './Form.module.css';
import Select from 'react-select';
import FormTitle from './FormTiltle';

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

  const addIngredient = () => {
    const ingredient = watch('ingredient');
    const quantity = watch('quantity');
    if (ingredient && quantity) {
      setSelectedIngredients([
        ...selectedIngredients,
        { name: ingredient, quantity },
      ]);
      setValue('ingredient', '');
      setValue('quantity', '');
    }
  };

  const removeIngredient = index => {
    setSelectedIngredients(selectedIngredients.filter((_, i) => i !== index));
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setValue('image', e.target.files);
    }
  };

  const handleReset = () => {
    reset();
    setImagePreview(null);
    setSelectedIngredients([]);
  };

  const incrementCookingTime = () => {
    setCookingTime(prevTime => prevTime + 1);
  };

  const decrementCookingTime = () => {
    setCookingTime(prevTime => (prevTime > 1 ? prevTime - 1 : 1));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={css.form}>
      <FormTitle />
      <div className={css.formWraper}>
        <div className={css.uploadBox}>
          <label className={css.customUploadBtn}>
            <input
              type="file"
              {...register('image')}
              onChange={handleImageChange}
            />
            {errors.image && <p>{errors.image.message}</p>}
            {imagePreview && <img src={imagePreview} alt="Recipe Preview" />}
            Upload a photo
          </label>
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

          <div>
            <label>Cooking Time (minutes)</label>
            <div>
              <button type="button" onClick={decrementCookingTime}>
                -
              </button>
              <input
                type="number"
                {...register('cookingTime')}
                value={cookingTime}
                onChange={e =>
                  setCookingTime(Math.max(1, parseInt(e.target.value)))
                }
                min="1"
                readOnly
                style={{ width: '50px', textAlign: 'center' }}
              />
              <span>min</span>
              <button type="button" onClick={incrementCookingTime}>
                +
              </button>
            </div>
            {errors.cookingTime && <p>{errors.cookingTime.message}</p>}
          </div>

          <div>
            <label>Ingredient</label>
            <Controller
              name="ingredient"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={ingredients}
                  placeholder="Select an ingredient"
                />
              )}
            />
            {errors.ingredient && <p>{errors.ingredient.message}</p>}
          </div>

          <div>
            <input
              type="number"
              {...register('quantity')}
              placeholder="Enter quantity"
            />
            {errors.quantity && <p>{errors.quantity.message}</p>}
          </div>

          <button type="button" onClick={addIngredient}>
            Add ingredient+
          </button>

          <div>
            {selectedIngredients.map((ingredient, index) => (
              <div key={index}>
                <img src={ingredient.image} alt={ingredient.name} />
                <p>
                  {ingredient.name}: {ingredient.quantity}
                </p>
                <button type="button" onClick={() => removeIngredient(index)}>
                  Remove
                </button>
              </div>
            ))}
          </div>

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
