<script setup lang="ts">
import type { ManagedUser } from '~/types'
import { PAGINATION } from '~/constants'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const search = ref('')
const roleFilter = ref('All')
const currentPage = ref(1)
const loading = ref(true)
const detailDialog = ref(false)
const deleteDialog = ref(false)
const selectedUser = ref<ManagedUser | null>(null)
const userToDelete = ref<ManagedUser | null>(null)
const users = ref<ManagedUser[]>([])

onMounted(async () => {
  try {
    const data = await $fetch('/api/admin/users')
    users.value = (data as any[]).map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      purchases: u.purchases || 0,
      joined: u.createdAt?.split('T')[0] || '',
    }))
  } catch {}
  loading.value = false
})

const filteredUsers = computed(() => {
  let result = users.value
  if (search.value) {
    const q = search.value.toLowerCase()
    result = result.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
  }
  if (roleFilter.value !== 'All') result = result.filter(u => u.role === roleFilter.value)
  return result
})

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / PAGINATION.ADMIN_PER_PAGE))
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * PAGINATION.ADMIN_PER_PAGE
  return filteredUsers.value.slice(start, start + PAGINATION.ADMIN_PER_PAGE)
})

watch([search, roleFilter], () => { currentPage.value = 1 })

function viewUser(u: ManagedUser) { selectedUser.value = u; detailDialog.value = true }
function confirmDelete(u: ManagedUser) { userToDelete.value = u; deleteDialog.value = true }

async function deleteUser() {
  if (!userToDelete.value) return
  try {
    await $fetch(`/api/admin/users/${userToDelete.value.id}`, { method: 'DELETE' })
    users.value = users.value.filter(u => u.id !== userToDelete.value!.id)
  } catch {}
  deleteDialog.value = false
  userToDelete.value = null
}
</script>

<template>
  <v-container class="py-8">
    <h1 class="text-h4 font-weight-bold mb-6">Users</h1>

    <v-card variant="outlined" rounded="lg" class="mb-6">
      <v-card-text>
        <v-row align="center">
          <v-col cols="12" md="5">
            <v-text-field v-model="search" placeholder="Search by name or email..." variant="outlined" density="compact" hide-details prepend-inner-icon="mdi-magnify" clearable />
          </v-col>
          <v-col cols="12" md="4">
            <v-select v-model="roleFilter" :items="['All', 'customer', 'admin']" label="Role" variant="outlined" density="compact" hide-details />
          </v-col>
          <v-col cols="12" md="3" class="text-right">
            <span class="text-body-2 text-grey">{{ filteredUsers.length }} users</span>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <div v-if="loading" class="text-center py-12">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <v-card v-else variant="outlined" rounded="lg">
      <v-table density="comfortable">
        <thead>
          <tr><th>User</th><th>Email</th><th>Role</th><th>Purchases</th><th>Joined</th><th>Actions</th></tr>
        </thead>
        <tbody>
          <tr v-for="u in paginatedUsers" :key="u.id">
            <td>
              <div class="d-flex align-center ga-2 py-2">
                <v-avatar :color="u.role === 'admin' ? 'primary' : 'orange'" size="32">
                  <span class="text-white text-caption">{{ u.name.charAt(0).toUpperCase() }}</span>
                </v-avatar>
                <span class="text-body-2 font-weight-medium">{{ u.name }}</span>
              </div>
            </td>
            <td class="text-body-2">{{ u.email }}</td>
            <td><v-chip :color="u.role === 'admin' ? 'primary' : 'grey'" size="x-small" variant="tonal">{{ u.role }}</v-chip></td>
            <td class="text-body-2">{{ u.purchases }}</td>
            <td class="text-body-2 text-grey">{{ u.joined }}</td>
            <td>
              <v-menu>
                <template #activator="{ props }">
                  <v-btn icon variant="text" size="x-small" v-bind="props"><v-icon size="18">mdi-dots-vertical</v-icon></v-btn>
                </template>
                <v-list density="compact">
                  <v-list-item @click="viewUser(u)"><v-list-item-title>View</v-list-item-title></v-list-item>
                  <v-list-item @click="confirmDelete(u)"><v-list-item-title class="text-error">Delete</v-list-item-title></v-list-item>
                </v-list>
              </v-menu>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <div v-if="totalPages > 1" class="d-flex justify-center mt-6">
      <v-pagination v-model="currentPage" :length="totalPages" :total-visible="5" rounded="circle" color="primary" />
    </div>

    <v-dialog v-model="detailDialog" max-width="500">
      <v-card v-if="selectedUser" rounded="lg" class="pa-6">
        <div class="d-flex align-center ga-3 mb-4">
          <v-avatar :color="selectedUser.role === 'admin' ? 'primary' : 'orange'" size="48">
            <span class="text-white text-h6">{{ selectedUser.name.charAt(0).toUpperCase() }}</span>
          </v-avatar>
          <div>
            <p class="text-h6 font-weight-bold">{{ selectedUser.name }}</p>
            <p class="text-body-2 text-grey">{{ selectedUser.email }}</p>
          </div>
        </div>
        <v-divider class="mb-4" />
        <v-list density="compact" class="pa-0">
          <v-list-item class="px-0"><v-list-item-title class="text-body-2 text-grey">Purchases</v-list-item-title><v-list-item-subtitle>{{ selectedUser.purchases }} products</v-list-item-subtitle></v-list-item>
          <v-list-item class="px-0"><v-list-item-title class="text-body-2 text-grey">Joined</v-list-item-title><v-list-item-subtitle>{{ selectedUser.joined }}</v-list-item-subtitle></v-list-item>
        </v-list>
        <v-card-actions class="pa-0 mt-4"><v-spacer /><v-btn variant="text" @click="detailDialog = false">Close</v-btn></v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card rounded="lg" class="pa-4">
        <v-card-title class="text-h6">Delete User</v-card-title>
        <v-card-text>Are you sure you want to delete <strong>{{ userToDelete?.name }}</strong>?</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="error" variant="flat" @click="deleteUser">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped></style>
