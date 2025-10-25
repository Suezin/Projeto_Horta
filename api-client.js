// API Client for HortaStats Database Integration
class HortaStatsAPI {
  constructor() {
    this.baseURL = '/.netlify/functions';
    this.token = localStorage.getItem('adminToken');
    this.useLocalStorage = true; // Use localStorage with sample data
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    localStorage.setItem('adminToken', token);
  }

  // Clear authentication token
  clearToken() {
    this.token = null;
    localStorage.removeItem('adminToken');
  }

  // Get headers for API requests
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  // Authentication
  async authenticate(username, password) {
    try {
      // Try Netlify Functions first
      const response = await fetch(`${this.baseURL}/auth`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      
      if (response.ok) {
        this.setToken(data.token);
        return { success: true, user: data.user };
      } else {
        throw new Error(data.error || 'API error');
      }
    } catch (error) {
      console.log('Netlify Functions failed, using localStorage auth:', error.message);
      
      // Fallback to localStorage authentication
      if (username === 'admin' && password === 'admin123') {
        const token = 'local-token-' + Date.now();
        this.setToken(token);
        return { 
          success: true, 
          user: { id: 1, username: 'admin', role: 'admin' }
        };
      } else {
        return { success: false, error: 'Invalid credentials' };
      }
    }
  }

  // Get all posts
  async getPosts() {
    try {
      // Try Netlify Functions first
      const response = await fetch(`${this.baseURL}/posts`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      const data = await response.json();
      
      if (response.ok) {
        return { success: true, posts: data.posts };
      } else {
        throw new Error(data.error || 'API error');
      }
    } catch (error) {
      console.log('Netlify Functions failed, using localStorage:', error.message);
      
      // Fallback to localStorage with sample data
      try {
        const savedPosts = localStorage.getItem('hortaPosts');
        if (savedPosts) {
          const posts = JSON.parse(savedPosts);
          return { success: true, posts: posts };
        } else {
          // Load sample data
          const samplePosts = this.getSampleData();
          localStorage.setItem('hortaPosts', JSON.stringify(samplePosts));
          return { success: true, posts: samplePosts };
        }
      } catch (localError) {
        console.error('Error loading posts:', localError);
        return { success: false, error: 'Failed to load posts' };
      }
    }
  }

  // Get sample data
  getSampleData() {
    return [
      {
        id: 1,
        plant_type: 'Tomate',
        plant_age: '30',
        planting_date: '15/01/2024',
        height: '25.5',
        weather: 'Ensolarado',
        temperature: '28°C',
        watering: 'Diário',
        fertilizer: 'Orgânico',
        pest_problems: 'Nenhum',
        notes: 'Crescendo bem, folhas verdes e saudáveis',
        expected_harvest: 'Março 2024',
        author: 'admin',
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        images: [
          {
            id: 1,
            filename: 'tomate1.jpg',
            mime_type: 'image/jpeg',
            url: 'https://via.placeholder.com/300x200/4a7c59/ffffff?text=Tomate',
            created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]
      },
      {
        id: 2,
        plant_type: 'Alface',
        plant_age: '15',
        planting_date: '01/02/2024',
        height: '12.0',
        weather: 'Nublado',
        temperature: '22°C',
        watering: 'A cada 2 dias',
        fertilizer: 'Composto',
        pest_problems: 'Nenhum',
        notes: 'Folhas verdes e saudáveis, prontas para colheita',
        expected_harvest: 'Fevereiro 2024',
        author: 'admin',
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        images: [
          {
            id: 2,
            filename: 'alface1.jpg',
            mime_type: 'image/jpeg',
            url: 'https://via.placeholder.com/300x200/90ee90/ffffff?text=Alface',
            created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]
      },
      {
        id: 3,
        plant_type: 'Cenoura',
        plant_age: '45',
        planting_date: '10/01/2024',
        height: '18.0',
        weather: 'Chuvoso',
        temperature: '20°C',
        watering: 'A cada 3 dias',
        fertilizer: 'NPK',
        pest_problems: 'Algumas folhas amareladas',
        notes: 'Desenvolvimento lento devido ao excesso de chuva',
        expected_harvest: 'Abril 2024',
        author: 'admin',
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        images: [
          {
            id: 3,
            filename: 'cenoura1.jpg',
            mime_type: 'image/jpeg',
            url: 'https://via.placeholder.com/300x200/ffa500/ffffff?text=Cenoura',
            created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]
      }
    ];
  }

  // Create new post
  async createPost(postData) {
    try {
      // Try Netlify Functions first
      const response = await fetch(`${this.baseURL}/posts`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(postData)
      });

      const data = await response.json();
      
      if (response.ok) {
        return { success: true, post: data.post };
      } else {
        throw new Error(data.error || 'API error');
      }
    } catch (error) {
      console.log('Netlify Functions failed, using localStorage:', error.message);
      
      // Fallback to localStorage
      try {
        const savedPosts = localStorage.getItem('hortaPosts');
        let posts = savedPosts ? JSON.parse(savedPosts) : [];
        
        const newPost = {
          id: Date.now(),
          ...postData,
          created_at: new Date().toISOString(),
          author: 'admin',
          images: []
        };
        
        posts.unshift(newPost);
        localStorage.setItem('hortaPosts', JSON.stringify(posts));
        
        return { success: true, post: newPost };
      } catch (localError) {
        console.error('Error creating post:', localError);
        return { success: false, error: 'Failed to save post' };
      }
    }
  }

  // Update post
  async updatePost(postId, postData) {
    try {
      const response = await fetch(`${this.baseURL}/posts?id=${postId}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(postData)
      });

      const data = await response.json();
      
      if (response.ok) {
        return { success: true, post: data.post };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  }

  // Delete post
  async deletePost(postId) {
    // Use localStorage directly
    try {
      const savedPosts = localStorage.getItem('hortaPosts');
      if (savedPosts) {
        let posts = JSON.parse(savedPosts);
        posts = posts.filter(post => post.id != postId);
        localStorage.setItem('hortaPosts', JSON.stringify(posts));
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting post:', error);
      return { success: false, error: 'Failed to delete post' };
    }
  }

  // Get image
  async getImage(imageId) {
    try {
      const response = await fetch(`${this.baseURL}/images?id=${imageId}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (response.ok) {
        return { success: true, imageUrl: response.url };
      } else {
        return { success: false, error: 'Image not found' };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  }

  // Upload image
  async uploadImage(postId, file) {
    try {
      // Convert file to base64
      const base64 = await this.fileToBase64(file);
      
      const response = await fetch(`${this.baseURL}/images`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          postId,
          filename: file.name,
          imageData: base64,
          mimeType: file.type
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        return { success: true, image: data.image };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  }

  // Convert file to base64
  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result.split(',')[1]; // Remove data:image/...;base64, prefix
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.token;
  }
}

// Global API instance
window.hortaAPI = new HortaStatsAPI();
