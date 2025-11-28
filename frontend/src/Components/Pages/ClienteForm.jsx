import { useState, useEffect } from 'react';

export default function ClienteForm() {
    const [clientes, setClientes] = useState([]);
    const [formData, setFormData] = useState({
        nome: '',
        cpf: '',
        email: '',
        telefone: ''
    });
    const [editingId, setEditingId] = useState(null);
    const token = localStorage.getItem('token');
    const baseUrl = 'http://localhost:8081/api';

    useEffect(() => {
        fetchClientes();
    }, []);

    const fetchClientes = async () => {
        try {
            const response = await fetch(`${baseUrl}/clientes`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Erro ao buscar clientes');
            const data = await response.json();
            setClientes(data);
        } catch (error) {
            alert(`Erro ao listar clientes: ${error.message}`);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.nome || !formData.cpf || !formData.email || !formData.telefone) {
            alert('Por favor, preencha todos os campos');
            return;
        }

        try {
            const method = editingId ? 'PUT' : 'POST';
            const url = editingId ? `${baseUrl}/clientes/${editingId}` : `${baseUrl}/clientes`;

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Erro ao salvar cliente');

            setFormData({ nome: '', cpf: '', email: '', telefone: '' });
            setEditingId(null);
            fetchClientes();
            alert(editingId ? 'Cliente atualizado com sucesso!' : 'Cliente criado com sucesso!');
        } catch (error) {
            alert(`Erro ao salvar cliente: ${error.message}`);
        }
    };

    const handleEdit = (cliente) => {
        setFormData(cliente);
        setEditingId(cliente.id);
    };

    const handleDelete = async (id) => {
        if (confirm('Tem certeza que deseja deletar este cliente?')) {
            try {
                const response = await fetch(`${baseUrl}/clientes/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) throw new Error('Erro ao deletar cliente');
                fetchClientes();
                alert('Cliente deletado com sucesso!');
            } catch (error) {
                alert(`Erro ao deletar cliente: ${error.message}`);
            }
        }
    };

    const handleCancel = () => {
        setFormData({ nome: '', cpf: '', email: '', telefone: '' });
        setEditingId(null);
    };

    return (
        <div className="container">
            <h1>Gerenciamento de Clientes</h1>

            <div className="form-section">
                <h2>{editingId ? 'Editar Cliente' : 'Novo Cliente'}</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="nome"
                        placeholder="Nome"
                        value={formData.nome}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="cpf"
                        placeholder="CPF"
                        value={formData.cpf}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="telefone"
                        placeholder="Telefone"
                        value={formData.telefone}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit">{editingId ? 'Atualizar' : 'Criar'}</button>
                    {editingId && <button type="button" onClick={handleCancel}>Cancelar</button>}
                </form>
            </div>

            <div className="list-section">
                <h2>Lista de Clientes</h2>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>CPF</th>
                            <th>Email</th>
                            <th>Telefone</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientes.map(cliente => (
                            <tr key={cliente.id}>
                                <td>{cliente.id}</td>
                                <td>{cliente.nome}</td>
                                <td>{cliente.cpf}</td>
                                <td>{cliente.email}</td>
                                <td>{cliente.telefone}</td>
                                <td>
                                    <button onClick={() => handleEdit(cliente)}>Editar</button>
                                    <button onClick={() => handleDelete(cliente.id)}>Deletar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
