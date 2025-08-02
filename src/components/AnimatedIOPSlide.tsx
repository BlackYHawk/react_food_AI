import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  SharedValue,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import PagerView from 'react-native-pager-view';
import {useTheme} from '@/styles/ThemeProvider.tsx';
import { rem } from '@/styles/dimension'

type Item = {
  id: string;
  name: string;
  img: string;
};

type AnimatedIOPSlideProps = {
  data: Item[];
  cardStyle?: ViewStyle;
};

const handleRowData = (d: Item[]) => {
  if (!d || d.length === 0) return [];
  const dataCopy = [...d];
  const result: Item[][] = [];
  result.push(dataCopy.splice(0, 5)); // Page 1: 1 row, 5 cols

  const itemsPerPage = 3 * 5; // Subsequent pages: 3 rows, 5 cols
  while (dataCopy.length > 0) {
    result.push(dataCopy.splice(0, itemsPerPage));
  }
  return result;
};

const renderGridItem = ({item, styles}: {item: Item; styles: any}) => (
  <TouchableOpacity style={styles.gridItem}>
    <Image source={{uri: item.img}} style={styles.gridIcon} />
    <Text style={styles.gridText} numberOfLines={1}>
      {item.name}
    </Text>
  </TouchableOpacity>
);

const Page = ({
                rowData,
                index,
                scrollX,
                styles,
                onContentSizeChange,
              }: {
  rowData: Item[];
  index: number;
  scrollX: SharedValue<number>;
  styles: any;
  onContentSizeChange?: (width: number, height: number) => void;
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollX.value,
      [index - 1, index, index + 1],
      [0, 1, 0],
      Extrapolation.CLAMP,
    );

    let translateX = 0;
    if (index === 0) {
      translateX = interpolate(
        scrollX.value,
        [0, 1],
        [0, -100],
        Extrapolation.CLAMP,
      );
    }

    return {
      opacity,
      transform: [{translateX}],
      flex: 1,
    };
  });

  const flatListProps = index === 0 ? {horizontal: true} : {numColumns: 5};

  return (
    <Animated.View key={index} style={[styles.page, animatedStyle]}>
      <FlatList
        data={rowData}
        onContentSizeChange={onContentSizeChange}
        renderItem={props => renderGridItem({...props, styles})}
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        {...flatListProps}
      />
    </Animated.View>
  );
};

const Dot = ({
               index,
               scrollX,
               styles,
             }: {
  index: number;
  scrollX: SharedValue<number>;
  styles: any;
}) => {
  const dotAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollX.value,
      [index - 1, index, index + 1],
      [0.5, 1, 0.5],
      Extrapolation.CLAMP,
    );
    const scale = interpolate(
      scrollX.value,
      [index - 1, index, index + 1],
      [1, 1.2, 1],
      Extrapolation.CLAMP,
    );
    return {
      opacity,
      transform: [{scale}],
    };
  });
  return <Animated.View style={[styles.dotStyle, dotAnimatedStyle]} />;
};

const AnimatedIOPSlide: React.FC<AnimatedIOPSlideProps> = ({
                                                             data,
                                                             cardStyle,
                                                           }) => {
  const {theme} = useTheme();
  const pagerViewRef = useRef<PagerView>(null);
  const scrollX = useSharedValue(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageHeights, setPageHeights] = useState<number[]>([]);

  const containerHeight = useMemo(() => {
    const maxHeight = currentPage === 0 ? rem(100) : rem(600);
    const contentHeight = pageHeights[currentPage] ?? maxHeight;
    return Math.min(contentHeight, maxHeight);
  }, [currentPage, pageHeights, theme]);

  const onPageScroll = (event: {
    nativeEvent: {offset: number; position: number};
  }) => {
    const {offset, position} = event.nativeEvent;
    scrollX.value = position + offset;
  };

  const [rowDatas, setRowDatas] = useState<Item[][]>([]);

  useEffect(() => {
    const processedData = handleRowData(data);
    setRowDatas(processedData);
    pagerViewRef.current?.setPage(0);
    scrollX.value = 0;
  }, [data]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          height: rem(100),
        },
        pager: {
          flex: 1,
        },
        dotList: {
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 10,
          height: rem(30),
        },
        dotStyle: {
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: 'gray',
        },
        page: {
          flex: 1,
          justifyContent: 'center',
        },
        gridItem: {
          alignItems: 'center',
          justifyContent: 'center',
          width: rem(70),
          height: rem(70),
          marginVertical: 6,
        },
        gridIcon: {
          width: rem(36),
          height: rem(36),
          marginBottom: 6,
          borderRadius: 18,
          backgroundColor: '#f5f5f5',
        },
        gridText: {
          fontSize: 12,
          color: '#333',
        },
      }),
    [theme],
  );
  const containerStyle = currentPage === 0 ? {height: rem(100)} : {height: containerHeight};

  return (
    <View style={[cardStyle, { ...containerStyle }]}>
      <PagerView
        ref={pagerViewRef}
        style={styles.pager}
        initialPage={0}
        onPageScroll={onPageScroll}
        onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}>
        {rowDatas.map((rowData, index) => (
          <Page
            key={index}
            rowData={rowData}
            index={index}
            scrollX={scrollX}
            styles={styles}
            onContentSizeChange={(width, height) => {
              setPageHeights(prev => {
                const newHeights = [...prev];
                newHeights[index] = height + rem(20); // Add some padding
                return newHeights;
              });
            }}
          />
        ))}
      </PagerView>
      <View style={styles.dotList}>
        {rowDatas.map((_, index) => (
          <Dot key={index} index={index} scrollX={scrollX} styles={styles} />
        ))}
      </View>
    </View>
  );
};

export default AnimatedIOPSlide;

