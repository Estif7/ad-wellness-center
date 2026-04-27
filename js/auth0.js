// Auth0 configuration
const config = {
  domain: 'dev-0os6vb5ixflyhsxc.us.auth0.com',
  clientId: '68QDM1Zjg7ONMb6nMXfJn3H1hynTpuTv',
  audience: '', // optional
  redirectUri: window.location.origin + '/programs.html' // redirect after login
};

// Initialize Auth0
let auth0 = null;

async function initializeAuth0() {
  console.log('Initializing Auth0...');
  const options = {
    domain: config.domain,
    clientId: config.clientId,
    authorizationParams: {
      redirect_uri: config.redirectUri
    }
  };
  if (config.audience) {
    options.authorizationParams.audience = config.audience;
  }
  auth0 = await window.auth0.createAuth0Client(options);
  console.log('Auth0 initialized');
}

// Check if user is authenticated
async function isAuthenticated() {
  if (!auth0) await initializeAuth0();
  return await auth0.isAuthenticated();
}

// Get user profile
async function getUser() {
  if (!auth0) await initializeAuth0();
  return await auth0.getUser();
}

// Login
async function login() {
  console.log('Login clicked');
  try {
    if (!auth0) await initializeAuth0();
    console.log('Calling loginWithRedirect');
    await auth0.loginWithRedirect();
  } catch (error) {
    console.error('Login error:', error);
  }
}

// Logout
async function logout() {
  console.log('Logout clicked');
  try {
    if (!auth0) await initializeAuth0();
    await auth0.logout({
      returnTo: window.location.origin + '/index.html'
    });
  } catch (error) {
    console.error('Logout error:', error);
  }
}

// Handle redirect callback
async function handleRedirectCallback() {
  console.log('Handling redirect callback');
  if (!auth0) await initializeAuth0();
  const result = await auth0.handleRedirectCallback();
  window.history.replaceState({}, document.title, window.location.pathname);
  return result;
}

// Update UI based on authentication status
async function updateUI() {
  console.log('Updating UI');
  try {
    const isAuth = await isAuthenticated();
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const userInfo = document.getElementById('user-info');

    if (isAuth) {
      const user = await getUser();
      if (loginBtn) loginBtn.style.display = 'none';
      if (logoutBtn) logoutBtn.style.display = 'inline-block';
      if (userInfo) userInfo.innerHTML = `Welcome, ${user.name || user.email}!`;
      console.log('User authenticated:', user);
    } else {
      if (loginBtn) loginBtn.style.display = 'inline-block';
      if (logoutBtn) logoutBtn.style.display = 'none';
      if (userInfo) userInfo.innerHTML = '';
      console.log('User not authenticated');
    }
  } catch (error) {
    console.error('Update UI error:', error);
  }
}

// Require user authentication and redirect to login if needed
async function requireAuth() {
  if (!auth0) await initializeAuth0();

  if (window.location.search.includes('code=') && window.location.search.includes('state=')) {
    console.log('Detected redirect callback in requireAuth');
    await handleRedirectCallback();
  }

  const auth = await isAuthenticated();
  if (!auth) {
    console.log('User not authenticated, redirecting to Auth0 login');
    await login();
    return false;
  }

  return true;
}

// Initialize on page load
window.addEventListener('load', async () => {
  console.log('Page loaded, initializing Auth0');
  try {
    await initializeAuth0();

    // Check for redirect callback
    if (window.location.search.includes('code=') && window.location.search.includes('state=')) {
      console.log('Detected redirect callback');
      await handleRedirectCallback();
    }

    updateUI();

    // Require authentication for protected pages
    if (window.location.pathname === '/programs.html') {
      const auth = await isAuthenticated();
      if (!auth) {
        console.log('Accessing protected page without authentication, redirecting to login');
        await login();
      }
    }
  } catch (error) {
    console.error('Initialization error:', error);
  }
});