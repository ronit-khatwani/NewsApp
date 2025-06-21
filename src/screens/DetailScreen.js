import React, { useContext } from 'react';
import { View, ScrollView, Image, StatusBar, Dimensions, TouchableOpacity } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { BookmarkContext } from '../contexts/BookmarkContext';
import HeaderNavbar from '../components/HeaderNavbar';

const { width, height } = Dimensions.get('window');

const DetailScreen = ({ route, navigation }) => {
  const { article } = route.params;
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { bookmarks, toggleBookmark } = useContext(BookmarkContext);
  const isBookmarked = bookmarks.some(a => a.url === article.url);
  
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const imageStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollY.value,
      [-100, 0, 100],
      [1.3, 1, 0.9],
      Extrapolate.CLAMP
    );

    const translateY = interpolate(
      scrollY.value,
      [0, 200],
      [0, -50],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        { scale },
        { translateY }
      ],
    };
  });

  // Create bookmark button for header
  const bookmarkButton = (
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
      onPress={() => toggleBookmark(article)}
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
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Background Gradient */}
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}>
        <LinearGradient
          colors={['#667eea', '#764ba2', '#f093fb']}
          style={{ flex: 1 }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </View>

      {/* Header with consistent styling */}
      <HeaderNavbar 
        title={article.title}
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
        rightAction={bookmarkButton}
      />

      <Animated.ScrollView
        style={{ flex: 1 }}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image */}
        <Animated.View style={[
          {
            height: height * 0.4,
            overflow: 'hidden',
          },
          imageStyle
        ]}>
          <Image
            source={{ uri: article.urlToImage || 'https://via.placeholder.com/400x300' }}
            style={{ 
              width: '100%', 
              height: '100%',
            }}
            resizeMode="cover"
          />
          
          {/* Image overlay gradient */}
          <LinearGradient
            colors={[
              'transparent',
              'rgba(0, 0, 0, 0.3)',
              'rgba(0, 0, 0, 0.7)'
            ]}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 120,
            }}
          />
        </Animated.View>

        {/* Content Container */}
        <View style={{
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          marginTop: -20,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.3)',
          paddingHorizontal: 20,
          paddingTop: 24,
          paddingBottom: 40,
          minHeight: height * 0.7,
        }}>
          {/* Category Badge */}
          <View style={{
            alignSelf: 'flex-start',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.3)',
            marginBottom: 16,
          }}>
            <Text 
              variant="labelMedium"
              style={{ 
                color: colors.primary,
                fontWeight: '600',
                fontSize: 12,
              }}
            >
              NEWS
            </Text>
          </View>

          {/* Title */}
          <Text 
            variant="headlineMedium" 
            style={{ 
              color: 'rgba(255, 255, 255, 0.95)',
              fontWeight: '700',
              lineHeight: 32,
              marginBottom: 16,
              letterSpacing: -0.5,
            }}
          >
            {article.title}
          </Text>

          {/* Source and Date */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
            paddingBottom: 16,
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(255, 255, 255, 0.1)',
          }}>
            <View style={{
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.2)',
              marginRight: 12,
            }}>
              <Text 
                variant="labelMedium"
                style={{ 
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontWeight: '600',
                }}
              >
                {article.source?.name || 'Unknown Source'}
              </Text>
            </View>
            
            <Text 
              variant="bodySmall"
              style={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                flex: 1,
              }}
            >
              {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'Date unknown'}
            </Text>
          </View>

          {/* Description */}
          {article.description && (
            <Text 
              variant="bodyLarge" 
              style={{ 
                color: 'rgba(255, 255, 255, 0.8)',
                lineHeight: 24,
                marginBottom: 20,
                fontStyle: 'italic',
                letterSpacing: 0.2,
              }}
            >
              {article.description}
            </Text>
          )}

          {/* Content */}
          <Text 
            variant="bodyLarge" 
            style={{ 
              color: 'rgba(255, 255, 255, 0.85)',
              lineHeight: 26,
              letterSpacing: 0.3,
            }}
          >
            {article.content || article.description || 'Content not available for this article.'}
          </Text>
        </View>
      </Animated.ScrollView>
    </View>
  );
};

export default DetailScreen;
