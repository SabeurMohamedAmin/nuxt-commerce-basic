<script setup lang="ts">
const emit = defineEmits<{ search: [query: string] }>()

const searchQuery = ref('')

function emitSearch() {
  if (searchQuery.value.trim()) {
    emit('search', searchQuery.value.trim())
  }
}
</script>

<template>
  <section class="hero-section">
    <v-container class="py-16 text-center text-white">
      <h1 class="text-h3 text-md-h2 font-weight-bold mb-4">Digital Products Marketplace</h1>
      <p class="text-body-1 mb-8 mx-auto" style="max-width: 600px">
        Access premium digital products, courses, and resources.
        Buy once, download anytime from your library.
      </p>

      <v-card class="mx-auto" max-width="560" rounded="pill" flat>
        <v-text-field
          v-model="searchQuery"
          placeholder="Find a product..."
          variant="solo"
          flat
          hide-details
          rounded="pill"
          @keyup.enter="emitSearch"
        >
          <template #append-inner>
            <v-btn color="primary" rounded="pill" size="small" @click="emitSearch">Search</v-btn>
          </template>
        </v-text-field>
      </v-card>

      <p class="text-body-2 mt-4 text-white-darken-1">
        ✓ All Items $2.49 Each ✓ Digital only ✓ Instant Download ✓ Unlimited Re-downloads
      </p>

      <div class="d-flex justify-center ga-3 mt-6">
        <v-btn color="white" variant="flat" rounded="pill" to="/products">Browse Products</v-btn>
      </div>
    </v-container>
  </section>
</template>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, #1565C0 0%, #0D47A1 50%, #1A237E 100%);
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}
</style>
