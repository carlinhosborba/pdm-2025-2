// app/index.tsx
import React, { useEffect } from "react";
import { router, Link } from "expo-router";
import { View, Text, Pressable } from "react-native";

export default function Index() {
  // redireciona imediatamente para /tarefas ao montar
  useEffect(() => {
    const t = setTimeout(() => router.replace("/tarefas"), 0);
    return () => clearTimeout(t);
  }, []);

  // fallback visível por 1 instante (ou se algo falhar)
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        padding: 24,
      }}
    >
      <Text style={{ fontSize: 18, textAlign: "center" }}>
        Redirecionando para <Text style={{ fontWeight: "700" }}>/tarefas</Text>…
      </Text>

      <Pressable
        onPress={() => router.replace("/tarefas")}
        style={{
          paddingHorizontal: 16,
          paddingVertical: 10,
          backgroundColor: "#2563eb",
          borderRadius: 8,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "700" }}>Ir agora</Text>
      </Pressable>

      <Link href="/tarefas" style={{ fontSize: 16, color: "blue" }}>
        Abrir /tarefas
      </Link>
    </View>
  );
}
