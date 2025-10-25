// Netlify Function for Posts - Works without database
exports.handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
      },
      body: ''
    };
  }

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
  };

  try {
    switch (event.httpMethod) {
      case 'GET':
        return await getPosts(event, headers);
      case 'POST':
        return await createPost(event, headers);
      case 'PUT':
        return await updatePost(event, headers);
      case 'DELETE':
        return await deletePost(event, headers);
      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: 'Method not allowed' })
        };
    }
  } catch (error) {
    console.error('API Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error', details: error.message })
    };
  }
};

// Get all posts (mock data)
async function getPosts(event, headers) {
  try {
    // Return sample data
    const posts = [
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

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ posts })
    };
  } catch (error) {
    console.error('Get posts error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to fetch posts', details: error.message })
    };
  }
}

// Create new post (mock)
async function createPost(event, headers) {
  try {
    const body = JSON.parse(event.body);
    
    // Mock response
    const newPost = {
      id: Date.now(),
      ...body,
      created_at: new Date().toISOString(),
      author: 'admin'
    };

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({ 
        message: 'Post created successfully',
        post: newPost 
      })
    };
  } catch (error) {
    console.error('Create post error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to create post', details: error.message })
    };
  }
}

// Update post (mock)
async function updatePost(event, headers) {
  try {
    const { id } = event.queryStringParameters;
    const body = JSON.parse(event.body);
    
    if (!id) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Post ID is required' })
      };
    }

    // Mock response
    const updatedPost = {
      id: parseInt(id),
      ...body,
      updated_at: new Date().toISOString()
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        message: 'Post updated successfully',
        post: updatedPost 
      })
    };
  } catch (error) {
    console.error('Update post error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to update post', details: error.message })
    };
  }
}

// Delete post (mock)
async function deletePost(event, headers) {
  try {
    const { id } = event.queryStringParameters;
    
    if (!id) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Post ID is required' })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Post deleted successfully' })
    };
  } catch (error) {
    console.error('Delete post error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to delete post', details: error.message })
    };
  }
}