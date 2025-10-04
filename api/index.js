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
const getId = (t) => t?.id ?? t?.objectId;                // aceita id OU objectId
const toOldShape = (t) => ({ ...t, objectId: t.id ?? t.objectId }); // expõe objectId também

// Listar
export async function getTarefas() {
  const { data } = await instance.get("/tarefas");
  // API nova retorna um array direto; Back4App era data.results
  const list = Array.isArray(data) ? data : data?.results ?? [];
  return list.map(toOldShape);
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

// Remover
export async function deleteTarefa(tarefa) {
  const id = getId(tarefa);
  await instance.delete(`/tarefas/${id}`);
  return true;
}
