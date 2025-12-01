import React from 'react';
import FormInput from '../Common/FormInput';
import FormContainer from '../Common/FormContainer';
import Alert from '../Common/Alert';
import { useCrudForm } from '../../hooks/useCrudForm';

const CategoriaForm = () => {
  const {
    formData,
    handleFieldChange,
    successMessage,
    errorMessage,
    loading,
    createData,
    clearMessages,
    resetForm,
  } = useCrudForm({ nome: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nome.trim()) {
      return;
    }

    try {
      await createData('/categorias', formData);
      resetForm();
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  return (
    <div className="container container-sm">
      <div className="page">
        <div className="page-header">
          <h1>Create Category</h1>
          <p>Add a new product category to the system</p>
        </div>

        {successMessage && (
          <Alert
            type="success"
            message={successMessage}
            onClose={clearMessages}
            dismissible
          />
        )}

        {errorMessage && (
          <Alert
            type="error"
            message={errorMessage}
            onClose={clearMessages}
            dismissible
          />
        )}

        <FormContainer
          title="New Category"
          singleColumn
          loading={loading}
          submitText="Create Category"
          onSubmit={handleSubmit}
        >
          <FormInput
            label="Category Name"
            name="nome"
            type="text"
            value={formData.nome}
            onChange={(e) => handleFieldChange('nome', e.target.value)}
            placeholder="e.g., Electronics, Clothing, Food"
            helpText="Enter a unique category name"
            required
          />
        </FormContainer>
      </div>
    </div>
  );
};

export default CategoriaForm;
