import { View, TextInput, Image, Alert } from "react-native";
import React, { useState } from "react";
import {
  GestureHandlerRootView,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { icons } from "@/constants";
import { router, usePathname } from "expo-router";

interface SearchInputProps {
  initialQuery?: string;
}

const SearchInput = ({ initialQuery }: SearchInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery || "");
  return (
    <GestureHandlerRootView>
      <View
        className={`border-2 ${
          isFocused ? "border-secondary" : "border-black-200"
        } w-full h-16 px-4 bg-black-100 rounded-2xl  items-center flex-row space-x-4`}
      >
        <TextInput
          className="text-base mt-0.5 text-white flex-1 font-pregular"
          value={query}
          placeholder="Search for a video topic"
          placeholderTextColor="#CDCDE0"
          onChangeText={(e) => setQuery(e)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <TouchableOpacity
          onPress={() => {
            if (!query)
              Alert.alert(
                "Missing query",
                "Please input something to search resukts across database"
              );

            if (pathname.startsWith("/search")) router.setParams({ query });
            else router.push(`/search/${query}`);
          }}
        >
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
