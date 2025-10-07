# PDM 2025.2 — App Expo + Back-end Express

Aplicativo Expo/React Native **conectado a um back-end próprio em Node/Express**, substituindo o Back4App, conforme pedido na atividade.

## 📌 Links para avaliação

- **App (repositório com as mudanças):**  
  https://github.com/carlinhosborba/pdm-2025-2

- **Back-end Express (repositório separado):**  
  https://github.com/carlinhosborba/tarefas-api-express

- **App publicado (Expo OTA – QR na página):**  
  https://expo.dev/accounts/carlosborbab/projects/pdm-2025-2/updates/7c2d6b64-8002-40c3-88a7-0c179abd0555

- **API pública (Render):**  
  https://tarefas-api-express.onrender.com  
  Endpoint principal: `/tarefas`

> Dica: o Render Free pode “hibernar”. Se o primeiro acesso demorar, abra a raiz da API acima (200 OK) e depois volte ao app.

---

## 🚀 Como rodar o app localmente

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Configure a URL do back-end (já padrão para o Render). Se quiser sobrescrever, crie um `.env` na raiz do app:
   ```bash
   EXPO_PUBLIC_API_URL=https://tarefas-api-express.onrender.com
   ```

3. Inicie o app:
   ```bash
   npx expo start
   ```
   Abra no **Expo Go** (Android/iOS) ou emulador.

> A home (`app/index.tsx`) redireciona automaticamente para **/tarefas**.

---

## 🧠 O que foi alterado

- `api/index.js` agora usa **Axios** apontando para `EXPO_PUBLIC_API_URL` e fala com a API Express (`/tarefas`).
- Adaptadores de compatibilidade preservam o uso antigo (`objectId`) quando necessário, mapeando para `id`.
- Publicação **OTA (EAS Update)** feita, com link/QR acima.

---

## 🛠️ Back-end (Express) — Documentação rápida

**Base URL:** `https://tarefas-api-express.onrender.com`

> **Observação:** armazenamento **em memória** (apenas para a atividade). Reinícios do servidor limpam os dados.

### Rotas

- `GET /`  
  Retorna texto simples para verificação: “API de Tarefas rodando! Use /tarefas”.

- `GET /tarefas`  
  Lista todas as tarefas. **Resposta**:
  ```json
  [
    {
      "id": 1,
      "titulo": "Exemplo",
      "descricao": "Detalhe",
      "concluida": false,
      "createdAt": "2025-10-01T12:34:56.789Z"
    }
  ]
  ```

- `GET /tarefas/:id`  
  Retorna 404 se não existir.

- `POST /tarefas`  
  **Body:**
  ```json
  { "titulo": "Nova tarefa", "descricao": "opcional" }
  ```
  **Resposta 201:** tarefa criada.

- `PUT /tarefas/:id`  
  **Body (completo):**
  ```json
  { "titulo": "Atualizado", "descricao": "texto", "concluida": true }
  ```

- `PATCH /tarefas/:id`  
  **Body (parcial):** qualquer campo para atualizar.

- `DELETE /tarefas/:id`  
  **Resposta 204** sem corpo.

### Testes rápidos (cURL)

```bash
# Criar
curl -i -X POST https://tarefas-api-express.onrender.com/tarefas   -H "Content-Type: application/json"   -d '{"titulo":"Primeira do Prod","descricao":"criada pelo terminal"}'

# Listar
curl -i https://tarefas-api-express.onrender.com/tarefas

# Atualizar (PUT)
curl -i -X PUT https://tarefas-api-express.onrender.com/tarefas/1   -H "Content-Type: application/json"   -d '{"titulo":"Atualizada","descricao":"detalhe","concluida":true}'

# Remover
curl -i -X DELETE https://tarefas-api-express.onrender.com/tarefas/1
```

---

## 🧩 Stack

- **App:** Expo (Router), React Native, Axios, EAS Update (OTA)
- **UI:** NativeWind (Tailwind RN) + componentes simples
- **Back-end:** Node.js + Express + CORS

---

## ✅ Entrega

- Código no GitHub (app e back-end)
- App publicado no Expo (OTA com QR)
- API disponível publicamente (Render)

Qualquer problema para abrir o QR no Expo Go, use o link da atualização OTA acima.
