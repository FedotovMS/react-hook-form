import React from 'react';
import Select from 'react-select';
import { Controller } from 'react-hook-form';
import css from './IngredientSelector.module.css';

const IngredientSelector = ({
  control,
  register,
  setValue,
  watch,
  ingredients,
  selectedIngredients,
  setSelectedIngredients,
  errors,
}) => {
  const addIngredient = () => {
    const ingredient = watch('ingredient');
    const quantity = watch('quantity');
    if (ingredient && quantity) {
      setSelectedIngredients([
        ...selectedIngredients,
        { name: ingredient.label, quantity },
      ]);
      setValue('ingredient', null);
      setValue('quantity', '');
    }
  };

  const removeIngredient = index => {
    setSelectedIngredients(selectedIngredients.filter((_, i) => i !== index));
  };

  return (
    <div className={css.container}>
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
        <label>Quantity</label>
        <input type="number" {...register('quantity')} />
        {errors.quantity && <p>{errors.quantity.message}</p>}
      </div>

      <button type="button" onClick={addIngredient}>
        Add ingredient+
      </button>

      <div>
        {selectedIngredients.map((ingredient, index) => (
          <div key={index}>
            <p>
              {ingredient.name}: {ingredient.quantity}
            </p>
            <button type="button" onClick={() => removeIngredient(index)}>
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IngredientSelector;
