import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    // Colección de tipo "data": no genera páginas automáticas,
    // solo expone los registros para consultarlos desde el store.
    // La columna "id" del CSV es el identificador que Nuxt Content usa
    // para cada fila (siempre llega como texto), por eso no se declara aquí;
    // el store la convierte a número.
    pokemon: defineCollection({
      type: 'data',
      source: 'pokemon.csv',
      schema: z.object({
        dex: z.number(),
        name: z.string(),
        type1: z.string(),
        type2: z.string().optional(),
        hp: z.number(),
        attack: z.number(),
        defense: z.number(),
        speed: z.number(),
        generation: z.number(),
        legendary: z.number() // 0 = no, 1 = sí
      })
    })
  }
})
