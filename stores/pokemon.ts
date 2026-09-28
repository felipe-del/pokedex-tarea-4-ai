import { defineStore } from 'pinia'

export interface Pokemon {
  id: number
  dex: number
  name: string
  type1: string
  type2: string
  hp: number
  attack: number
  defense: number
  speed: number
  generation: number
  legendary: boolean
}

// Nuxt Content devuelve el "id" de cada fila del CSV como texto.
// Aquí se convierte cada registro a los tipos reales de la aplicación.
export function toPokemon(row: Record<string, any>): Pokemon {
  return {
    id: Number(row.id),
    dex: Number(row.dex),
    name: String(row.name),
    type1: String(row.type1 ?? ''),
    type2: String(row.type2 ?? ''),
    hp: Number(row.hp),
    attack: Number(row.attack),
    defense: Number(row.defense),
    speed: Number(row.speed),
    generation: Number(row.generation),
    legendary: Number(row.legendary) === 1
  }
}

export function imageUrl(dex: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${dex}.png`
}

interface State {
  items: Pokemon[]
  currentId: number | null
  favorites: number[]
}

export const usePokemonStore = defineStore('pokemon', {
  state: (): State => ({
    items: [],
    currentId: null,
    favorites: []
  }),

  getters: {
    // Requisito 4: promedio de un campo numérico (hp) sobre todo el listado
    averageHp: (state): number => {
      if (state.items.length === 0) return 0
      const total = state.items.reduce((sum, p) => sum + p.hp, 0)
      return Math.round((total / state.items.length) * 100) / 100
    },

    sortedById: (state): Pokemon[] => [...state.items].sort((a, b) => a.id - b.id),

    isFavorite: (state) => (id: number) => state.favorites.includes(id),

    favoritePokemon(state): Pokemon[] {
      return this.sortedById.filter((p) => state.favorites.includes(p.id))
    },

    // Registro individual seleccionado con fetchOne()
    current(state): Pokemon | null {
      return state.items.find((p) => p.id === state.currentId) ?? null
    },

    // Requisito 3: registro anterior y siguiente respecto al actual
    previousPokemon(): Pokemon | null {
      const list = this.sortedById
      const i = list.findIndex((p) => p.id === this.currentId)
      return i > 0 ? list[i - 1] : null
    },

    nextPokemon(): Pokemon | null {
      const list = this.sortedById
      const i = list.findIndex((p) => p.id === this.currentId)
      return i >= 0 && i < list.length - 1 ? list[i + 1] : null
    }
  },

  actions: {
    // Requisito 2: cargar el listado completo (una sola vez)
    async fetchAll(): Promise<Pokemon[]> {
      if (this.items.length === 0) {
        const rows = await queryCollection('pokemon').all()
        this.items = rows.map((r) => toPokemon(r as Record<string, any>))
      }
      return this.items
    },

    // Requisito 2: cargar un registro individual
    async fetchOne(id: number): Promise<Pokemon | null> {
      await this.fetchAll()
      this.currentId = id
      return this.current
    },

    // Requisito 5: lista de favoritos
    toggleFavorite(id: number) {
      const i = this.favorites.indexOf(id)
      if (i === -1) this.favorites.push(id)
      else this.favorites.splice(i, 1)
    }
  },

  // Requisito 5: los favoritos se conservan al recargar (cookie vía
  // pinia-plugin-persistedstate). Solo se persiste "favorites".
  persist: {
    pick: ['favorites'],
    storage: piniaPluginPersistedstate.cookies()
  }
})
