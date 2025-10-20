import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBlog } from '../context/BlogContext';
import { useNavigate } from 'react-router-dom';
import './CreateBlogPostPage.css';

function CreateBlogPostPage() {
  const { currentUser } = useAuth();
  const { addPost } = useBlog();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    titulo: '',
    excerpt: '',
    imagen: '',
    categoria: 'Cuidado de Ropa',
    contenido: '',
    tips: ['', '', '', '']
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // Redirigir si no está logueado
  React.useEffect(() => {
    if (!currentUser) {
      alert('Debes estar registrado para crear posts del blog');
      navigate('/sesion');
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return (
      <div className="container py-5 text-center">
        <h2>Acceso Restringido</h2>
        <p>Debes estar registrado para crear posts del blog.</p>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/sesion')}
        >
          Iniciar Sesión
        </button>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTipChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      tips: prev.tips.map((tip, i) => i === index ? value : tip)
    }));
  };

  const addTip = () => {
    setFormData(prev => ({
      ...prev,
      tips: [...prev.tips, '']
    }));
  };

  const removeTip = (index) => {
    setFormData(prev => ({
      ...prev,
      tips: prev.tips.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.titulo || !formData.excerpt || !formData.contenido) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    setIsSubmitting(true);

    // Simular proceso de creación
    setTimeout(() => {
      const newPostData = {
        titulo: formData.titulo,
        excerpt: formData.excerpt,
        imagen: formData.imagen || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop',
        autor: currentUser.email,
        categoria: formData.categoria,
        contenido: formData.contenido.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>'),
        tips: formData.tips.filter(tip => tip.trim() !== '')
      };

      // Agregar el post usando el contexto
      const createdPost = addPost(newPostData);
      
      setIsSubmitting(false);
      alert('¡Post creado exitosamente!');
      navigate(`/blog/${createdPost.id}`);
    }, 1500);
  };

  const formatContentForPreview = (content) => {
    return content
      .split('\n\n')
      .map(paragraph => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`)
      .join('');
  };

  return (
    <div className="container py-5">
      <div className="create-blog-page">
        <div className="page-header">
          <h1>Crear Nuevo Post</h1>
          <p>Comparte tus conocimientos y consejos con la comunidad</p>
        </div>

        <div className="row">
          <div className="col-lg-8">
            <div className="create-form-container">
              <div className="form-header">
                <div className="form-tabs">
                  <button 
                    className={`tab-btn ${!previewMode ? 'active' : ''}`}
                    onClick={() => setPreviewMode(false)}
                  >
                    <i className="bi bi-pencil"></i>
                    Editar
                  </button>
                  <button 
                    className={`tab-btn ${previewMode ? 'active' : ''}`}
                    onClick={() => setPreviewMode(true)}
                  >
                    <i className="bi bi-eye"></i>
                    Vista Previa
                  </button>
                </div>
              </div>

              {!previewMode ? (
                <form onSubmit={handleSubmit} className="create-form">
                  {/* Información básica */}
                  <div className="form-section">
                    <h3>Información Básica</h3>
                    
                    <div className="form-group">
                      <label htmlFor="titulo">Título del Post *</label>
                      <input
                        type="text"
                        id="titulo"
                        name="titulo"
                        className="form-control"
                        value={formData.titulo}
                        onChange={handleInputChange}
                        placeholder="Ej: Cómo cuidar tu ropa favorita"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="excerpt">Descripción corta *</label>
                      <textarea
                        id="excerpt"
                        name="excerpt"
                        className="form-control"
                        rows="3"
                        value={formData.excerpt}
                        onChange={handleInputChange}
                        placeholder="Una breve descripción que aparecerá en la vista previa..."
                        required
                      />
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="categoria">Categoría</label>
                          <select
                            id="categoria"
                            name="categoria"
                            className="form-control"
                            value={formData.categoria}
                            onChange={handleInputChange}
                          >
                            <option value="Cuidado de Ropa">Cuidado de Ropa</option>
                            <option value="Cuidado del Hogar">Cuidado del Hogar</option>
                            <option value="Tips Generales">Tips Generales</option>
                            <option value="Tendencias">Tendencias</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="imagen">URL de Imagen (opcional)</label>
                          <input
                            type="url"
                            id="imagen"
                            name="imagen"
                            className="form-control"
                            value={formData.imagen}
                            onChange={handleInputChange}
                            placeholder="https://ejemplo.com/imagen.jpg"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contenido principal */}
                  <div className="form-section">
                    <h3>Contenido Principal</h3>
                    <div className="form-group">
                      <label htmlFor="contenido">Contenido del Post *</label>
                      <textarea
                        id="contenido"
                        name="contenido"
                        className="form-control content-editor"
                        rows="15"
                        value={formData.contenido}
                        onChange={handleInputChange}
                        placeholder="Escribe el contenido completo de tu post aquí...

Puedes usar saltos de línea para separar párrafos.

También puedes agregar títulos y subtítulos usando texto simple."
                        required
                      />
                      <small className="form-text">
                        Consejo: Usa doble salto de línea para crear párrafos separados.
                      </small>
                    </div>
                  </div>

                  {/* Tips */}
                  <div className="form-section">
                    <h3>Tips Destacados</h3>
                    <p>Agrega consejos clave que aparecerán destacados al final del post:</p>
                    
                    {formData.tips.map((tip, index) => (
                      <div key={index} className="tip-input-group">
                        <div className="form-group">
                          <label>Tip #{index + 1}</label>
                          <div className="input-with-button">
                            <input
                              type="text"
                              className="form-control"
                              value={tip}
                              onChange={(e) => handleTipChange(index, e.target.value)}
                              placeholder="Escribe un consejo útil..."
                            />
                            {formData.tips.length > 1 && (
                              <button
                                type="button"
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => removeTip(index)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={addTip}
                    >
                      <i className="bi bi-plus"></i>
                      Agregar Tip
                    </button>
                  </div>

                  {/* Botones de acción */}
                  <div className="form-actions">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => navigate('/blog')}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Creando Post...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle me-2"></i>
                          Crear Post
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                /* Vista Previa */
                <div className="preview-container">
                  <div className="preview-post">
                    <header className="preview-header">
                      <div className="preview-category-badge">
                        {formData.categoria}
                      </div>
                      <h1 className="preview-title">
                        {formData.titulo || 'Título del post'}
                      </h1>
                      <div className="preview-meta">
                        <span><i className="bi bi-calendar"></i> Hoy</span>
                        <span><i className="bi bi-person"></i> {currentUser.email}</span>
                      </div>
                    </header>

                    <div className="preview-image">
                      <img 
                        src={formData.imagen || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop'} 
                        alt="Preview" 
                      />
                    </div>

                    <div className="preview-content">
                      <div 
                        dangerouslySetInnerHTML={{ 
                          __html: formatContentForPreview(formData.contenido || 'El contenido aparecerá aquí...') 
                        }}
                      />

                      {formData.tips.some(tip => tip.trim() !== '') && (
                        <div className="preview-tips">
                          <h3>💡 Tips Clave</h3>
                          <ul>
                            {formData.tips
                              .filter(tip => tip.trim() !== '')
                              .map((tip, index) => (
                                <li key={index}>{tip}</li>
                              ))
                            }
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar con ayuda */}
          <div className="col-lg-4">
            <div className="help-sidebar">
              <div className="help-section">
                <h3>💡 Consejos para escribir</h3>
                <ul>
                  <li>Usa un título descriptivo y atractivo</li>
                  <li>Escribe una descripción corta pero convincente</li>
                  <li>Organiza el contenido en párrafos claros</li>
                  <li>Agrega tips prácticos y útiles</li>
                  <li>Usa la vista previa para revisar tu post</li>
                </ul>
              </div>

              <div className="help-section">
                <h3>📝 Formato del contenido</h3>
                <ul>
                  <li><strong>Párrafos:</strong> Doble salto de línea</li>
                  <li><strong>Listas:</strong> Usa guiones (-) al inicio</li>
                  <li><strong>Énfasis:</strong> Texto entre asteriscos *importante*</li>
                </ul>
              </div>

              <div className="help-section">
                <h3>🎯 Categorías disponibles</h3>
                <ul>
                  <li><strong>Cuidado de Ropa:</strong> Tips de lavado, secado</li>
                  <li><strong>Cuidado del Hogar:</strong> Limpieza, organización</li>
                  <li><strong>Tips Generales:</strong> Consejos variados</li>
                  <li><strong>Tendencias:</strong> Novedades y estilos</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateBlogPostPage;