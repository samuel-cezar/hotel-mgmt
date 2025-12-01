import React, { useState, useEffect } from 'react';
import FormSelect from '../Common/FormSelect';
import DataTable from '../Common/DataTable';
import Alert from '../Common/Alert';
import { useCrudForm } from '../../hooks/useCrudForm';

const ReceitaListByCategoria = () => {
  const [categorias, setCategorias] = useState([]);
  const [receitas, setReceitas] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { fetchData } = useCrudForm();

  useEffect(() => {
    loadCategorias();
  }, []);

  const loadCategorias = async () => {
    try {
      const data = await fetchData('/categorias');
      setCategorias(data);
    } catch (error) {
      console.error('Error loading categories:', error);
      setErrorMessage('Failed to load categories');
    }
  };

  const handleCategoriaChange = async (e) => {
    const selectedCategoriaId = e.target.value;

    if (!selectedCategoriaId) {
      setReceitas([]);
      return;
    }

    try {
      setLoading(true);
      setErrorMessage('');
      const data = await fetchData(
        `/categorias/${selectedCategoriaId}/receitas`
      );
      setReceitas(data);
    } catch (error) {
      console.error('Error loading recipes:', error);
      setErrorMessage('Failed to load recipes');
      setReceitas([]);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'nome', label: 'Name' },
    {
      key: 'ingredientes',
      label: 'Ingredients',
      render: (value) => value.substring(0, 40) + (value.length > 40 ? '...' : ''),
    },
    {
      key: 'preparo',
      label: 'Instructions',
      render: (value) => value.substring(0, 40) + (value.length > 40 ? '...' : ''),
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
          <h1>Recipes by Category</h1>
          <p>Filter recipes by their assigned category</p>
        </div>

        {errorMessage && (
          <Alert
            type="error"
            message={errorMessage}
            onClose={() => setErrorMessage('')}
            dismissible
          />
        )}

        <div style={{ marginBottom: '3rem' }}>
          <div className="form-field">
            <label>Select Category</label>
            <FormSelect
              name="categoriaId"
              options={categoriaOptions}
              onChange={handleCategoriaChange}
              placeholder="Choose a category to view recipes"
            />
          </div>
        </div>

        {receitas.length > 0 ? (
          <div>
            <h2 style={{ marginBottom: '1.5rem' }}>
              Recipes ({receitas.length})
            </h2>
            <DataTable
              columns={columns}
              data={receitas}
              loading={loading}
              emptyMessage="No recipes found for this category."
            />
          </div>
        ) : (
          !loading && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>Select a category to view recipes</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ReceitaListByCategoria;
