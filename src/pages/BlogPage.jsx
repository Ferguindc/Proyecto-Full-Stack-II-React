import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBlog } from '../context/BlogContext';
import './BlogPage.css';

function BlogPage() {
  const { currentUser } = useAuth();
  const { posts, searchPosts } = useBlog();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPosts = searchPosts(searchTerm);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="container py-5">
      <div className="blog-page">
        {/* Header del Blog */}
        <div className="blog-header text-center mb-5">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div className="flex-grow-1">
              <h1 className="blog-title">Blog de Crime Wave</h1>
              <p className="blog-subtitle">
                Consejos, guías y tips para el cuidado de tu ropa y hogar
              </p>
            </div>
            {currentUser ? (
              <Link to="/blog/crear" className="btn btn-primary btn-create-post">
                <i className="bi bi-plus-circle me-2"></i>
                Crear Post
              </Link>
            ) : (
              <Link to="/sesion" className="btn btn-outline-primary btn-create-post">
                <i className="bi bi-person me-2"></i>
                Iniciar Sesión
              </Link>
            )}
          </div>
          
          {/* Buscador */}
          <div className="search-container">
            <div className="search-box">
              <i className="bi bi-search"></i>
              <input
                type="text"
                placeholder="Buscar artículos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
        </div>

        {/* Contenido principal con layout flexible */}
        <div className="blog-main-content">
          {/* Lista de Posts */}
          <div className="blog-posts-grid">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <article key={post.id} className="blog-post-card">
                  <Link to={`/blog/${post.id}`} className="post-link">
                    <div className="post-image-container">
                      <img 
                        src={post.imagen} 
                        alt={post.titulo}
                        className="post-image"
                      />
                      <div className="post-category-badge">
                        {post.categoria}
                      </div>
                    </div>
                    
                    <div className="post-content">
                      <div className="post-meta">
                        <span className="post-date">
                          <i className="bi bi-calendar"></i>
                          {post.fecha}
                        </span>
                        <span className="post-author">
                          <i className="bi bi-person"></i>
                          {post.autor}
                        </span>
                      </div>
                      
                      <h2 className="post-title">{post.titulo}</h2>
                      <p className="post-excerpt">{post.excerpt}</p>
                      
                      <div className="post-footer">
                        <span className="read-more">
                          Leer más <i className="bi bi-arrow-right"></i>
                        </span>
                        <div className="post-tags">
                          {post.tips && (
                            <span className="tag">
                              <i className="bi bi-lightbulb"></i>
                              {post.tips.length} tips
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
              ))
            ) : (
              <div className="no-results">
                <i className="bi bi-search"></i>
                <h3>No se encontraron artículos</h3>
                <p>Intenta con otros términos de búsqueda</p>
              </div>
            )}
          </div>

          {/* Sidebar con categorías */}
          <div className="blog-sidebar">
            <div className="sidebar-section">
              <h3>Categorías</h3>
              <ul className="categories-list">
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); setSearchTerm(''); }}>
                    <i className="bi bi-grid"></i>
                    Todos los artículos
                    <span className="count">({posts.length})</span>
                  </a>
                </li>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); setSearchTerm('Cuidado del Hogar'); }}>
                    <i className="bi bi-house"></i>
                    Cuidado del Hogar
                    <span className="count">(1)</span>
                  </a>
                </li>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); setSearchTerm('Cuidado de Ropa'); }}>
                    <i className="bi bi-bag"></i>
                    Cuidado de Ropa
                    <span className="count">(1)</span>
                  </a>
                </li>
              </ul>
            </div>

            <div className="sidebar-section">
              <h3>Artículos Recientes</h3>
              <div className="recent-posts">
                {posts.slice(0, 3).map((post) => (
                  <Link key={post.id} to={`/blog/${post.id}`} className="recent-post">
                    <img src={post.imagen} alt={post.titulo} />
                    <div className="recent-post-info">
                      <h4>{post.titulo}</h4>
                      <span className="recent-date">{post.fecha}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="sidebar-section">
              <h3>Newsletter</h3>
              <p>Suscríbete para recibir nuestros últimos consejos</p>
              <form className="newsletter-form">
                <input 
                  type="email" 
                  placeholder="Tu email"
                  className="newsletter-input"
                  required
                />
                <button type="submit" className="newsletter-btn">
                  <i className="bi bi-envelope"></i>
                  Suscribirse
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogPage;