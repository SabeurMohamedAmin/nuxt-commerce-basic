<script setup lang="ts">
import { formatFileSize } from '~/utils/format'

defineProps<{
  accept: string
  preview?: string
  file?: File | null
  emptyIcon: string
  emptyText: string
}>()

const emit = defineEmits<{
  'file-selected': [file: File]
  remove: []
}>()

const fileInput = ref<HTMLInputElement>()
const dragActive = ref(false)

function triggerInput() {
  fileInput.value?.click()
}

function handleSelect(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) emit('file-selected', file)
}

function handleDrop(e: DragEvent) {
  dragActive.value = false
  const file = e.dataTransfer?.files[0]
  if (file) emit('file-selected', file)
}
</script>

<template>
  <div
    class="upload-zone rounded-lg pa-8 text-center"
    :class="{ 'upload-zone--active': dragActive }"
    @dragover.prevent="dragActive = true"
    @dragleave="dragActive = false"
    @drop.prevent="handleDrop"
    @click="triggerInput"
  >
    <template v-if="preview">
      <v-img :src="preview" max-height="200" class="rounded mb-3" contain />
      <v-btn variant="text" size="small" color="error" @click.stop="emit('remove')">Remove</v-btn>
    </template>

    <template v-else-if="file">
      <v-icon size="48" color="success">mdi-file-check</v-icon>
      <p class="text-body-2 font-weight-medium mt-2">{{ file.name }}</p>
      <p class="text-caption text-grey">{{ formatFileSize(file.size) }}</p>
      <v-btn variant="text" size="small" color="error" class="mt-2" @click.stop="emit('remove')">Remove</v-btn>
    </template>

    <template v-else>
      <v-icon size="48" color="grey-lighten-1">{{ emptyIcon }}</v-icon>
      <p class="text-body-2 text-grey mt-2">{{ emptyText }}</p>
      <v-btn variant="outlined" size="small" class="mt-3">Choose File</v-btn>
    </template>
  </div>

  <input ref="fileInput" type="file" :accept="accept" class="d-none" @change="handleSelect">
</template>

<style scoped>
.upload-zone {
  border: 2px dashed #e0e0e0;
  transition: border-color 0.2s, background-color 0.2s;
  cursor: pointer;
}

.upload-zone:hover,
.upload-zone--active {
  border-color: #1565C0;
  background-color: #f5f9ff;
}
</style>
