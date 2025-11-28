import { useState, useEffect } from 'react';

export default function QuartoForm() {
    const [quartos, setQuartos] = useState([]);
    const [formData, setFormData] = useState({
        numero: '',
        tipo: 'Simples',
        preco: '',
        disponivel: true
    });
    const [editingId, setEditingId] = useState(null);
    const token = localStorage.getItem('token');
    const baseUrl = 'http://localhost:8081/api';

    useEffect(() => {
        fetchQuartos();
    }, []);

    const fetchQuartos = async () => {
        try {
            const response = await fetch(`${baseUrl}/quartos`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Erro ao buscar quartos');
            const data = await response.json();
            setQuartos(data);
        } catch (error) {
            alert(`Erro ao listar quartos: ${error.message}`);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.numero || !formData.tipo || !formData.preco) {
            alert('Por favor, preencha todos os campos');
            return;
        }

        if (formData.preco <= 0) {
            alert('Preço deve ser maior que zero');
            return;
        }

        try {
            const method = editingId ? 'PUT' : 'POST';
            const url = editingId ? `${baseUrl}/quartos/${editingId}` : `${baseUrl}/quartos`;

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Erro ao salvar quarto');

            setFormData({ numero: '', tipo: 'Simples', preco: '', disponivel: true });
            setEditingId(null);
            fetchQuartos();
            alert(editingId ? 'Quarto atualizado com sucesso!' : 'Quarto criado com sucesso!');
        } catch (error) {
            alert(`Erro ao salvar quarto: ${error.message}`);
        }
    };

    const handleEdit = (quarto) => {
        setFormData(quarto);
        setEditingId(quarto.id);
    };

    const handleDelete = async (id) => {
        if (confirm('Tem certeza que deseja deletar este quarto?')) {
            try {
                const response = await fetch(`${baseUrl}/quartos/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) throw new Error('Erro ao deletar quarto');
                fetchQuartos();
                alert('Quarto deletado com sucesso!');
            } catch (error) {
                alert(`Erro ao deletar quarto: ${error.message}`);
            }
        }
    };

    const handleCancel = () => {
        setFormData({ numero: '', tipo: 'Simples', preco: '', disponivel: true });
        setEditingId(null);
    };

    return (
        <div className="container">
            <h1>Gerenciamento de Quartos</h1>

            <div className="form-section">
                <h2>{editingId ? 'Editar Quarto' : 'Novo Quarto'}</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="numero"
                        placeholder="Número do Quarto"
                        value={formData.numero}
                        onChange={handleChange}
                        required
                    />
                    <select
                        name="tipo"
                        value={formData.tipo}
                        onChange={handleChange}
                        required
                    >
                        <option value="Simples">Simples</option>
                        <option value="Duplo">Duplo</option>
                        <option value="Suíte">Suíte</option>
                    </select>
                    <input
                        type="number"
                        name="preco"
                        placeholder="Preço da Diária"
                        step="0.01"
                        value={formData.preco}
                        onChange={handleChange}
                        required
                    />
                    <label>
                        <input
                            type="checkbox"
                            name="disponivel"
                            checked={formData.disponivel}
                            onChange={handleChange}
                        />
                        Disponível
                    </label>
                    <button type="submit">{editingId ? 'Atualizar' : 'Criar'}</button>
                    {editingId && <button type="button" onClick={handleCancel}>Cancelar</button>}
                </form>
            </div>

            <div className="list-section">
                <h2>Lista de Quartos</h2>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Número</th>
                            <th>Tipo</th>
                            <th>Preço/Diária</th>
                            <th>Disponível</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {quartos.map(quarto => (
                            <tr key={quarto.id}>
                                <td>{quarto.id}</td>
                                <td>{quarto.numero}</td>
                                <td>{quarto.tipo}</td>
                                <td>R$ {parseFloat(quarto.preco).toFixed(2)}</td>
                                <td>{quarto.disponivel ? 'Sim' : 'Não'}</td>
                                <td>
                                    <button onClick={() => handleEdit(quarto)}>Editar</button>
                                    <button onClick={() => handleDelete(quarto.id)}>Deletar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
