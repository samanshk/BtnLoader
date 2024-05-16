import React, {useMemo} from 'react';
import {
  LayoutRectangle,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

function App(): React.JSX.Element {
  const [dimensions, setDimensions] = React.useState<LayoutRectangle>({
    height: 0,
    width: 0,
    x: 0,
    y: 0,
  });

  const [showLoader, setShowLoader] = React.useState(false);

  const scale = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => {
    const diagonal = (dimensions.width ** 2 + dimensions.height ** 2) ** 0.5;

    return {
      height: diagonal,
      width: diagonal,
      opacity: interpolate(scale.value, [0, 0.7, 0.9], [1, 1, 0]),
      transform: [{scale: scale.value}],
      borderRadius: diagonal / 2,
    };
  });

  const childAnimatedStyles = useAnimatedStyle(() => ({
    transform: [{scale: scale.value > 0 ? 1 / scale.value : 0}],
  }));

  const startAnimation = () => {
    setShowLoader(true);
    scale.value = withRepeat(
      withSequence(
        withTiming(1, {duration: 1000, easing: Easing.linear}),
        withTiming(0, {duration: 1000, easing: Easing.cubic}),
      ),
      -1,
    );
    setTimeout(() => {
      cancelAnimation(scale);
      scale.value = 0;
      setShowLoader(false);
    }, 11000);
  };

  const onPress = () => {
    startAnimation();
  };

  return (
    <View style={styles.container}>
      <View style={{height: 200}} />
      <TouchableOpacity
        onLayout={e => {
          setDimensions(e.nativeEvent.layout);
        }}
        onPress={onPress}
        style={styles.btn}>
        <Text style={styles.btnText}>Click me</Text>
      </TouchableOpacity>
      {showLoader && (
        <View
          style={[
            styles.rippleWrapper,
            {
              height: dimensions.height,
              width: dimensions.width,
              top: dimensions.y,
              left: dimensions.x,
            },
          ]}>
          <Animated.View style={[styles.rippleView, animatedStyles]}>
            <Animated.View style={[styles.btn2, childAnimatedStyles]}>
              <Text style={styles.btn2Text}>Click me</Text>
            </Animated.View>
          </Animated.View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'cyan',
    borderRadius: 10,
  },
  btnText: {
    color: 'blue',
  },
  btn2: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'black',
  },
  btn2Text: {
    color: 'white',
  },
  rippleView: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    overflow: 'hidden',
    position: 'absolute',
  },
  rippleWrapper: {
    position: 'absolute',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
});

export default App;
