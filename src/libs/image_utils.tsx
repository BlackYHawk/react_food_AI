import * as ImageManipulator from 'expo-image-manipulator';

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const MIN_QUALITY = 0.2; // 最低压缩质量

/**
 * 压缩本地图片，确保不超过10M
 * @param uri 本地图片路径（如 file://...）
 * @returns 压缩后图片的本地路径
 */
export async function compressImageIfNeeded(uri: string): Promise<string> {
  // 获取原图大小
  const response = await fetch(uri);
  const blob = await response.blob();
  if (blob.size <= MAX_SIZE) {
    return uri;
  }

  let quality = 0.8;
  let compressedUri = uri;
  let compressedSize = blob.size;

  // 循环压缩，直到小于10M或达到最低质量
  while (compressedSize > MAX_SIZE && quality >= MIN_QUALITY) {
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [],
      { compress: quality, format: ImageManipulator.SaveFormat.JPEG }
    );
    compressedUri = result.uri;
    const res = await fetch(compressedUri);
    const compressedBlob = await res.blob();
    compressedSize = compressedBlob.size;
    quality -= 0.1;
  }

  if (compressedSize > MAX_SIZE) {
    throw new Error('图片压缩后仍大于10M');
  }

  return compressedUri;
}
