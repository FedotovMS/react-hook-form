import AddRecipeForm from './Form/AddRecipeForm';
import css from './App.module.css';

export const App = () => {
  return (
    <div className={css.container}>
      <AddRecipeForm />
    </div>
  );
};
