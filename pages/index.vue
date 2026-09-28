<script setup lang="ts">
definePageMeta({})
</script>

<template>
  <div class="container">
    <div class="topbar">
      <h1>Tarea 4 · Nuxt + Pinia + Nuxt Content</h1>
      <p>Isaac Felipe Brenes Calderón | 1-1904-0860</p>
    </div>
    <p style="color: var(--muted)">
      Dataset: Pokémon (CSV, colección de tipo <code>data</code>).
    </p>
    <NuxtLink to="/pokemon" class="nav-link" style="display:inline-block; max-width:260px;">
      Ver listado de Pokémon →
    </NuxtLink>
  </div>
</template>
