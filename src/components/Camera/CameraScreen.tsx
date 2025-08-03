import React, {useRef} from 'react';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { CameraView, CameraType, CameraRatio, useCameraPermissions } from 'expo-camera';
import { compressImageIfNeeded } from '@/libs/image_utils.tsx';

import { useTranslation } from '@/hooks/useTranslation';

const CameraScreen = () => {
  const cameraRef = useRef<CameraView | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [ratio, setRatio] = useState<CameraRatio>('16:9');
  const navigation = useNavigation();
  const { t } = useTranslation();

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
        if (photo.uri) {
          const compressedUri = await compressImageIfNeeded(photo.uri);
          navigation.goBack();

          // 你可以通过 params 或事件将 compressedUri 传回上一页
          // navigation.navigate('上一页', { photoUri: compressedUri });
        }
      } catch (e: any) {
        console.error('拍照失败:', e.message);
      }
    }
  };

  if (!permission?.granted) {
    return (
      <View style={styles.center}>
        <Text>{t('camera.needsPermission')}</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.btn}>
          <Text style={styles.btnText}>{t('camera.requestPermission')}</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing} ratio={ratio}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>{t('camera.flipCamera')}</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
      <TouchableOpacity style={styles.captureBtn} onPress={takePicture}>
        <Text style={styles.btnText}>{t('camera.takePicture')}</Text>
      </TouchableOpacity>
    </View>
  );
}

export default CameraScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black'
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  captureBtn: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: '#2196F3',
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: { color: 'white', fontSize: 18 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  btn: { marginTop: 20, padding: 12, backgroundColor: '#2196F3', borderRadius: 8 },
});
