import React from "react";
import { View, Text } from "react-native";
import { Image } from "expo-image";
import { useTheme } from "../context/ThemeContext";

interface ImagePreviewProps {
  originalImage: string;
  convertedImage: string;
  format: string;
}

const ImagePreview = ({
  originalImage,
  convertedImage,
  format = "png",
}: ImagePreviewProps) => {
  const { isDarkMode } = useTheme();

  return (
    <View
      className={`w-full ${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-lg p-4 shadow-sm`}
    >
      <Text
        className={`text-lg font-semibold mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}
      >
        Image Preview
      </Text>
      <View className="flex-row flex-wrap">
        <View className="w-1/2 p-1">
          <Text
            className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"} mb-1`}
          >
            Original
          </Text>
          <View
            className={`border ${isDarkMode ? "border-gray-700" : "border-gray-200"} rounded-lg overflow-hidden`}
          >
            <Image
              source={{ uri: originalImage }}
              className="w-full h-40"
              contentFit="cover"
              contentPosition="center"
              cachePolicy="memory"
              onError={(error) =>
                console.error("Original image load error:", error)
              }
            />
          </View>
        </View>
        <View className="w-1/2 p-1">
          <Text
            className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"} mb-1`}
          >
            Converted ({format})
          </Text>
          <View
            className={`border ${isDarkMode ? "border-gray-700" : "border-gray-200"} rounded-lg overflow-hidden`}
          >
            <Image
              source={{ uri: convertedImage }}
              className="w-full h-40"
              contentFit="cover"
              contentPosition="center"
              cachePolicy="memory"
              onError={(error) =>
                console.error("Converted image load error:", error)
              }
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default ImagePreview;
