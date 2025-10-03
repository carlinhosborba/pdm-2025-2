import axios from "axios";

// instância já apontando para sua API no Render
const instance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL ?? "https://tarefas-api-express.onrender.com",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Listar
export async function getTarefas() {
  const { data } = await instance.get("/tarefas");
  return data;
}

// Criar
export async function addTarefa({ titulo, descricao }) {
  const { data } = await instance.post("/tarefas", { titulo, descricao });
  return data;
}

// Atualizar (PUT)
export async function updateTarefa(tarefa) {
  const { data } = await instance.put(`/tarefas/${tarefa.id}`, {
    titulo: tarefa.titulo,
    descricao: tarefa.descricao,
    concluida: tarefa.concluida,
  });
  return data;
}

// Remover
export async function deleteTarefa(tarefa) {
  await instance.delete(`/tarefas/${tarefa.id}`);
  return true;
}
