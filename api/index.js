// api/index.js
import axios from "axios";

// ---- Axios configurado para seu backend no Render
const instance = axios.create({
  baseURL:
    process.env.EXPO_PUBLIC_API_URL ??
    "https://tarefas-api-express.onrender.com",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// ---- Helpers de compatibilidade (UI antiga x API nova)
const getId = (t) => t?.id ?? t?.objectId; // aceita id OU objectId
const toOldShape = (t) => ({ ...t, objectId: t.id ?? t.objectId }); // expõe objectId também

// Listar — retorna um ARRAY e também expõe .results = array (compat total)
export async function getTarefas() {
  const { data } = await instance.get("/tarefas");
  const listArr = (Array.isArray(data) ? data : data?.results ?? []).map(toOldShape);
  listArr.results = listArr; // permite usar tanto array direto quanto { results }
  return listArr;
}

// Criar (usa descricao como título se não vier titulo)
export async function addTarefa({ titulo, descricao }) {
  const safeTitulo = titulo ?? descricao ?? "Sem título";
  const safeDescricao = descricao ?? "";
  const { data } = await instance.post("/tarefas", {
    titulo: safeTitulo,
    descricao: safeDescricao,
  });
  return toOldShape(data);
}

// Atualizar (PUT)
export async function updateTarefa(tarefa) {
  const id = getId(tarefa);
  const { data } = await instance.put(`/tarefas/${id}`, {
    titulo: tarefa.titulo ?? tarefa.descricao ?? "Sem título",
    descricao: tarefa.descricao ?? "",
    concluida: !!tarefa.concluida,
  });
  return toOldShape(data);
}

// Marcar/desmarcar como concluída (PATCH)
export async function toggleConclusao(tarefaOrId, concluida) {
  const id = typeof tarefaOrId === "object" ? getId(tarefaOrId) : tarefaOrId;
  const { data } = await instance.patch(`/tarefas/${id}`, { concluida: !!concluida });
  return toOldShape(data);
}

// Remover
export async function deleteTarefa(tarefa) {
  const id = getId(tarefa);
  await instance.delete(`/tarefas/${id}`);
  return true;
}
