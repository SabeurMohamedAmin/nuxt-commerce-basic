<script setup lang="ts">
import { CATEGORIES } from '~/constants'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const route = useRoute()
const deleteDialog = ref(false)
const saving = ref(false)
const loading = ref(true)
const error = ref('')

const form = reactive({
  title: '',
  slug: '',
  description: '',
  category: '',
  price: 2.49,
  status: 'published',
  imagePreview: '',
  file: null as File | null,
})

// Fetch product data
onMounted(async () => {
  try {
    const product = await $fetch(`/api/admin/products/${route.params.id}`)
    form.title = product.title
    form.slug = product.slug
    form.description = product.description
    form.category = product.categorySlug
    form.price = product.price
    form.status = product.status
    form.imagePreview = product.image
  } catch {
    error.value = 'Product not found'
  } finally {
    loading.value = false
  }
})

function handleImageSelect(file: File) {
  const reader = new FileReader()
  reader.onload = (e) => { form.imagePreview = e.target?.result as string }
  reader.readAsDataURL(file)
}

async function updateProduct() {
  saving.value = true
  error.value = ''
  try {
    const categoryName = CATEGORIES.find(c => c.slug === form.category)?.name || ''
    await $fetch(`/api/admin/products/${route.params.id}`, {
      method: 'PUT',
      body: {
        title: form.title,
        slug: form.slug,
        description: form.description,
        price: form.price,
        image: form.imagePreview,
        category: categoryName,
        categorySlug: form.category,
        status: form.status,
      },
    })
    navigateTo('/admin/products')
  } catch (err: any) {
    error.value = err?.data?.message || 'Failed to update product'
  } finally {
    saving.value = false
  }
}

async function handleDelete() {
  try {
    await $fetch(`/api/admin/products/${route.params.id}`, { method: 'DELETE' })
    navigateTo('/admin/products')
  } catch {}
  deleteDialog.value = false
}
</script>

<template>
  <v-container class="py-8">
    <div class="d-flex align-center mb-6">
      <v-btn icon variant="text" to="/admin/products" class="mr-2">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <h1 class="text-h4 font-weight-bold">Edit Product</h1>
    </div>

    <div v-if="loading" class="text-center py-12">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <template v-else-if="!error">
      <v-alert v-if="error" type="error" variant="tonal" class="mb-6">{{ error }}</v-alert>

      <v-row>
        <v-col cols="12" md="8">
          <v-card variant="outlined" rounded="lg" class="pa-6 mb-6">
            <h2 class="text-h6 font-weight-bold mb-4">Product Information</h2>
            <v-text-field v-model="form.title" label="Product Title" variant="outlined" density="comfortable" class="mb-4" />
            <v-text-field v-model="form.slug" label="Slug" variant="outlined" density="comfortable" class="mb-4" />
            <v-textarea v-model="form.description" label="Description" variant="outlined" rows="6" class="mb-4" />
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
            <FileUploadZone accept="image/*" :preview="form.imagePreview" empty-icon="mdi-image-plus" empty-text="Click to change image" @file-selected="handleImageSelect" @remove="form.imagePreview = ''" />
          </v-card>

          <v-card variant="outlined" rounded="lg" class="pa-6">
            <h2 class="text-h6 font-weight-bold mb-4">Product File (ZIP)</h2>
            <FileUploadZone accept=".zip,.rar,.7z" :file="form.file" empty-icon="mdi-folder-zip" empty-text="Click to upload a new ZIP file" @file-selected="(f) => form.file = f" @remove="form.file = null" />
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card variant="outlined" rounded="lg" class="pa-6 mb-6">
            <h3 class="text-body-1 font-weight-bold mb-4">Publish</h3>
            <v-select v-model="form.status" :items="['draft', 'published']" label="Status" variant="outlined" density="compact" class="mb-4" />
            <v-btn block color="primary" size="large" :loading="saving" @click="updateProduct">
              <v-icon start>mdi-content-save</v-icon>
              Update Product
            </v-btn>
          </v-card>

          <v-card variant="outlined" rounded="lg" class="pa-6" color="error">
            <h3 class="text-body-1 font-weight-bold mb-2 text-error">Danger Zone</h3>
            <p class="text-body-2 text-grey mb-4">Permanently delete this product.</p>
            <v-btn block variant="outlined" color="error" @click="deleteDialog = true">Delete Product</v-btn>
          </v-card>
        </v-col>
      </v-row>
    </template>

    <v-card v-else flat class="text-center py-12">
      <v-icon size="64" color="grey-lighten-1">mdi-alert-circle-outline</v-icon>
      <p class="text-h6 text-grey mt-4">{{ error }}</p>
    </v-card>

    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card rounded="lg" class="pa-4">
        <v-card-title class="text-h6">Delete Product</v-card-title>
        <v-card-text>This will permanently delete the product.</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="error" variant="flat" @click="handleDelete">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped></style>
