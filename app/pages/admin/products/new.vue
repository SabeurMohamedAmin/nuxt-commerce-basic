<script setup lang="ts">
import { CATEGORIES, DEFAULT_PRODUCT_PRICE } from '~/constants'
import { slugify } from '~/utils/format'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const saving = ref(false)
const error = ref('')

const form = reactive({
  title: '',
  slug: '',
  description: '',
  previewUrl: '',
  category: '',
  price: DEFAULT_PRODUCT_PRICE,
  status: 'draft',
  imagePreview: '',
  file: null as File | null,
})

// Auto-generate slug
watch(() => form.title, (val) => { form.slug = slugify(val) })

const checklist = computed(() => [
  { label: 'Title', done: !!form.title },
  { label: 'Description', done: !!form.description },
  { label: 'Category', done: !!form.category },
  { label: 'Preview URL', done: !!form.previewUrl },
  { label: 'Image', done: !!form.imagePreview },
  { label: 'ZIP File', done: !!form.file },
])

function handleImageSelect(file: File) {
  const reader = new FileReader()
  reader.onload = (e) => { form.imagePreview = e.target?.result as string }
  reader.readAsDataURL(file)
}

async function saveProduct() {
  if (!form.title || !form.slug || !form.category) {
    error.value = 'Title, slug, and category are required'
    return
  }

  saving.value = true
  error.value = ''

  try {
    const categoryName = CATEGORIES.find(c => c.slug === form.category)?.name || ''

    await $fetch('/api/admin/products', {
      method: 'POST',
      body: {
        title: form.title,
        slug: form.slug,
        description: form.description,
        previewUrl: form.previewUrl || null,
        price: form.price,
        image: form.imagePreview || '',
        category: categoryName,
        categorySlug: form.category,
        status: form.status,
      },
    })

    navigateTo('/admin/products')
  } catch (err: any) {
    error.value = err?.data?.message || 'Failed to save product'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <v-container class="py-8">
    <div class="d-flex align-center mb-6">
      <v-btn icon variant="text" to="/admin/products" class="mr-2">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <h1 class="text-h4 font-weight-bold">Add New Product</h1>
    </div>

    <v-alert v-if="error" type="error" variant="tonal" class="mb-6">{{ error }}</v-alert>

    <v-row>
      <v-col cols="12" md="8">
        <v-card variant="outlined" rounded="lg" class="pa-6 mb-6">
          <h2 class="text-h6 font-weight-bold mb-4">Product Information</h2>
          <v-text-field v-model="form.title" label="Product Title" variant="outlined" density="comfortable" class="mb-4" />
          <v-text-field v-model="form.slug" label="Slug" variant="outlined" density="comfortable" class="mb-4" hint="Auto-generated from title" persistent-hint />
          <v-textarea v-model="form.description" label="Description" variant="outlined" rows="6" class="mb-4" />
          <v-text-field v-model="form.previewUrl" label="Preview / Demo URL" variant="outlined" density="comfortable" class="mb-4" placeholder="https://demo.example.com/theme-preview" hint="External link where buyers can preview the product live" persistent-hint />
          <v-row>
            <v-col cols="12" sm="6">
              <v-select v-model="form.category" :items="CATEGORIES" item-title="name" item-value="slug" label="Category" variant="outlined" density="comfortable" />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model.number="form.price" label="Price ($)" variant="outlined" density="comfortable" type="number" step="0.01" min="0" />
            </v-col>
          </v-row>
        </v-card>

        <v-card variant="outlined" rounded="lg" class="pa-6 mb-6">
          <h2 class="text-h6 font-weight-bold mb-4">Product Image</h2>
          <FileUploadZone accept="image/*" :preview="form.imagePreview" empty-icon="mdi-image-plus" empty-text="Drag & drop an image or click to browse" @file-selected="handleImageSelect" @remove="form.imagePreview = ''" />
        </v-card>

        <v-card variant="outlined" rounded="lg" class="pa-6">
          <h2 class="text-h6 font-weight-bold mb-4">Product File (ZIP)</h2>
          <FileUploadZone accept=".zip,.rar,.7z" :file="form.file" empty-icon="mdi-folder-zip" empty-text="Drag & drop a ZIP file or click to browse" @file-selected="(f) => form.file = f" @remove="form.file = null" />
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card variant="outlined" rounded="lg" class="pa-6 mb-6">
          <h3 class="text-body-1 font-weight-bold mb-4">Publish</h3>
          <v-select v-model="form.status" :items="['draft', 'published']" label="Status" variant="outlined" density="compact" class="mb-4" />
          <v-btn block color="primary" size="large" :loading="saving" @click="saveProduct">
            <v-icon start>mdi-content-save</v-icon>
            Save Product
          </v-btn>
        </v-card>

        <v-card variant="outlined" rounded="lg" class="pa-6">
          <h3 class="text-body-1 font-weight-bold mb-4">Checklist</h3>
          <v-list density="compact" class="pa-0">
            <v-list-item v-for="item in checklist" :key="item.label" class="px-0">
              <template #prepend>
                <v-icon size="18" class="mr-2" :color="item.done ? 'success' : 'grey'">
                  {{ item.done ? 'mdi-check-circle' : 'mdi-circle-outline' }}
                </v-icon>
              </template>
              <v-list-item-title class="text-body-2">{{ item.label }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped></style>
