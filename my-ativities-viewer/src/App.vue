<template>
  <div class="app-container">
    <header>
      <img src="/src/assets/logo.png" alt="Logo" class="logo" /> <b> Activity Viewer </b>
      <nav>
        <router-link to="/">Startseite</router-link>
        <router-link to="/allTracks">Alle Aktivitäten</router-link>
        <router-link to="/world">Weltkarte</router-link>
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
  width: 98%;
  padding: 2px;
  background-color: #fff;
   
}
header {
 background-color: rgb(247, 247, 239);
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
  color: #080808;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s ease;
}

nav a:hover {
  color: #1abc9c;
}




</style>
