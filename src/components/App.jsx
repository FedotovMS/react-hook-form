import AddRecipeForm from './Form/AddRecipeForm';

export const App = () => {
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 18,
        color: '#010101',
      }}
    >
      <AddRecipeForm />
    </div>
  );
};
