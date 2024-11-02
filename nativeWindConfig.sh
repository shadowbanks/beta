npm install nativewind tailwindcss react-native-reanimated react-native-safe-area-context
echo '/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}' > tailwind.config.js
echo '@tailwind base;
@tailwind components;
@tailwind utilities;
' > global.css
echo 'module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
  };
};' > babel.config.js
echo 'const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: "./global.css" });' > metro.config.js
echo '/// <reference types="nativewind/types" />' > nativewind-env.d.ts