const handleSubmit = async (e) => {
  e.preventDefault();

  const res = await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();

  if (res.ok) {
    console.log(`Welcome to Barter-Buddy ${username}!`);
  } else {
    console.error(`OOPS Error: ${data.message}`);
  }
};

export default;
