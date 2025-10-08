import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  addTarefa,
  deleteTarefa,
  getTarefas,
  updateTarefa,
} from "@/api"; // <- usa seu api/index.js
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export default function TelaTarefas() {
  const [texto, setTexto] = useState("");
  const qc = useQueryClient();

  // Lista
  const { data: tarefas = [], isLoading, isFetching } = useQuery({
    queryKey: ["tarefas"],
    queryFn: getTarefas,
  });

  // Criar
  const criar = useMutation({
    mutationFn: (t) => addTarefa({ titulo: t, descricao: t }),
    onSuccess: () => {
      setTexto("");
      qc.invalidateQueries({ queryKey: ["tarefas"] });
    },
    onError: () => Alert.alert("Erro", "Não foi possível criar a tarefa."),
  });

  // Alternar concluída
  const alternar = useMutation({
    mutationFn: (tarefa) =>
      updateTarefa({ ...tarefa, concluida: !tarefa.concluida }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tarefas"] }),
    onError: () => Alert.alert("Erro", "Não foi possível atualizar a tarefa."),
  });

  // Excluir
  const excluir = useMutation({
    mutationFn: (tarefa) => deleteTarefa(tarefa),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tarefas"] }),
    onError: () => Alert.alert("Erro", "Não foi possível excluir a tarefa."),
  });

  const renderItem = ({ item }) => {
    const concluida = !!item.concluida;
    return (
      <View style={styles.card}>
        <Pressable
          onPress={() => alternar.mutate(item)}
          style={styles.left}
          android_ripple={{ color: "#e5e7eb" }}
        >
          <Text style={[styles.titulo, concluida && styles.tituloDone]}>
            {item.titulo || item.descricao || "Sem título"}
          </Text>
          <Text style={styles.desc}>{item.descricao}</Text>
          <Text style={styles.status}>
            {concluida ? "✔ Concluída" : "⏳ Pendente"}
          </Text>
        </Pressable>

        <View style={styles.actions}>
          <Pressable
            onPress={() => alternar.mutate(item)}
            style={[styles.btn, styles.btnOk]}
          >
            <Text style={styles.btnTxt}>{concluida ? "Desfazer" : "Concluir"}</Text>
          </Pressable>

          <Pressable
            onPress={() => excluir.mutate(item)}
            style={[styles.btn, styles.btnDel]}
          >
            <Text style={styles.btnTxt}>Excluir</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Tarefas</Text>

      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="Nova tarefa..."
          value={texto}
          onChangeText={setTexto}
          onSubmitEditing={() => texto.trim() && criar.mutate(texto.trim())}
        />
        <Pressable
          style={[styles.btn, styles.btnPrimary]}
          onPress={() => texto.trim() && criar.mutate(texto.trim())}
        >
          <Text style={styles.btnTxt}>Adicionar</Text>
        </Pressable>
      </View>

      {(isLoading || isFetching) && (
        <ActivityIndicator size="small" style={{ marginVertical: 8 }} />
      )}

      <FlatList
        data={tarefas}
        keyExtractor={(t) => String(t.id ?? t.objectId)}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.empty}>
            Sem tarefas ainda. Adicione uma acima.
          </Text>
        }
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  h1: { fontSize: 32, fontWeight: "bold", marginBottom: 12 },
  row: { flexDirection: "row", gap: 12, alignItems: "center" },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
  },
  empty: { textAlign: "center", marginTop: 40, color: "#6b7280" },

  card: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    flexDirection: "row",
    gap: 12,
  },
  left: { flex: 1 },
  titulo: { fontSize: 18, fontWeight: "600" },
  tituloDone: { textDecorationLine: "line-through", color: "#16a34a" },
  desc: { color: "#6b7280", marginTop: 2 },
  status: { marginTop: 6, fontSize: 12, color: "#6b7280" },

  actions: { gap: 8, justifyContent: "center" },
  btn: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  btnPrimary: { backgroundColor: "#2563eb" },
  btnOk: { backgroundColor: "#16a34a" },
  btnDel: { backgroundColor: "#dc2626" },
  btnTxt: { color: "#fff", fontWeight: "600" },
});
