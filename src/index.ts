import express from 'express';
import userRoutes from './routes/userRoutes'
import taskRoutes from './routes/taskRoutes'
const cors = require("cors");


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
// Middleware para interpretar JSON no corpo das requisições
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/tasks', taskRoutes);

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});