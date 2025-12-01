import React, { useState, useEffect } from 'react';
import FormInput from '../Common/FormInput';
import FormSelect from '../Common/FormSelect';
import FormTextarea from '../Common/FormTextarea';
import FormContainer from '../Common/FormContainer';
import Alert from '../Common/Alert';
import DataTable from '../Common/DataTable';
import { useCrudForm } from '../../hooks/useCrudForm';

const ReceitaForm = () => {
  const [receitas, setReceitas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const {
    formData,
    handleFieldChange,
    successMessage,
    errorMessage,
    loading,
    fetchData,
    createData,
    updateData,
    deleteData,
    clearMessages,
    resetForm,
  } = useCrudForm({
    nome: '',
    ingredientes: '',
    preparo: '',
    imagem: '',
    categoriaId: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [receitasData, categoriasData] = await Promise.all([
        fetchData('/receitas'),
        fetchData('/categorias'),
      ]);
      setReceitas(receitasData);
      setCategorias(categoriasData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nome || !formData.ingredientes || !formData.preparo || !formData.categoriaId) {
      return;
    }

    try {
      if (editingId) {
        await updateData(`/receitas/${editingId}`, formData);
      } else {
        await createData('/receitas', formData);
      }
      resetForm();
      setEditingId(null);
      loadData();
    } catch (error) {
      console.error('Error saving recipe:', error);
    }
  };

  const handleEdit = (receita) => {
    setEditingId(receita.id);
    Object.keys(receita).forEach((key) => {
      if (key in formData) {
        handleFieldChange(key, receita[key]);
      }
    });
  };

  const handleDelete = async (receita) => {
    try {
      await deleteData(`/receitas/${receita.id}`);
      loadData();
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };

  const handleCancel = () => {
    resetForm();
    setEditingId(null);
  };

  const columns = [
    { key: 'nome', label: 'Name' },
    {
      key: 'ingredientes',
      label: 'Ingredients',
      render: (value) => value.substring(0, 50) + (value.length > 50 ? '...' : ''),
    },
    {
      key: 'preparo',
      label: 'Instructions',
      render: (value) => value.substring(0, 50) + (value.length > 50 ? '...' : ''),
    },
    {
      key: 'categoriaId',
      label: 'Category',
      render: (value) => {
        const cat = categorias.find((c) => c.id === value);
        return cat?.nome || 'N/A';
      },
    },
  ];

  const categoriaOptions = categorias.map((c) => ({
    value: c.id,
    label: c.nome,
  }));

  return (
    <div className="container">
      <div className="page">
        <div className="page-header">
          <h1>Recipe Management</h1>
          <p>Create and manage cooking recipes</p>
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

        <div style={{ marginBottom: '3rem' }}>
          <FormContainer
            title={editingId ? 'Edit Recipe' : 'New Recipe'}
            loading={loading}
            submitText={editingId ? 'Update Recipe' : 'Create Recipe'}
            onSubmit={handleSubmit}
            cancelButton={editingId}
            onCancel={handleCancel}
          >
            <FormInput
              label="Recipe Name"
              name="nome"
              type="text"
              value={formData.nome}
              onChange={(e) => handleFieldChange('nome', e.target.value)}
              placeholder="e.g., Chocolate Cake"
              helpText="Enter the name of the recipe"
              required
            />
            <FormSelect
              label="Category"
              name="categoriaId"
              value={formData.categoriaId}
              onChange={(e) => handleFieldChange('categoriaId', e.target.value)}
              options={categoriaOptions}
              placeholder="Select a category"
              required
            />
            <FormTextarea
              label="Ingredients"
              name="ingredientes"
              value={formData.ingredientes}
              onChange={(e) => handleFieldChange('ingredientes', e.target.value)}
              placeholder="List all ingredients..."
              helpText="Enter each ingredient on a new line"
              rows={6}
              required
            />
            <FormTextarea
              label="Instructions"
              name="preparo"
              value={formData.preparo}
              onChange={(e) => handleFieldChange('preparo', e.target.value)}
              placeholder="Describe how to prepare the recipe..."
              helpText="Step-by-step cooking instructions"
              rows={6}
              required
            />
            <div className="form-field-full">
              <FormInput
                label="Image URL"
                name="imagem"
                type="text"
                value={formData.imagem}
                onChange={(e) => handleFieldChange('imagem', e.target.value)}
                placeholder="https://example.com/image.jpg"
                helpText="Link to a recipe image (optional)"
              />
            </div>
          </FormContainer>
        </div>

        <div>
          <h2 style={{ marginBottom: '1.5rem' }}>Recipes List</h2>
          <DataTable
            columns={columns}
            data={receitas}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            emptyMessage="No recipes found. Create one to get started."
          />
        </div>
      </div>
    </div>
  );
};

export default ReceitaForm;
