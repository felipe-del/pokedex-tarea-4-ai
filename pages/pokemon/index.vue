<script setup lang="ts">
import { usePokemonStore } from '~/stores/pokemon'

const store = usePokemonStore()

// Carga el listado completo desde el store (colección de Nuxt Content)
await useAsyncData('pokemon-list', async () => {
  await store.fetchAll()
  return true
})

const showOnlyFavorites = ref(false)

const visible = computed(() =>
  showOnlyFavorites.value ? store.favoritePokemon : store.sortedById
)
</script>

<template>
  <div class="container">
    <div class="topbar">
      <h1>Pokédex</h1>
      <NuxtLink to="/" class="pill">← Inicio</NuxtLink>
    </div>

    <!-- Requisito 4: promedio de un campo numérico calculado en el store -->
    <div class="stats-bar">
      <span>Total de registros: <strong>{{ store.items.length }}</strong></span>
      <span>HP promedio: <strong>{{ store.averageHp }}</strong></span>
      <span>Favoritos: <strong>{{ store.favorites.length }}</strong></span>
      <label style="margin-left: auto; display:flex; align-items:center; gap:0.4rem; cursor:pointer;">
        <input type="checkbox" v-model="showOnlyFavorites" />
        Mostrar solo favoritos
      </label>
    </div>

    <div v-if="visible.length === 0" class="empty">
      {{ showOnlyFavorites ? 'Todavía no tienes favoritos. Marca alguno con ☆.' : 'No hay registros para mostrar.' }}
    </div>

    <div v-else class="grid">
      <div v-for="p in visible" :key="p.id" class="card">
        <button
          class="fav-btn"
          :class="{ active: store.isFavorite(p.id) }"
          :aria-label="store.isFavorite(p.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'"
          @click="store.toggleFavorite(p.id)"
        >
          {{ store.isFavorite(p.id) ? '★' : '☆' }}
        </button>

        <!-- Enlace a la página individual del registro -->
        <NuxtLink :to="`/pokemon/${p.id}`" class="card-body" style="display:block">
          <PokemonImage :dex="p.dex" :name="p.name" :size="120" />
          <div class="id">#{{ p.id }}</div>
          <div class="name">{{ p.name }}</div>
          <div class="types">
            <span class="type-badge">{{ p.type1 }}</span>
            <span v-if="p.type2" class="type-badge">{{ p.type2 }}</span>
          </div>
          <div style="font-size:0.85rem; color: var(--muted)">
            HP {{ p.hp }} · ATK {{ p.attack }} · SPD {{ p.speed }}
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
