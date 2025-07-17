import React, {useMemo} from 'react';
import {StyleSheet, View, Text, ViewStyle} from 'react-native';
import {Icon, IconProps} from 'react-native-elements';
import {useTheme} from '@/styles/ThemeProvider.tsx';
import {useAppSelector} from '@/hooks/appHooks.tsx';
import i18n from '@/i18n/i18n';

type SocialCardProps = {
  socialStyle?: ViewStyle;
}

interface SocialStat {
  id: string;
  icon: string;
  type: string;
  color: string;
  title: string;
  count: number;
}

const SocialCard = ({socialStyle} : SocialCardProps) => {
  const { theme } = useTheme();
  const socialData = useAppSelector((state) => state.social);

  const socialStats: SocialStat[] = useMemo(() => {
    return [
      {
        id: 'following',
        icon: 'history',
        type: 'font-awesome',
        color: theme.primaryColor,
        title: i18n.t('profile.following'),
        count: socialData.following.length,
      },
      {
        id: 'followers',
        icon: 'history',
        type: 'font-awesome',
        color: theme.primaryColor,
        title: i18n.t('profile.followers'),
        count: socialData.followers.length,
      },
      {
        id: 'posts',
        icon: 'star',
        type: 'font-awesome',
        color: theme.primaryColor,
        title: i18n.t('profile.posts'),
        count: socialData.posts.length,
      },
      {
        id: 'collections',
        icon: 'thumbs-up',
        type: 'font-awesome',
        color: theme.primaryColor,
        title: i18n.t('profile.collections'),
        count: socialData.collections.length,
      },
    ]
  }, [socialData]);

  const styles = useMemo(() => StyleSheet.create({
    statsContainer: {
      flexDirection: 'row',
      backgroundColor: theme.backgroundColor,
    },
    statItem: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    statIconContainer: {
      backgroundColor: 'rgba(0, 201, 132, 0.1)',
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 5,
    },
    statTitle: {
      fontSize: 12,
      color: theme.textPrimary,
      marginBottom: 2,
    },
    statCount: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.textPrimary,
    },
  }), [theme]);

  return (
    <View style={[styles.statsContainer, socialStyle]}>
      {socialStats.map((item: SocialStat) => (
        <View key={item.id} style={styles.statItem}>
          <Icon
            name={item.icon}
            type={item.type}
            color={item.color}
            size={24}
            containerStyle={styles.statIconContainer}
            tvParallaxProperties={{}}
          />
          <Text style={styles.statTitle}>{item.title}</Text>
          <Text style={styles.statCount}>{item.count}</Text>
        </View>
      ))}
    </View>
  );
};

export default SocialCard;
