import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

/** Opens the photo library, square-cropped, and returns the chosen image uri. */
export async function pickImage(): Promise<string | null> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    Alert.alert('Photos needed', 'Allow access to your photos to choose an image.');
    return null;
  }
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.85,
  });
  if (result.canceled || !result.assets[0]) {
    return null;
  }
  return result.assets[0].uri;
}
