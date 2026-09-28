<script setup lang="ts">
import { imageUrl } from '~/stores/pokemon'

const props = defineProps<{ dex: number; name: string; size?: number }>()
const failed = ref(false)
watch(() => props.dex, () => (failed.value = false))
</script>

<template>
  <div class="poke-img" :style="{ width: `${size ?? 120}px`, height: `${size ?? 120}px` }">
    <img
      v-if="!failed"
      :src="imageUrl(dex)"
      :alt="name"
      loading="lazy"
      :width="size ?? 120"
      :height="size ?? 120"
      @error="failed = true"
    />
    <span v-else class="poke-img-fallback" aria-hidden="true">?</span>
  </div>
</template>
