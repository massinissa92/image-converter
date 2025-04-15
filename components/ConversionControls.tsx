import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { ArrowRight, Download } from "lucide-react-native";
import * as Haptics from "expo-haptics";

interface ConversionControlsProps {
  isImageUploaded?: boolean;
  onConvert?: (format: string) => Promise<void>;
  onDownload?: () => void;
  isConverting?: boolean;
  isConverted?: boolean;
  selectedFormat?: string;
  setSelectedFormat?: (format: string) => void;
}

const ConversionControls = ({
  isImageUploaded = true,
  onConvert = async () => {},
  onDownload = () => {},
  isConverting = false,
  isConverted = false,
  selectedFormat = "png",
  setSelectedFormat = () => {},
}: ConversionControlsProps) => {
  const { isDarkMode } = useTheme();
  const formats = [
    { label: "PNG", value: "png" },
    { label: "JPG", value: "jpg" },
    { label: "WebP", value: "webp" },
  ];

  const handleConvert = async () => {
    try {
      console.log(
        "ConversionControls - Starting conversion to",
        selectedFormat,
      );
      await onConvert(selectedFormat);
    } catch (error) {
      console.error("Conversion failed:", error);
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }
  };

  const handleDownload = () => {
    console.log("ConversionControls - Initiating download");
    // Only trigger haptics on native platforms
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    onDownload();
  };

  return (
    <View
      className={`w-full p-4 ${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-sm`}
    >
      <Text
        className={`text-lg font-semibold mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}
      >
        Conversion Options
      </Text>

      {/* Format Selection */}
      <View
        className={`mb-4 border ${isDarkMode ? "border-gray-700" : "border-gray-200"} rounded-md`}
      >
        <Text
          className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"} mb-1 px-2 pt-2`}
        >
          Select Output Format
        </Text>
        <View
          className={`border-t ${isDarkMode ? "border-gray-700" : "border-gray-100"}`}
        >
          {formats.map((format) => (
            <TouchableOpacity
              key={format.value}
              className={`p-3 flex-row items-center justify-between ${selectedFormat === format.value ? (isDarkMode ? "bg-blue-900" : "bg-blue-50") : ""}`}
              onPress={() => setSelectedFormat(format.value)}
            >
              <Text
                className={`${selectedFormat === format.value ? "font-semibold text-blue-600" : isDarkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                {format.label}
              </Text>
              {selectedFormat === format.value && (
                <View className="h-4 w-4 rounded-full bg-blue-500" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Action Buttons */}
      <View className="flex-row justify-between">
        <TouchableOpacity
          className={`flex-1 py-3 rounded-lg flex-row justify-center items-center mr-2 ${isImageUploaded ? "bg-blue-500" : "bg-gray-300"}`}
          onPress={handleConvert}
          disabled={!isImageUploaded || isConverting || isConverted}
        >
          {isConverting ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <>
              <Text className="text-white font-medium mr-2">Convert</Text>
              <ArrowRight size={18} color="white" />
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 py-3 rounded-lg flex-row justify-center items-center ${isConverted ? "bg-green-500" : "bg-gray-300"}`}
          onPress={handleDownload}
          disabled={!isConverted}
        >
          <Text className="text-white font-medium mr-2">Download</Text>
          <Download size={18} color="white" />
        </TouchableOpacity>
      </View>

      {/* Conversion Status */}
      {isConverting && (
        <View className="mt-4">
          <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <View className="h-full bg-blue-500 w-3/4 animate-pulse" />
          </View>
          <Text
            className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"} mt-1 text-center`}
          >
            Converting your image...
          </Text>
        </View>
      )}

      {isConverted && !isConverting && (
        <Text className="text-sm text-green-600 mt-3 text-center">
          Conversion complete! You can now download your image.
        </Text>
      )}
    </View>
  );
};

export default ConversionControls;
