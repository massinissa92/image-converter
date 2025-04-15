import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Platform,
  Alert,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";
import ImageUploader from "../components/ImageUploader";
import ConversionControls from "../components/ConversionControls";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import * as FileSystem from "expo-file-system";

export default function HomeScreen() {
  const { isDarkMode, toggleTheme } = useTheme();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [convertedImage, setConvertedImage] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState("png");
  const [isConverting, setIsConverting] = useState(false);
  const [isConverted, setIsConverted] = useState(false);

  const handleImageSelected = (imageUri: string) => {
    console.log("Image selected:", imageUri);
    // Ensure the URI is valid and accessible
    if (imageUri) {
      setSelectedImage(imageUri);
      setConvertedImage(null);
      setIsConverted(false);
    } else {
      console.error("Invalid image URI received");
    }
  };

  const handleConvert = async (format: string) => {
    if (!selectedImage) {
      console.error("No image selected for conversion");
      return;
    }

    console.log(
      `Starting conversion to ${format}. Image URI: ${selectedImage}`,
    );
    setIsConverting(true);

    try {
      // In a real app, we would upload to Cloudinary here
      // For demo purposes, we'll simulate a conversion
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // For demo purposes, we're using the original image
      // In a real implementation, this would be the URL returned from Cloudinary
      const result = selectedImage;
      console.log(`Conversion complete. Result: ${result}`);

      setConvertedImage(result);
      setIsConverted(true);

      // Provide haptic feedback on success (mobile only)
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error("Error converting image:", error);
      Alert.alert(
        "Conversion Failed",
        "Unable to convert the image. Please try again.",
      );
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = async () => {
    if (!convertedImage) {
      console.error("No converted image available for download");
      return;
    }

    console.log(`Attempting to download image in ${selectedFormat} format`);

    try {
      if (Platform.OS === "web") {
        // Web download implementation
        const link = document.createElement("a");
        link.href = convertedImage;
        link.download = `converted-image.${selectedFormat}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        console.log("Web download initiated");
      } else {
        // For mobile platforms in Expo Go
        // In a real app, we would use expo-media-library to save to camera roll
        // For Expo Go, we'll use FileSystem to download to a temporary location

        try {
          // Create a directory for our app if it doesn't exist
          const dirInfo = await FileSystem.getInfoAsync(
            FileSystem.cacheDirectory + "images/",
          );
          if (!dirInfo.exists) {
            await FileSystem.makeDirectoryAsync(
              FileSystem.cacheDirectory + "images/",
              { intermediates: true },
            );
          }

          // Generate a filename
          const filename = `converted-image-${Date.now()}.${selectedFormat}`;
          const fileUri = FileSystem.cacheDirectory + "images/" + filename;

          // Copy the image to our app's directory
          await FileSystem.copyAsync({
            from: convertedImage,
            to: fileUri,
          });

          console.log("Image saved to:", fileUri);

          // Trigger haptic feedback
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

          // Show success message
          Alert.alert(
            "Download Successful",
            `Image saved as ${filename}. In a full app, this would be saved to your photo library.`,
            [{ text: "OK" }],
          );
        } catch (err) {
          console.error("FileSystem error:", err);
          Alert.alert(
            "Download Failed",
            "Unable to save the image to device storage.",
          );
        }
      }
    } catch (error) {
      console.error("Error downloading image:", error);
      Alert.alert(
        "Download Failed",
        "Unable to download the image. Please try again.",
      );
    }
  };

  return (
    <SafeAreaView
      className={`flex-1 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
    >
      <ScrollView className="flex-1">
        <View className="p-4">
          <View className="flex-row justify-end mb-2">
            <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
          </View>
          <View className="mb-6">
            <Text
              className={`text-2xl font-bold text-center ${isDarkMode ? "text-white" : "text-gray-800"} mb-2`}
            >
              Image Format Converter
            </Text>
            <Text
              className={`text-center mb-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              Convert your images to PNG, JPG, or WebP format
            </Text>
          </View>

          <View className="mb-6">
            <ImageUploader
              onImageSelected={handleImageSelected}
              isLoading={isConverting}
            />
          </View>

          {selectedImage && (
            <View className="mb-6">
              <ConversionControls
                isImageUploaded={!!selectedImage}
                onConvert={handleConvert}
                onDownload={handleDownload}
                isConverting={isConverting}
                isConverted={isConverted}
                selectedFormat={selectedFormat}
                setSelectedFormat={setSelectedFormat}
              />
            </View>
          )}

          {selectedImage && (
            <View className="mb-6">
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
                      source={{ uri: selectedImage }}
                      className="w-full h-40"
                      contentFit="cover"
                      contentPosition="center"
                      cachePolicy="memory"
                    />
                  </View>
                </View>
                <View className="w-1/2 p-1">
                  <Text
                    className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"} mb-1`}
                  >
                    {convertedImage
                      ? `Converted (${selectedFormat})`
                      : "Will be converted to"}
                  </Text>
                  <View
                    className={`border ${isDarkMode ? "border-gray-700" : "border-gray-200"} rounded-lg overflow-hidden`}
                  >
                    {convertedImage ? (
                      <Image
                        source={{ uri: convertedImage }}
                        className="w-full h-40"
                        contentFit="cover"
                        contentPosition="center"
                        cachePolicy="memory"
                      />
                    ) : (
                      <View className="w-full h-40 items-center justify-center">
                        <Text
                          className={`${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                        >
                          {selectedFormat.toUpperCase()}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
