import { View, Text, ScrollView, Image, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { images } from "@/constants";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import {
  signIn,
  getSession,
  deleteSession,
  getCurrentUser,
} from "@/lib/appwrite";
import { useGlobalContext } from "@/context/GlobalProvider";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const { setUser, setIsLoggedIn } = useGlobalContext();

  const submit = async () => {
    if (!form.email || !form.password) {
      Alert.alert("Error", "Please fill all the fields");
      return;
    }

    setSubmitting(true);

    try {
      await signIn(form.email, form.password);
      // Check for an existing login session
      const result = await getCurrentUser();
      setUser(result);
      setIsLoggedIn(true);

      Alert.alert("Success", "Logged in successfully");
      router.replace("/home");
    } catch (err) {
      if (err instanceof Error) Alert.alert("Error", err.message);
      else Alert.alert("Error", "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <GestureHandlerRootView>
      <SafeAreaView className="bg-primary h-full">
        <ScrollView>
          <View className="w-full justify-center min-h-[85vh] px-4 my-6">
            <Image
              source={images.logo}
              resizeMode="contain"
              className="w-[115px] h-[35px]"
            />
            <Text className="text-2xl text-white mt-10 font-psemibold">
              Log in to Aora
            </Text>

            <FormField
              title="Email"
              value={form.email}
              handleChangeText={(e) => setForm({ ...form, email: e })}
              otherStyles="mt-7"
              keyboardType="email-address"
              placeholder={""}
            />
            <FormField
              title="Password"
              value={form.password}
              handleChangeText={(e) => setForm({ ...form, password: e })}
              otherStyles="mt-7"
              placeholder={""}
            />

            <CustomButton
              title={"Sign In"}
              handlePress={submit}
              containerStyle={"mt-7"}
              textStyles={""}
              isLoading={submitting}
            />
            <View className="justify-center pt-5 flex-row gap-2">
              <Text className="text-lg text-gray-100 font-pregular">
                Don't have an account?
              </Text>
              <Link
                href={"/sign-up"}
                className="text-secondary font-psemibold text-lg"
              >
                Sign Up
              </Link>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Login;
