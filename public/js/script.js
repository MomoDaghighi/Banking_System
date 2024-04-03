document.getElementById('registerForm').addEventListener('submit', function(event){
  event.preventDefault();

  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  fetch('/api/auth/register', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
  })
  .then(response => response.json())
  .then(data => {
      if(data.success) {
          window.location.href = '/login';
      } else {
          alert(data.message);
      }
  })
  .catch(error => console.error('Error:', error));
});
