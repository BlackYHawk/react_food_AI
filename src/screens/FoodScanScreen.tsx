import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator, StatusBar,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Icon } from 'react-native-elements';
import { useTheme } from '@/styles/ThemeProvider';
import { RootStackScreenProps } from '@/types/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import { useDispatch } from 'react-redux';
import { FoodItem, addScannedItem } from '@/store/slices/foodSlice';

const FoodScanScreen = ({ navigation }: RootStackScreenProps<'FoodScan'>) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<FoodItem | null>(null);
  const cameraRef = useRef<any>(null);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        setIsAnalyzing(true);
        const photo = await cameraRef.current.takePictureAsync();
        await analyzeFood(photo.uri);
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert(t('foodScan.error'), t('foodScan.errorTakingPicture'));
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setIsAnalyzing(true);
      await analyzeFood(result.assets[0].uri);
      setIsAnalyzing(false);
    }
  };

  const analyzeFood = async (imageUri: string) => {
    // Simulate AI food analysis
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock analysis result
    const mockResult: FoodItem = {
      id: Date.now().toString(),
      name: 'Grilled Chicken Breast',
      calories: 165,
      carbs: 0,
      protein: 31,
      fat: 3.6,
      confidence: 0.92,
      date: new Date().toISOString(),
      imageUri: imageUri
    };

    setAnalysisResult(mockResult);
  };

  const saveAnalysis = () => {
    if (analysisResult) {
      // Save to Redux store
      dispatch(addScannedItem(analysisResult));
      Alert.alert(t('foodScan.success'), t('foodScan.savedSuccess'));
      navigation.goBack();
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundColor,
    },
    grantContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    camera: {
      flex: 1,
    },
    buttonContainer: {
      position: 'absolute',
      bottom: 50,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    captureButton: {
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: theme.primaryColor,
      justifyContent: 'center',
      alignItems: 'center',
    },
    galleryButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: 'rgba(255,255,255,0.3)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    flipButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: 'rgba(255,255,255,0.3)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    analysisContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.backgroundColor,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      minHeight: 300,
    },
    analysisTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.textPrimary,
      marginBottom: 15,
    },
    nutritionRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    nutritionLabel: {
      fontSize: 16,
      color: theme.textSecondary,
    },
    nutritionValue: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.textPrimary,
    },
    confidenceText: {
      fontSize: 14,
      color: theme.textLight,
      marginTop: 10,
    },
    saveButton: {
      backgroundColor: theme.primaryColor,
      borderRadius: 10,
      padding: 15,
      alignItems: 'center',
      marginTop: 20,
    },
    saveButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    loadingContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      color: 'white',
      marginTop: 10,
      fontSize: 16,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} />

      {(!permission || !permission.granted) && (
        <View style={styles.grantContainer}>
          <Text style={{ color: theme.textPrimary }}>{t('foodScan.noAccess')}</Text>
          <TouchableOpacity onPress={requestPermission}>
            <Text style={{ color: theme.primaryColor }}>{t('foodScan.grantPermission')}</Text>
          </TouchableOpacity>
        </View> )}

      { permission && permission.granted && (<CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.galleryButton} onPress={pickImage}>
            <Icon name="photo-library" size={24} color="white" tvParallaxProperties={{}} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <Icon name="camera" size={30} color="white" tvParallaxProperties={{}} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.flipButton}
            onPress={() => {
              setFacing(current => (current === 'back' ? 'front' : 'back'));
            }}>
            <Icon name="flip-camera-ios" size={24} color="white" tvParallaxProperties={{}} />
          </TouchableOpacity>
        </View>
      </CameraView>)}

      {isAnalyzing && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primaryColor} />
          <Text style={styles.loadingText}>{t('foodScan.analyzing')}</Text>
        </View>
      )}

      {analysisResult && (
        <View style={styles.analysisContainer}>
          <Text style={styles.analysisTitle}>{analysisResult.name}</Text>

          <View style={styles.nutritionRow}>
            <Text style={styles.nutritionLabel}>{t('foodScan.calories')}:</Text>
            <Text style={styles.nutritionValue}>{analysisResult.calories} kcal</Text>
          </View>

          <View style={styles.nutritionRow}>
            <Text style={styles.nutritionLabel}>{t('foodScan.carbs')}:</Text>
            <Text style={styles.nutritionValue}>{analysisResult.carbs}g</Text>
          </View>

          <View style={styles.nutritionRow}>
            <Text style={styles.nutritionLabel}>{t('foodScan.protein')}:</Text>
            <Text style={styles.nutritionValue}>{analysisResult.protein}g</Text>
          </View>

          <View style={styles.nutritionRow}>
            <Text style={styles.nutritionLabel}>{t('foodScan.fat')}:</Text>
            <Text style={styles.nutritionValue}>{analysisResult.fat}g</Text>
          </View>

          <Text style={styles.confidenceText}>
            {t('foodScan.confidence')}: {Math.round(analysisResult.confidence * 100)}%
          </Text>

          <TouchableOpacity style={styles.saveButton} onPress={saveAnalysis}>
            <Text style={styles.saveButtonText}>{t('foodScan.saveAnalysis')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default FoodScanScreen;
