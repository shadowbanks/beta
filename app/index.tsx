import { StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Link } from "expo-router";

const Index = () => {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-3xl font-pblack">Wills</Text>
      <StatusBar style="auto" />
      <Link href="./home" style={{ color: "blue" }}>
        Go to Home
      </Link>
    </View>
  );
};

export default Index;
