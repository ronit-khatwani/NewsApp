import React, { useContext } from 'react';
import { View, StyleSheet, StatusBar, Text } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { BookmarkContext } from '../contexts/BookmarkContext';
import ArticleCard from '../components/ArticleCard';
import HeaderNavbar from '../components/HeaderNavbar';
import LinearGradient from 'react-native-linear-gradient';

const BookmarksScreen = ({ navigation }) => {
  const { bookmarks } = useContext(BookmarkContext);

  // Show empty state if no bookmarks
  if (bookmarks.length === 0) {
    return (
      <View style={styles.wrapper}>
        <LinearGradient
          colors={['#667eea', '#764ba2', '#f093fb']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        
        <HeaderNavbar title="Bookmarks" />
        
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>No bookmarks yet</Text>
          <Text style={styles.emptyStateSubText}>
            Save articles you want to read later by tapping the bookmark icon
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <HeaderNavbar title="Bookmarks" />

      <FlashList
        data={bookmarks}
        estimatedItemSize={300}
        renderItem={({ item, index }) => (
          <ArticleCard
            article={item}
            index={index}
            onPress={() => navigation.navigate('Detail', { article: item })}
          />
        )}
        keyExtractor={item => item.url}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
};

export default BookmarksScreen;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: 'relative',
  },
  contentContainer: {
    paddingTop: 16,
    paddingBottom: 120,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyStateText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyStateSubText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
  },
});
