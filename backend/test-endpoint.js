import fetch from 'node-fetch';

async function testEndpoint() {
  try {
    console.log('=== Probando endpoint PUT /sports/user ===');
    
    // Primero necesito obtener un token de autenticación
    // Voy a hacer login primero
    const loginResponse = await fetch('http://localhost:5000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@test.com',
        password: '123456'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('Login response:', loginData);
    
    if (!loginData.success) {
      console.error('Error en login:', loginData.message);
      return;
    }
    
    const token = loginData.data.token;
    console.log('Token obtenido:', token);
    
    // Ahora voy a probar el endpoint de deportes
    const sportsResponse = await fetch('http://localhost:5000/sports', {
      method: 'GET'
    });
    
    const sportsData = await sportsResponse.json();
    console.log('Deportes disponibles:', sportsData);
    
    if (!sportsData.success) {
      console.error('Error obteniendo deportes:', sportsData.message);
      return;
    }
    
    // Tomar los primeros dos deportes
    const sportUuids = sportsData.data.slice(0, 2).map(sport => sport.uuid);
    console.log('UUIDs de deportes a enviar:', sportUuids);
    
    // Probar el endpoint PUT
    const updateResponse = await fetch('http://localhost:5000/sports/user', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        sportUuids: sportUuids
      })
    });
    
    const updateData = await updateResponse.json();
    console.log('Response status:', updateResponse.status);
    console.log('Update response:', updateData);
    
  } catch (error) {
    console.error('Error en la prueba:', error);
  }
}

testEndpoint();
