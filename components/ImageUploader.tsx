import React, { useState, useCallback } from "react";
import { useTheme } from "../context/ThemeContext";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { Upload, Image as ImageIcon } from "lucide-react-native";
import * as Haptics from "expo-haptics";

interface ImageUploaderProps {
  onImageSelected?: (imageUri: string) => void;
  isLoading?: boolean;
}

const ImageUploader = ({
  onImageSelected = () => {},
  isLoading = false,
}: ImageUploaderProps) => {
  const { isDarkMode } = useTheme();
  const [image, setImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const pickImage = useCallback(async () => {
    try {
      // Request permissions first
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
        return;
      }

      // Trigger haptic feedback only on native platforms
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0].uri;
        console.log("ImageUploader - Selected image URI:", selectedImage);

        // Verify the URI is valid
        if (selectedImage) {
          setImage(selectedImage);
          onImageSelected(selectedImage);
        } else {
          console.error("Invalid image URI from picker");
          Alert.alert("Error", "Failed to select image. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  }, [onImageSelected]);

  // This would be used in web environments for drag and drop
  const handleDragEnter = useCallback(() => {
    if (Platform.OS === "web") {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback(() => {
    if (Platform.OS === "web") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: any) => {
      if (Platform.OS === "web") {
        e.preventDefault();
        setIsDragging(false);

        // Web-specific file handling would go here
        // This is a placeholder for actual web implementation
        // const file = e.dataTransfer.files[0];
        // if (file && file.type.match('image.*')) {
        //   const reader = new FileReader();
        //   reader.onload = (event) => {
        //     if (event.target?.result) {
        //       const imageUri = event.target.result.toString();
        //       setImage(imageUri);
        //       onImageSelected(imageUri);
        //     }
        //   };
        //   reader.readAsDataURL(file);
        // }
      }
    },
    [onImageSelected],
  );

  return (
    <View
      className={`w-full ${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-lg overflow-hidden shadow-md`}
    >
      {image ? (
        <View className="relative w-full h-48">
          <Image
            source={{ uri: image }}
            className="w-full h-full"
            contentFit="cover"
            contentPosition="center"
            cachePolicy="memory"
          />
          <TouchableOpacity
            className={`absolute bottom-2 right-2 ${isDarkMode ? "bg-gray-700" : "bg-white"} p-2 rounded-full shadow-md`}
            onPress={pickImage}
            disabled={isLoading}
          >
            <ImageIcon size={20} color="#0284c7" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          className={`w-full h-48 border-2 border-dashed ${isDragging ? "border-blue-500 bg-blue-50" : isDarkMode ? "border-gray-600" : "border-gray-300"} rounded-lg flex items-center justify-center p-4`}
          onPress={pickImage}
          disabled={isLoading}
          // Web-specific props would be added conditionally
          // onDragEnter={handleDragEnter}
          // onDragOver={(e) => e.preventDefault()}
          // onDragLeave={handleDragLeave}
          // onDrop={handleDrop}
        >
          <View className="flex items-center justify-center">
            <Upload size={40} color="#0284c7" />
            <Text
              className={`text-center mt-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"} font-medium`}
            >
              Drag & drop an image here or tap to browse
            </Text>
            <Text
              className={`text-center mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"} text-sm`}
            >
              Supports JPG, PNG, WebP
            </Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ImageUploader;
