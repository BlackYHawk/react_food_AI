import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Animated, ViewStyle,
} from 'react-native';
import PagerView from 'react-native-pager-view';
import {rem} from '../styles/globalStyles.tsx';

type Item = {
  id: string;
  name: string;
  img: string;
};

type AnimatedIOPSlideProps = {
  data: Item[];
  cardStyle?: ViewStyle
};

const renderGridItem = ({item}: {item: Item}) => (
  <TouchableOpacity style={styles.gridItem}>
    <Image source={{uri: item.img}} style={styles.gridIcon} />
    <Text style={styles.gridText} numberOfLines={1}>
      {item.name}
    </Text>
  </TouchableOpacity>
);

const AnimatedIOPSlide: React.FC<AnimatedIOPSlideProps> = ({data, cardStyle}) => {
  const pagerViewRef = useRef<PagerView>(null);
  const flatListRefs = useRef<Array<FlatList<Item | null>>>([]);
  const numColumns = 5, maxRows = 3;
  const [pageIndex, setPageIndex] = useState(0);
  const [containerHeight, setContainerHeight] = useState(rem(100));

  // 新增动画值
  const scrollX = useRef(new Animated.Value(0)).current;

  // 监听滑动
  const handlePageScroll = (event) => {
    const {offset, position} = event.nativeEvent;
    // 更新动画值
    scrollX.setValue(offset - position);
  };

  // 平移动画，第一页左滑时向左移动
  const translateX = scrollX.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -50], // 可调整平移距离
    extrapolate: 'clamp',
  });

  const handleRowData = (data: Item[]) => {
    if (!data || data.length === 0) return [];
    const result: Item[][] = [];
    result.push(data.splice(0, numColumns));

    let idx = 0;
    while (idx < data.length) {
      let tempChild = data.slice(idx, idx + maxRows * numColumns);
      result.push(tempChild);
      idx += tempChild.length;
    }
    return result;
  };
  const [rowDatas, setRowDatas] = useState<Item[][]>([]);

  useEffect(() => {
    const processedData = handleRowData(data);
    setRowDatas(processedData);
    if (pagerViewRef.current) {
      pagerViewRef.current.setPage(0); // 重置到第一页
    }
  }, [data]);

  const handlePageSelected = (e: { nativeEvent: { position: number } }) => {
    const idx = e.nativeEvent.position;
    setPageIndex(idx);

    if (flatListRefs.current) {
      const flatList = flatListRefs.current[idx];
      if (flatList) {
        flatList.measure((x, y, width, height, pageX, pageY) => {
          // 计算当前页的高度
          console.log("height", height);
          setContainerHeight(height);
        });
      }
    }
  };

  return (
    <View style={[cardStyle, styles.container, {height: containerHeight}]}>
      <PagerView
        ref={pagerViewRef}
        style={styles.pager}
        initialPage={0}
        onPageSelected={handlePageSelected}
        onPageScroll={handlePageScroll}>
        {/* 第1页：单行，带动画;第2页：九宫格 */}
        {rowDatas.map((rowData, index) => (
          <View key={index} style={styles.page}>
            <Animated.View style={{transform: [{translateX}]}}>
              <FlatList
                ref={el => (flatListRefs.current[index] = el)}
                data={rowData}
                horizontal={index === 0}
                {...(index !== 0 ? { numColumns: 5 } : {})}
                renderItem={renderGridItem}
                keyExtractor={item => item.id}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
              />
            </Animated.View>
          </View>
        ))}
      </PagerView>
      <View style={styles.dotList}>
        {rowDatas.map((_, index) => {
          return <View key={index} style={[styles.dotStyle, index === pageIndex ?
            // eslint-disable-next-line react-native/no-inline-styles
            {backgroundColor:'gray'} : {backgroundColor: 'white'}]} />;
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 6,
  },
  pager: {
    flex: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotList: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  dotStyle: {
    width: 10,
    height: 10,
    borderRadius: 5,
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
});

export default AnimatedIOPSlide;
