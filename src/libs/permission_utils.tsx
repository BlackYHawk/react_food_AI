import { Platform } from 'react-native';
import { request, PERMISSIONS, Permission, PermissionStatus } from 'react-native-permissions';

type SupportedPermission = keyof typeof PERMISSIONS.ANDROID | keyof typeof PERMISSIONS.IOS;

interface PermissionCallback {
  success?: (status: PermissionStatus) => void;
  error?: (error: Error) => void;
}

export function requestPermissionWithCallback(
  permissionKey: SupportedPermission,
  { success, error }: PermissionCallback = {}
): void {
  let permission: Permission;

  try {
    if (Platform.OS === 'android') {
      permission = PERMISSIONS.ANDROID[permissionKey as keyof typeof PERMISSIONS.ANDROID];
    } else if (Platform.OS === 'ios') {
      permission = PERMISSIONS.IOS[permissionKey as keyof typeof PERMISSIONS.IOS];
    } else {
      throw new Error('Unsupported platform');
    }

    if (!permission) {
      throw new Error(`Permission key "${permissionKey}" is not valid for platform ${Platform.OS}`);
    }

    request(permission)
      .then((status) => {
        if (status === 'granted') {
          success && success(status);
        } else {
          error && error(new Error(`Permission ${permissionKey} denied: ${status}`));
        }
      })
      .catch((err) => {
        error && error(err as Error);
      });
  } catch (err) {
    error && error(err as Error);
  }
}
