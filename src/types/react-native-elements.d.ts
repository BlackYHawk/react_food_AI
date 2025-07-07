import { AvatarProps as RNEAvatarProps } from 'react-native-elements';

declare module 'react-native-elements' {
  export interface AvatarProps extends RNEAvatarProps {
    children?: React.ReactNode;
  }
}
