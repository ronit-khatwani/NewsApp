import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StatusBar, Text, StyleSheet, FlatList } from 'react-native';
import ArticleCard from '../components/ArticleCard';
import HeaderNavbar from '../components/HeaderNavbar';
import { fetchTopHeadlines } from '../api/NewsApi';
import LinearGradient from 'react-native-linear-gradient';

const HomeScreen = ({ navigation }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopHeadlines().then(data => {
      setArticles(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <View style={styles.loadingWrapper}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Loading News...</Text>
        </View>
      </LinearGradient>
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
      
      <HeaderNavbar title="Latest News" />

      <FlatList
        data={articles}
        keyExtractor={(item, index) => item.url || index.toString()}
        renderItem={({ item, index }) => (
          <ArticleCard
            article={item}
            index={index}
            onPress={() => navigation.navigate('Detail', { article: item })}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        removeClippedSubviews={false}
        initialNumToRender={5}
        maxToRenderPerBatch={10}
        windowSize={10}
        getItemLayout={(data, index) => ({
          length: 300, // Estimated item height
          offset: 300 * index,
          index,
        })}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: 'relative',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingWrapper: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: 32,
    borderRadius: 16,
  },
  loadingText: {
    marginTop: 16,
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  contentContainer: {
    paddingTop: 16,
    paddingBottom: 120,
  },
});
