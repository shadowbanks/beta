import { View, Text, TextInput, Image } from "react-native";
import React, { useState } from "react";
import {
  GestureHandlerRootView,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { icons } from "@/constants";

type SearchInputProps = {
  title: string;
  value: string;
  placeholder: string;
  handleChangeText: (e: string) => void;
  otherStyles: string;
  keyboardType?: "email-address";
};

const SearchInput = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  ...props
}: SearchInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  return (
    <GestureHandlerRootView>
      <View
        className={`border-2 ${
          isFocused ? "border-secondary" : "border-black-200"
        } w-full h-16 px-4 bg-black-100 rounded-2xl  items-center flex-row space-x-4`}
      >
        <TextInput
          className="text-base mt-0.5 text-white flex-1 font-pregular"
          value={value}
          placeholder="Search for a video topic"
          placeholderTextColor="#7B7B8B"
          onChangeText={handleChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={title === "Password" && !showPassword}
        />
        <TouchableOpacity>
          <Image
            source={icons.search}
            className="w-5 h-5"
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  );
};

export default SearchInput;
