import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const BookmarkContext = createContext();

export const BookmarkProvider = ({ children }) => {
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem('@bookmarks').then(saved => {
      if (saved) setBookmarks(JSON.parse(saved));
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('@bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const toggleBookmark = (article) => {
    const exists = bookmarks.find(a => a.url === article.url);
    if (exists) {
      setBookmarks(prev => prev.filter(a => a.url !== article.url));
    } else {
      setBookmarks(prev => [...prev, article]);
    }
  };

  return (
    <BookmarkContext.Provider value={{ bookmarks, toggleBookmark }}>
      {children}
    </BookmarkContext.Provider>
  );
};
