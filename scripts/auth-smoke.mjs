const origin = process.env.NGM_API_ORIGIN || 'http://127.0.0.1:8787';
const suffix = `${Date.now()}-${Math.floor(Math.random() * 10_000)}`;
const credentials = {
  username: `Release${suffix}`.slice(0, 24),
  email: `release-${suffix}@example.com`,
  password: 'NineGates!Release2026',
};

const register = await fetch(`${origin}/api/auth/register`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(credentials),
});
if (register.status !== 201) throw new Error(`Registration failed: ${register.status} ${await register.text()}`);
const cookie = register.headers.get('set-cookie')?.split(';')[0];
if (!cookie) throw new Error('Registration did not set a session cookie.');
const registered = await register.json();
if (registered.user.rating !== 1500) throw new Error('New account did not receive the default rating.');

const profile = await fetch(`${origin}/api/profile`, { headers: { Cookie: cookie } });
if (!profile.ok) throw new Error(`Authenticated profile failed: ${profile.status}`);
const profileData = await profile.json();

const update = await fetch(`${origin}/api/profile`, {
  method: 'PUT',
  headers: { Cookie: cookie, 'Content-Type': 'application/json' },
  body: JSON.stringify({ avatarTile: 'winds:east' }),
});
if (!update.ok || (await update.json()).user.avatarTile !== 'winds:east') throw new Error('Profile update failed.');

const logout = await fetch(`${origin}/api/auth/logout`, { method: 'POST', headers: { Cookie: cookie } });
if (!logout.ok) throw new Error('Logout failed.');

const login = await fetch(`${origin}/api/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: credentials.email, password: credentials.password }),
});
if (!login.ok) throw new Error(`Login failed: ${login.status}`);

console.log(JSON.stringify({
  registeredUser: profileData.user.username,
  initialRating: profileData.user.rating,
  profileUpdated: true,
  logoutAndLogin: true,
}));
