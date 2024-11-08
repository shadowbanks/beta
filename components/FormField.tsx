import { View, Text, TextInput, Image } from "react-native";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { icons } from "@/constants";

type FormFieldProps = {
  title: string;
  value: string;
  placeholder: string;
  handleChangeText: (e: string) => void;
  otherStyles: string;
  keyboardType?: "email-address";
};

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  ...props
}: FormFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-100 font-pmedium">{title}</Text>

      <View
        className={`border-2 ${
          isFocused ? "border-secondary" : "border-black-200"
        } w-full h-16 px-4 bg-black-100 rounded-2xl  items-center flex-row`}
      >
        <TextInput
          className="flex-1 text-white font-psemibold text-base w-full"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7B7B8B"
          onChangeText={handleChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={title === "Password" && !showPassword}
        />
        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              className="w-6 h-6"
              resizeMode="contain"
              source={!showPassword ? icons.eyeHide : icons.eye}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
