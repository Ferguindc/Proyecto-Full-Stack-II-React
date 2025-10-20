import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import './BlogPostPage.css';

function BlogPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPostById, posts } = useBlog();
  const post = getPostById(id);
  
  // Estado para los comentarios
  const [comments, setComments] = useState([]);
  const [commentForm, setCommentForm] = useState({
    nombre: '',
    email: '',
    comentario: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!post) {
    return (
      <div className="container py-5 text-center">
        <h1>Post no encontrado</h1>
        <p>El artículo que buscas no existe.</p>
        <Link to="/blog" className="btn btn-primary">Volver al Blog</Link>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCommentForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();
    
    if (!commentForm.nombre || !commentForm.email || !commentForm.comentario) {
      alert('Por favor completa todos los campos');
      return;
    }

    setIsSubmitting(true);
    
    // Simular envío del comentario
    setTimeout(() => {
      const newComment = {
        id: Date.now(),
        ...commentForm,
        fecha: new Date().toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };
      
      setComments(prev => [newComment, ...prev]);
      setCommentForm({ nombre: '', email: '', comentario: '' });
      setIsSubmitting(false);
      
      // Mostrar mensaje de confirmación
      alert('¡Comentario enviado exitosamente! Gracias por tu participación.');
    }, 1000);
  };

  // Encontrar posts relacionados (otros posts de la misma categoría)
  const relatedPosts = post ? posts
    .filter(p => p.id !== post.id && p.categoria === post.categoria)
    .slice(0, 2) : [];

  return (
    <div className="container py-5">
      <div className="blog-post-page">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/">Inicio</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/blog">Blog</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {post.titulo}
            </li>
          </ol>
        </nav>

        <div className="row">
          <div className="col-lg-8">
            {/* Cabecera del post */}
            <article className="blog-post-content">
              <header className="post-header">
                <div className="post-category-badge">
                  {post.categoria}
                </div>
                <h1 className="post-title">{post.titulo}</h1>
                
                <div className="post-meta">
                  <div className="meta-item">
                    <i className="bi bi-calendar"></i>
                    <span>{post.fecha}</span>
                  </div>
                  <div className="meta-item">
                    <i className="bi bi-person"></i>
                    <span>{post.autor}</span>
                  </div>
                  <div className="meta-item">
                    <i className="bi bi-clock"></i>
                    <span>5 min de lectura</span>
                  </div>
                </div>
              </header>

              {/* Imagen principal */}
              <div className="post-featured-image">
                <img src={post.imagen} alt={post.titulo} />
              </div>

              {/* Contenido del post */}
              <div className="post-body">
                <div 
                  className="post-content"
                  dangerouslySetInnerHTML={{ __html: post.contenido }}
                />

                {/* Tips destacados */}
                {post.tips && post.tips.length > 0 && (
                  <div className="tips-section">
                    <h3>💡 Tips Clave</h3>
                    <ul className="tips-list">
                      {post.tips.map((tip, index) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Compartir y navegación */}
              <div className="post-footer">
                <div className="post-navigation">
                  <button 
                    onClick={() => navigate('/blog')} 
                    className="btn btn-outline-primary"
                  >
                    <i className="bi bi-arrow-left"></i>
                    Volver al Blog
                  </button>
                </div>
                
                <div className="share-buttons">
                  <span>Compartir:</span>
                  <button className="share-btn facebook" title="Compartir en Facebook">
                    <i className="bi bi-facebook"></i>
                  </button>
                  <button className="share-btn twitter" title="Compartir en Twitter">
                    <i className="bi bi-twitter"></i>
                  </button>
                  <button className="share-btn whatsapp" title="Compartir en WhatsApp">
                    <i className="bi bi-whatsapp"></i>
                  </button>
                  <button className="share-btn link" title="Copiar enlace">
                    <i className="bi bi-link-45deg"></i>
                  </button>
                </div>
              </div>
            </article>

            {/* Sección de comentarios */}
            <section className="comments-section">
              <h3>Deja un comentario</h3>
              <p className="comments-subtitle">
                Ten en cuenta que los comentarios deben aprobarse antes de que se publiquen.
              </p>

              <form onSubmit={handleSubmitComment} className="comment-form">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="nombre">Nombre *</label>
                      <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        className="form-control"
                        value={commentForm.nombre}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="email">Correo electrónico *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-control"
                        value={commentForm.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="comentario">Comentario *</label>
                  <textarea
                    id="comentario"
                    name="comentario"
                    className="form-control"
                    rows="5"
                    placeholder="Escribe tu comentario aquí..."
                    value={commentForm.comentario}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary btn-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Enviando...
                    </>
                  ) : (
                    'Publicar Comentario'
                  )}
                </button>
              </form>

              {/* Comentarios existentes */}
              {comments.length > 0 && (
                <div className="comments-list">
                  <h4>Comentarios ({comments.length})</h4>
                  {comments.map((comment) => (
                    <div key={comment.id} className="comment-item">
                      <div className="comment-header">
                        <div className="comment-avatar">
                          <i className="bi bi-person-circle"></i>
                        </div>
                        <div className="comment-meta">
                          <h5 className="comment-author">{comment.nombre}</h5>
                          <span className="comment-date">{comment.fecha}</span>
                        </div>
                      </div>
                      <div className="comment-body">
                        <p>{comment.comentario}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            <div className="blog-sidebar">
              {/* Posts relacionados */}
              {relatedPosts.length > 0 && (
                <div className="sidebar-section">
                  <h3>Artículos Relacionados</h3>
                  <div className="related-posts">
                    {relatedPosts.map((relatedPost) => (
                      <Link 
                        key={relatedPost.id} 
                        to={`/blog/${relatedPost.id}`} 
                        className="related-post"
                      >
                        <img src={relatedPost.imagen} alt={relatedPost.titulo} />
                        <div className="related-post-info">
                          <h4>{relatedPost.titulo}</h4>
                          <span className="related-date">{relatedPost.fecha}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Newsletter */}
              <div className="sidebar-section">
                <h3>Newsletter</h3>
                <p>Suscríbete para recibir nuestros últimos consejos y novedades</p>
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

              {/* Información de contacto */}
              <div className="sidebar-section">
                <h3>¿Tienes alguna pregunta?</h3>
                <p>No dudes en contactarnos si necesitas ayuda adicional</p>
                <div className="contact-info">
                  <div className="contact-item">
                    <i className="bi bi-envelope"></i>
                    <span>info@crimewave.cl</span>
                  </div>
                  <div className="contact-item">
                    <i className="bi bi-instagram"></i>
                    <span>@crimewave.store</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogPostPage;