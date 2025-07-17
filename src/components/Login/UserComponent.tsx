import React, {useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Avatar, Button} from 'react-native-elements';
import {useTheme} from '@/styles/ThemeProvider.tsx';
import i18n from '@/i18n/i18n';
import {useAppSelector} from '@/hooks/appHooks.tsx';
import {LoginStatus} from '@/store/LoginStatus';

type UserComponentProps = {
  navigation: any;
};

const UserComponent = ({navigation}: UserComponentProps) => {
  const {theme} = useTheme();
  const userData = useAppSelector(state => state.user);
  const isLogined = userData.status === LoginStatus.LOGINED;

  const styles = useMemo(() =>
      StyleSheet.create({
        profileContainer: {
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
        },
        avatarContainer: {
          borderWidth: 3,
          borderColor: 'white',
        },
        guestContainer: {
          marginLeft: 15,
        },
        headContainer: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexGrow: 1,
        },
        userContainer: {
          marginLeft: 15,
          flexDirection: 'column',
        },
        userName: {
          color: 'white',
          fontSize: 20,
          fontWeight: 'bold',
        },
        userId: {
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: 14,
          marginTop: 5,
        },
        editButtonContainer: {
          borderRadius: 20,
        },
        editButton: {
          borderColor: 'white',
          borderRadius: 20,
          paddingVertical: 5,
          paddingHorizontal: 15,
        },
        editButtonText: {
          color: 'white',
          fontSize: 14,
        },
      }),
    [theme],
  );

  const showAvatorPreview = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.profileContainer}>
      <Avatar
        rounded
        size={80}
        source={{uri: userData.avatar}}
        activeOpacity={0.7}
        onPress={showAvatorPreview}
        containerStyle={styles.avatarContainer}>
        <Avatar.Accessory
          size={22}
          color="white"
          backgroundColor={theme.primaryColor}
          name="camera"
          type="font-awesome-5"
          tvParallaxProperties={{}}
        />
      </Avatar>
      {!isLogined ? (
        <View style={styles.guestContainer}>
          <Text style={styles.userName}>{i18n.t('profile.guest')}</Text>
        </View>
      ) : (
        <View style={styles.headContainer}>
          <View style={styles.userContainer}>
            <Text style={styles.userName}>{userData.name}</Text>
            <Text style={styles.userId}>ID: {userData.id}</Text>
          </View>
          <Button
            title={i18n.t('profile.edit')}
            type="outline"
            buttonStyle={styles.editButton}
            titleStyle={styles.editButtonText}
            containerStyle={styles.editButtonContainer}
            tvParallaxProperties={{}}
          />
        </View>
      )}
    </View>
  );
};

export default UserComponent;
