import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Link } from "expo-router";
import {
  Dimensions,
  Switch as RNSwitch,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { PizzaTranslator } from "@/components/PizzaTranslator";
import { SectionListExample } from "@/components/SectionListExample";
import { useStore } from "@/zustand";

console.log("window dimensions: ", Dimensions.get("window"));

export default function Index() {
  const isEnabled = useStore((state) => state.isEnabled);
  const toggleIsEnabled = useStore((state) => state.toggleIsEnabled);

  return (
    <View style={styles.rootContainer}>
      <RNSwitch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleIsEnabled}
        value={isEnabled}
      />

      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-xl font-bold text-blue-500">
          Welcome to Nativewind!
        </Text>
      </View>

      {/* REMOVIDO: spinner sempre visível que causava “giro infinito” */}
      {/* <Spinner size="large" color="orange" /> */}

      <Switch
        size="md"
        isDisabled={false}
        trackColor={{ false: "#d4d4d4", true: "#525252" }}
        thumbColor="#fafafa"
        activeThumbColor="#fafafa"
        ios_backgroundColor="#d4d4d4"
      />

      {isEnabled ? (
        <SectionListExample />
      ) : (
        <View style={styles.container}>
          <Text style={styles.title}>Olá Turma!!!</Text>
          <Link href="/list">Section List Example</Link>
          <Link href="/tarefas">Tasks Example</Link>
          <PizzaTranslator />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 25,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "blue",
  },
});
