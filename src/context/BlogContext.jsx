import React, { createContext, useContext, useState, useEffect } from 'react';
import { blogPosts as initialPosts } from '../data/blogPosts';

const BlogContext = createContext();

export function BlogProvider({ children }) {
  const [posts, setPosts] = useState(initialPosts);

  // Cargar posts del localStorage al iniciar
  useEffect(() => {
    try {
      const savedPosts = localStorage.getItem('blogPosts');
      if (savedPosts) {
        const parsedPosts = JSON.parse(savedPosts);
        setPosts(parsedPosts);
      }
    } catch (error) {
      console.error('Error al cargar posts:', error);
    }
  }, []);

  // Guardar posts en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('blogPosts', JSON.stringify(posts));
  }, [posts]);

  // Agregar un nuevo post
  const addPost = (newPost) => {
    const postWithId = {
      ...newPost,
      id: Math.max(...posts.map(p => p.id), 0) + 1,
      fecha: new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };
    
    setPosts(prevPosts => [postWithId, ...prevPosts]);
    return postWithId;
  };

  // Obtener un post por ID
  const getPostById = (id) => {
    return posts.find(post => post.id === parseInt(id));
  };

  // Obtener posts por categoría
  const getPostsByCategory = (category) => {
    return posts.filter(post => post.categoria === category);
  };

  // Buscar posts
  const searchPosts = (searchTerm) => {
    if (!searchTerm) return posts;
    
    return posts.filter(post =>
      post.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.contenido.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const value = {
    posts,
    addPost,
    getPostById,
    getPostsByCategory,
    searchPosts
  };

  return (
    <BlogContext.Provider value={value}>
      {children}
    </BlogContext.Provider>
  );
}

export function useBlog() {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlog debe ser usado dentro de BlogProvider');
  }
  return context;
}