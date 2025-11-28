import { useState, useEffect } from 'react';

export default function ReservaForm() {
    const [reservas, setReservas] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [quartos, setQuartos] = useState([]);
    const [formData, setFormData] = useState({
        clienteId: '',
        quartoId: '',
        data_entrada: '',
        data_saida: ''
    });
    const [editingId, setEditingId] = useState(null);
    const token = localStorage.getItem('token');
    const baseUrl = 'http://localhost:8081/api';

    useEffect(() => {
        fetchReservas();
        fetchClientes();
        fetchQuartos();
    }, []);

    const fetchReservas = async () => {
        try {
            const response = await fetch(`${baseUrl}/reservas`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Erro ao buscar reservas');
            const data = await response.json();
            setReservas(data);
        } catch (error) {
            alert(`Erro ao listar reservas: ${error.message}`);
        }
    };

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
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.clienteId || !formData.quartoId || !formData.data_entrada || !formData.data_saida) {
            alert('Por favor, preencha todos os campos');
            return;
        }

        const entrada = new Date(formData.data_entrada);
        const saida = new Date(formData.data_saida);

        if (saida <= entrada) {
            alert('Data de saída deve ser maior que data de entrada');
            return;
        }

        try {
            const method = editingId ? 'PUT' : 'POST';
            const url = editingId ? `${baseUrl}/reservas/${editingId}` : `${baseUrl}/reservas`;

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao salvar reserva');
            }

            setFormData({ clienteId: '', quartoId: '', data_entrada: '', data_saida: '' });
            setEditingId(null);
            fetchReservas();
            alert(editingId ? 'Reserva atualizada com sucesso!' : 'Reserva criada com sucesso!');
        } catch (error) {
            alert(`Erro ao salvar reserva: ${error.message}`);
        }
    };

    const handleEdit = (reserva) => {
        setFormData({
            clienteId: reserva.clienteId,
            quartoId: reserva.quartoId,
            data_entrada: reserva.data_entrada.split('T')[0],
            data_saida: reserva.data_saida.split('T')[0]
        });
        setEditingId(reserva.id);
    };

    const handleDelete = async (id) => {
        if (confirm('Tem certeza que deseja deletar esta reserva?')) {
            try {
                const response = await fetch(`${baseUrl}/reservas/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) throw new Error('Erro ao deletar reserva');
                fetchReservas();
                alert('Reserva deletada com sucesso!');
            } catch (error) {
                alert(`Erro ao deletar reserva: ${error.message}`);
            }
        }
    };

    const handleCancel = () => {
        setFormData({ clienteId: '', quartoId: '', data_entrada: '', data_saida: '' });
        setEditingId(null);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    return (
        <div className="container">
            <h1>Gerenciamento de Reservas</h1>

            <div className="form-section">
                <h2>{editingId ? 'Editar Reserva' : 'Nova Reserva'}</h2>
                <form onSubmit={handleSubmit}>
                    <select
                        name="clienteId"
                        value={formData.clienteId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecione um Cliente</option>
                        {clientes.map(cliente => (
                            <option key={cliente.id} value={cliente.id}>
                                {cliente.nome}
                            </option>
                        ))}
                    </select>
                    <select
                        name="quartoId"
                        value={formData.quartoId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecione um Quarto</option>
                        {quartos.map(quarto => (
                            <option key={quarto.id} value={quarto.id}>
                                Quarto {quarto.numero} - {quarto.tipo} (R$ {parseFloat(quarto.preco).toFixed(2)}/noite)
                            </option>
                        ))}
                    </select>
                    <input
                        type="date"
                        name="data_entrada"
                        value={formData.data_entrada}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="date"
                        name="data_saida"
                        value={formData.data_saida}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit">{editingId ? 'Atualizar' : 'Criar'}</button>
                    {editingId && <button type="button" onClick={handleCancel}>Cancelar</button>}
                </form>
            </div>

            <div className="list-section">
                <h2>Lista de Reservas</h2>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Cliente</th>
                            <th>Quarto</th>
                            <th>Entrada</th>
                            <th>Saída</th>
                            <th>Valor Total</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservas.map(reserva => (
                            <tr key={reserva.id}>
                                <td>{reserva.id}</td>
                                <td>{reserva.cliente?.nome || 'N/A'}</td>
                                <td>Quarto {reserva.quarto?.numero}</td>
                                <td>{formatDate(reserva.data_entrada)}</td>
                                <td>{formatDate(reserva.data_saida)}</td>
                                <td>R$ {parseFloat(reserva.valor_total).toFixed(2)}</td>
                                <td>
                                    <button onClick={() => handleEdit(reserva)}>Editar</button>
                                    <button onClick={() => handleDelete(reserva.id)}>Deletar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
