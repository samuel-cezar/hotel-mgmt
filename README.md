# Sistema de Gestão de Hotel

## 🇧🇷 Português Brasileiro

### Descrição
Sistema completo de gerenciamento hoteleiro com cadastro de clientes, controle de quartos e reservas. Desenvolvido com **Node.js + Express** no backend e **React + Vite** no frontend, usando **PostgreSQL** como banco de dados e arquitetura **MVC**.

### ✨ Funcionalidades
- ✅ Autenticação JWT
- ✅ Cadastro e gestão de clientes (CRUD)
- ✅ Gerenciamento de quartos com tipos e preços
- ✅ Sistema de reservas com validação de datas e disponibilidade
- ✅ Cálculo automático de valor total (dias × preço/noite)
- ✅ Rotas protegidas

### 🛠️ Tecnologias
- **Backend**: Node.js, Express, Sequelize
- **Frontend**: React, Vite, React Router
- **Database**: PostgreSQL
- **Auth**: JWT
- **Containerização**: Docker + Docker Compose

### 🚀 Quick Start
```bash
# Iniciar containers
docker-compose up -d --build

# Backend: http://localhost:8081
# Frontend: http://localhost:5173
# Login: admin / 1234
```

### 📂 Estrutura
```
api/                    # Backend Express
├── models/            # Modelos Sequelize (Cliente, Quarto, Reserva)
├── controllers/       # Lógica de negócio (CRUD + validações)
├── routers/          # Endpoints da API
└── middleware/       # Autenticação JWT

frontend/             # Frontend React + Vite
├── src/
│   ├── Components/   # Componentes reutilizáveis
│   └── Pages/        # Páginas de CRUD
```

---

## 🇺🇸 English

### Description
Complete hotel management system with client registration, room control and reservations. Built with **Node.js + Express** backend and **React + Vite** frontend, using **PostgreSQL** database and **MVC** architecture.

### ✨ Features
- ✅ JWT Authentication
- ✅ Client management (CRUD)
- ✅ Room management with types and prices
- ✅ Reservation system with date validation and availability check
- ✅ Automatic total value calculation (days × price/night)
- ✅ Protected routes

### 🛠️ Tech Stack
- **Backend**: Node.js, Express, Sequelize
- **Frontend**: React, Vite, React Router
- **Database**: PostgreSQL
- **Auth**: JWT
- **Containerization**: Docker + Docker Compose

### 🚀 Quick Start
```bash
# Start containers
docker-compose up -d --build

# Backend: http://localhost:8081
# Frontend: http://localhost:5173
# Login: admin / 1234
```

### 📂 Structure
```
api/                    # Express Backend
├── models/            # Sequelize Models (Client, Room, Reservation)
├── controllers/       # Business logic (CRUD + validations)
├── routers/          # API endpoints
└── middleware/       # JWT authentication

frontend/             # React + Vite Frontend
├── src/
│   ├── Components/   # Reusable components
│   └── Pages/        # CRUD pages
```

### 📖 Documentation
See `REFACTORING_GUIDE.md` for complete technical details.

---

**Author**: Samuel Cezar | **Branch**: dev/frontend-overhaul
