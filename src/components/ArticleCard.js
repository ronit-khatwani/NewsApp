import React, { useContext, useEffect, useRef } from 'react';
import { View, Image, Dimensions, TouchableOpacity } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
  useAnimatedGestureHandler,
  runOnJS,
  interpolate,
  Extrapolate,
  withDelay
} from 'react-native-reanimated';
import { TapGestureHandler, PanGestureHandler } from 'react-native-gesture-handler';
import { BookmarkContext } from '../contexts/BookmarkContext';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width - 24;

const ArticleCard = ({ article, onPress, index = 0 }) => {
  const { colors } = useTheme();
  const { bookmarks, toggleBookmark } = useContext(BookmarkContext);
  const isBookmarked = bookmarks.some(a => a.url === article.url);
  const isBookmarkPressed = useRef(false);
  
  // Handle bookmark toggle with proper error handling
  const handleBookmarkPress = (event) => {
    try {
      // Stop event propagation to prevent card navigation
      event.stopPropagation();
      isBookmarkPressed.current = true;
      toggleBookmark(article);
      // Reset the flag after a short delay
      setTimeout(() => {
        isBookmarkPressed.current = false;
      }, 200);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };
  
  // Dynamic height calculation inside component for responsiveness
  const calculateCardHeight = () => {
    const imageHeight = 140; // Fixed image height
    const contentPadding = 32; // Top and bottom padding
    const titleHeight = 60; // Estimated title height (3 lines max)
    const descriptionHeight = article.description ? 54 : 0; // Estimated description height
    const bottomRowHeight = 48; // Source and bookmark row
    const margins = 20; // Internal margins
    
    return imageHeight + contentPadding + titleHeight + descriptionHeight + bottomRowHeight + margins;
  };
  
  const cardHeight = calculateCardHeight();

  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0); // Start with 0 for entrance animation
  const glowOpacity = useSharedValue(0);
  const borderRadius = useSharedValue(20);
  const entranceScale = useSharedValue(0.8);

  // Entrance animation with stagger
  useEffect(() => {
    const delay = index * 150; // Stagger delay based on index
    
    opacity.value = withDelay(delay, withTiming(1, { duration: 600 }));
    entranceScale.value = withDelay(delay, 
      withSpring(1, { 
        damping: 20, 
        stiffness: 200,
        mass: 1 
      })
    );
    translateY.value = withDelay(delay,
      withSpring(0, {
        damping: 25,
        stiffness: 250
      })
    );
  }, [index]);

  const tapHandler = useAnimatedGestureHandler({
    onStart: () => {
      scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
      glowOpacity.value = withTiming(0.4, { duration: 150 });
      borderRadius.value = withTiming(24, { duration: 150 });
    },
    onEnd: (event) => {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
      glowOpacity.value = withTiming(0, { duration: 400 });
      borderRadius.value = withTiming(20, { duration: 400 });
      
      // Check if the tap was NOT on the bookmark button area (bottom right)
      const cardWidth = CARD_WIDTH;
      const calculatedCardHeight = calculateCardHeight();
      const bookmarkAreaLeft = cardWidth - 60; // 60px from right edge
      const bookmarkAreaTop = calculatedCardHeight - 60; // 60px from bottom
      
      // Only navigate if bookmark wasn't pressed AND tap wasn't in bookmark area
      if (!isBookmarkPressed.current && 
          (event.x < bookmarkAreaLeft || event.y < bookmarkAreaTop)) {
        runOnJS(onPress)();
      }
    },
    onCancel: () => {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
      glowOpacity.value = withTiming(0, { duration: 400 });
      borderRadius.value = withTiming(20, { duration: 400 });
    },
  });

  const panHandler = useAnimatedGestureHandler({
    onStart: () => {
      glowOpacity.value = withTiming(0.1, { duration: 100 }); // Reduced glow
    },
    onActive: (event) => {
      translateY.value = event.translationY * 0.1; // Much smaller movement
      const clampedTranslation = Math.max(-10, Math.min(10, event.translationY)); // Reduced range
      scale.value = interpolate(
        Math.abs(clampedTranslation),
        [0, 10], // Reduced range
        [1, 0.98], // Smaller scale change
        Extrapolate.CLAMP
      );
    },
    onEnd: () => {
      translateY.value = withSpring(0, { damping: 25, stiffness: 450 }); // Faster return
      scale.value = withSpring(1, { damping: 25, stiffness: 450 });
      glowOpacity.value = withTiming(0, { duration: 200 }); // Faster fade
    },
  });

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value * entranceScale.value },
      { translateY: translateY.value }
    ],
    opacity: opacity.value,
    borderRadius: borderRadius.value,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[
      { 
        paddingHorizontal: 12, 
        marginVertical: 16,
        alignItems: 'center',
      }
    ]}>
      {/* Enhanced Glow effect */}
      <Animated.View 
        style={[
          {
            position: 'absolute',
            top: -8,
            left: 4,
            right: 4,
            bottom: -8,
            borderRadius: 28,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.3,
            shadowRadius: 24,
            elevation: 15,
          },
          glowStyle
        ]} 
      >
        <LinearGradient
          colors={[colors.primary + '40', colors.secondary + '40', 'transparent']}
          style={{
            flex: 1,
            borderRadius: 28,
          }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>
      
      <PanGestureHandler onGestureEvent={panHandler}>
        <Animated.View>
          <TapGestureHandler onGestureEvent={tapHandler}>
            <Animated.View 
              style={[
                {
                  width: CARD_WIDTH,
                  height: cardHeight,
                  borderRadius: 20,
                  overflow: 'hidden',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.15,
                  shadowRadius: 16,
                  elevation: 12,
                },
                animatedCardStyle
              ]}
            >
              {/* Glass morphism background */}
              <LinearGradient
                colors={[
                  'rgba(255, 255, 255, 0.25)',
                  'rgba(255, 255, 255, 0.15)',
                  'rgba(255, 255, 255, 0.05)'
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
              />
              
              {/* Frosted glass border */}
              <View style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.3)',
              }} />
              
              {/* Article Image with enhanced styling */}
              <View style={{ 
                height: 140, // Fixed height for consistency
                margin: 16, 
                borderRadius: 16, 
                overflow: 'hidden',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 8,
              }}>
                <Image
                  source={{ uri: article.urlToImage || 'https://via.placeholder.com/400x300' }}
                  style={{ 
                    width: '100%', 
                    height: '100%',
                  }}
                  resizeMode="cover"
                />
                
                {/* Enhanced image overlay gradient */}
                <LinearGradient
                  colors={[
                    'transparent',
                    'rgba(0, 0, 0, 0.2)',
                    'rgba(0, 0, 0, 0.6)'
                  ]}
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 80,
                  }}
                />
                
                {/* Category badge */}
                <View style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                }}>
                  <Text 
                    variant="labelSmall"
                    style={{ 
                      color: colors.primary,
                      fontWeight: '600',
                      fontSize: 10,
                    }}
                  >
                    NEWS
                  </Text>
                </View>
              </View>

              {/* Content Section with enhanced layout */}
              <View style={{ 
                paddingHorizontal: 16, 
                paddingBottom: 16,
                minHeight: 140, // Fixed minimum content height
              }}>
                {/* Title and Description */}
                <View style={{ marginBottom: 12 }}>
                  <Text 
                    variant="titleMedium" 
                    numberOfLines={3}
                    style={{ 
                      color: 'rgba(255, 255, 255, 0.95)',
                      fontWeight: '700',
                      lineHeight: 20,
                      marginBottom: 6,
                      letterSpacing: -0.3,
                    }}
                  >
                    {article.title}
                  </Text>
                  
                  {article.description && (
                    <Text 
                      variant="bodySmall" 
                      numberOfLines={2}
                      style={{ 
                        color: 'rgba(255, 255, 255, 0.75)',
                        lineHeight: 16,
                        letterSpacing: 0.1,
                      }}
                    >
                      {article.description}
                    </Text>
                  )}
                </View>

                {/* Enhanced bottom row with source and bookmark */}
                <View style={{ 
                  flexDirection: 'row', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  paddingTop: 12,
                  borderTopWidth: 1,
                  borderTopColor: 'rgba(255, 255, 255, 0.1)',
                  height: 48, // Fixed height to ensure bookmark button is visible
                }}>
                  <View style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    flex: 1,
                    marginRight: 12,
                    justifyContent: 'center',
                  }}>
                    <Text 
                      variant="labelSmall"
                      numberOfLines={1}
                      style={{ 
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontWeight: '600',
                        fontSize: 11,
                      }}
                    >
                      {article.source?.name || 'Unknown Source'}
                    </Text>
                  </View>
                  
                  <TouchableOpacity
                    style={{
                      backgroundColor: isBookmarked ? colors.primary + '30' : 'rgba(255, 255, 255, 0.2)',
                      borderRadius: 18,
                      borderWidth: 1,
                      borderColor: isBookmarked ? colors.primary : 'rgba(255, 255, 255, 0.4)',
                      width: 36,
                      height: 36,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={handleBookmarkPress}
                    activeOpacity={0.7}
                  >
                    <Text style={{
                      fontSize: 18,
                      color: isBookmarked ? colors.primary : 'rgba(255, 255, 255, 0.9)',
                      fontWeight: 'bold',
                    }}>
                      {isBookmarked ? '★' : '☆'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          </TapGestureHandler>
        </Animated.View>
      </PanGestureHandler>
    </Animated.View>
  );
};

export default ArticleCard;
