import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Moon, Sun } from "lucide-react-native";

interface ThemeToggleProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeToggle = ({ isDarkMode, toggleTheme }: ThemeToggleProps) => {
  return (
    <TouchableOpacity
      onPress={toggleTheme}
      className={`p-2 rounded-full ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
    >
      <View className="w-6 h-6 items-center justify-center">
        {isDarkMode ? (
          <Sun size={18} color="#f59e0b" />
        ) : (
          <Moon size={18} color="#6366f1" />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ThemeToggle;
