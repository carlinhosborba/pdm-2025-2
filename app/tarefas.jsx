// app/tarefas.jsx
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  getTarefas,
  addTarefa,
  updateTarefa,
  deleteTarefa,
} from "@/api";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

const getId = (t) => t?.id ?? t?.objectId;

export default function TelaTarefas() {
  const [novoTitulo, setNovoTitulo] = useState("");
  const qc = useQueryClient();

  const { data: itens = [], isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["tarefas"],
    queryFn: getTarefas,
  });

  const criar = useMutation({
    mutationFn: ({ titulo }) => addTarefa({ titulo, descricao: "" }),
    onSuccess: (criado) => {
      qc.setQueryData(["tarefas"], (old = []) => [...old, criado]);
      setNovoTitulo("");
    },
  });

  const alternar = useMutation({
    mutationFn: (t) =>
      updateTarefa({
        ...t,
        titulo: t.titulo ?? t.descricao ?? "Sem título",
        descricao: t.descricao ?? "",
        concluida: !t.concluida,
      }),
    onSuccess: (atualizado) => {
      qc.setQueryData(["tarefas"], (old = []) =>
        old.map((x) => (getId(x) === getId(atualizado) ? atualizado : x))
      );
    },
  });

  const remover = useMutation({
    mutationFn: (t) => deleteTarefa(t),
    onSuccess: (_, t) => {
      qc.setQueryData(["tarefas"], (old = []) =>
        old.filter((x) => getId(x) !== getId(t))
      );
    },
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 8 }}>Carregando tarefas…</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={styles.titulo}>Tarefas</Text>

      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="Nova tarefa…"
          value={novoTitulo}
          onChangeText={setNovoTitulo}
        />
        <Pressable
          style={styles.btn}
          onPress={() => novoTitulo.trim() && criar.mutate({ titulo: novoTitulo })}
          disabled={criar.isPending}
        >
          <Text style={styles.btnTxt}>
            {criar.isPending ? "Adicionando…" : "Adicionar"}
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={itens}
        keyExtractor={(item) => String(getId(item))}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            Sem tarefas ainda. Adicione uma acima.
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Pressable onPress={() => alternar.mutate(item)} style={{ flex: 1 }}>
              <Text
                style={[
                  styles.cardTitulo,
                  item.concluida && {
                    textDecorationLine: "line-through",
                    opacity: 0.6,
                  },
                ]}
              >
                {item.titulo ?? item.descricao}
              </Text>
              {!!item.descricao && (
                <Text style={styles.cardDesc}>{item.descricao}</Text>
              )}
            </Pressable>

            <Pressable
              onPress={() => remover.mutate(item)}
              style={styles.delBtn}
            >
              <Text style={styles.delTxt}>
                {remover.isPending ? "…" : "Excluir"}
              </Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  titulo: { fontSize: 28, fontWeight: "700" },
  row: { flexDirection: "row", gap: 8 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    backgroundColor: "#fff",
  },
  btn: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    height: 44,
  },
  btnTxt: { color: "#fff", fontWeight: "600" },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
  },
  cardTitulo: { fontSize: 16, fontWeight: "600" },
  cardDesc: { color: "#666", marginTop: 2 },
  delBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#ef4444",
    borderRadius: 8,
  },
  delTxt: { color: "#fff", fontWeight: "700" },
});
