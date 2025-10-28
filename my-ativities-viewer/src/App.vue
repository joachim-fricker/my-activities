<template>
  <div class="app-container">
    <header>
      <img src="/src/assets/logo.png" alt="Logo" class="logo" /> <div style="color: #ecf0f1">Activity Viewer </div>
      <nav>
        <router-link to="/">Startseite</router-link>
        <router-link to="/allTracks">Alle Aktivitäten</router-link>
        <router-link to="/grid">GPX Tabelle</router-link>
      </nav>
    </header>

    <main>
      <router-view />
    </main>

  </div>
</template>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-width: 100vh;
}

main {
  flex: 1;
  width: 95%;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
header {
  background-color: #2c3e50;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  height: 40px;
}

nav {
  display: flex;
  gap: 1.5rem;
}

nav a {
  color: #ecf0f1;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s ease;
}

nav a:hover {
  color: #1abc9c;
}




</style>
