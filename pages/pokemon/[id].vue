<script setup lang="ts">
import { usePokemonStore } from '~/stores/pokemon'

const route = useRoute()
const store = usePokemonStore()

const id = computed(() => Number(route.params.id))

// Carga el registro individual desde el store (acción fetchOne)
await useAsyncData(
  () => `pokemon-${id.value}`,
  async () => {
    await store.fetchOne(id.value)
    return true
  },
  { watch: [id] }
)

const pokemon = computed(() => store.current)
</script>

<template>
  <div class="container">
    <NuxtLink to="/pokemon" class="back-link">← Volver al listado</NuxtLink>

    <div v-if="!pokemon" class="empty">
      No se encontró el registro #{{ route.params.id }}.
    </div>

    <div v-else class="detail-card">
      <div class="detail-hero">
        <PokemonImage :dex="pokemon.dex" :name="pokemon.name" :size="220" />
        <div class="info">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:1rem;">
            <div>
              <div class="id" style="color: var(--muted)">#{{ pokemon.id }}</div>
              <h1 style="margin:0.2rem 0; text-transform:capitalize;">{{ pokemon.name }}</h1>
            </div>
            <button
              class="fav-btn"
              style="position:static; font-size:1.8rem;"
              :class="{ active: store.isFavorite(pokemon.id) }"
              :aria-label="store.isFavorite(pokemon.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'"
              @click="store.toggleFavorite(pokemon.id)"
            >
              {{ store.isFavorite(pokemon.id) ? '★' : '☆' }}
            </button>
          </div>
          <div class="types">
            <span class="type-badge">{{ pokemon.type1 }}</span>
            <span v-if="pokemon.type2" class="type-badge">{{ pokemon.type2 }}</span>
          </div>
        </div>
      </div>

      <!-- Requisito 3: todos los campos del registro -->
      <div class="field-list">
        <div class="field"><div class="label">ID</div><div class="value">{{ pokemon.id }}</div></div>
        <div class="field"><div class="label">N.º Pokédex</div><div class="value">{{ pokemon.dex }}</div></div>
        <div class="field"><div class="label">Nombre</div><div class="value">{{ pokemon.name }}</div></div>
        <div class="field"><div class="label">Tipo 1</div><div class="value">{{ pokemon.type1 }}</div></div>
        <div class="field"><div class="label">Tipo 2</div><div class="value">{{ pokemon.type2 || '—' }}</div></div>
        <div class="field"><div class="label">HP</div><div class="value">{{ pokemon.hp }}</div></div>
        <div class="field"><div class="label">Ataque</div><div class="value">{{ pokemon.attack }}</div></div>
        <div class="field"><div class="label">Defensa</div><div class="value">{{ pokemon.defense }}</div></div>
        <div class="field"><div class="label">Velocidad</div><div class="value">{{ pokemon.speed }}</div></div>
        <div class="field"><div class="label">Generación</div><div class="value">{{ pokemon.generation }}</div></div>
        <div class="field"><div class="label">Legendario</div><div class="value">{{ pokemon.legendary ? 'Sí' : 'No' }}</div></div>
      </div>

      <!-- Requisito 3: enlaces al registro anterior y siguiente -->
      <div class="nav-row">
        <NuxtLink
          v-if="store.previousPokemon"
          class="nav-link"
          :to="`/pokemon/${store.previousPokemon.id}`"
        >
          ← #{{ store.previousPokemon.id }} {{ store.previousPokemon.name }}
        </NuxtLink>
        <span v-else class="nav-link disabled">← Sin anterior</span>

        <NuxtLink
          v-if="store.nextPokemon"
          class="nav-link next"
          :to="`/pokemon/${store.nextPokemon.id}`"
        >
          #{{ store.nextPokemon.id }} {{ store.nextPokemon.name }} →
        </NuxtLink>
        <span v-else class="nav-link next disabled">Sin siguiente →</span>
      </div>
    </div>
  </div>
</template>
