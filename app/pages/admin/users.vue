<template>
  <v-container class="py-8">
    <h1 class="text-h4 font-weight-bold mb-6">Users</h1>

    <!-- Filters -->
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

    <!-- Table -->
    <v-card variant="outlined" rounded="lg">
      <v-table density="comfortable">
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Role</th>
            <th>Purchases</th>
            <th>Joined</th>
            <th>Actions</th>
          </tr>
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
                  <v-list-item @click="viewUser(u)"><v-list-item-title>View Details</v-list-item-title></v-list-item>
                  <v-list-item v-if="u.role !== 'admin'" @click="u.role = 'admin'"><v-list-item-title>Make Admin</v-list-item-title></v-list-item>
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

    <!-- Detail Dialog -->
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
          <v-list-item class="px-0"><v-list-item-title class="text-body-2 text-grey">Purchases</v-list-item-title><v-list-item-subtitle class="text-body-2 font-weight-medium">{{ selectedUser.purchases }} products</v-list-item-subtitle></v-list-item>
          <v-list-item class="px-0"><v-list-item-title class="text-body-2 text-grey">Joined</v-list-item-title><v-list-item-subtitle class="text-body-2">{{ selectedUser.joined }}</v-list-item-subtitle></v-list-item>
        </v-list>
        <v-card-actions class="pa-0 mt-4"><v-spacer /><v-btn variant="text" @click="detailDialog = false">Close</v-btn></v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Dialog -->
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

<script setup lang="ts">
import type { ManagedUser } from '~/types'
import { PAGINATION } from '~/constants'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const search = ref('')
const roleFilter = ref('All')
const currentPage = ref(1)
const detailDialog = ref(false)
const deleteDialog = ref(false)
const selectedUser = ref<ManagedUser | null>(null)
const userToDelete = ref<ManagedUser | null>(null)

const users = ref<ManagedUser[]>([
  { id: 1, name: 'Admin', email: 'aminsab@outlook.fr', role: 'admin', purchases: 0, joined: '2025-01-01' },
  { id: 2, name: 'John Doe', email: 'john@example.com', role: 'customer', purchases: 12, joined: '2025-03-15' },
  { id: 3, name: 'Sarah Smith', email: 'sarah@example.com', role: 'customer', purchases: 8, joined: '2025-04-20' },
  { id: 4, name: 'Mike Johnson', email: 'mike@example.com', role: 'customer', purchases: 5, joined: '2025-05-10' },
  { id: 5, name: 'Emma Wilson', email: 'emma@example.com', role: 'customer', purchases: 3, joined: '2025-06-01' },
  { id: 6, name: 'Alex Brown', email: 'alex@example.com', role: 'customer', purchases: 15, joined: '2025-02-28' },
  { id: 7, name: 'Lisa Davis', email: 'lisa@example.com', role: 'customer', purchases: 7, joined: '2025-07-12' },
  { id: 8, name: 'David Lee', email: 'david@example.com', role: 'customer', purchases: 2, joined: '2025-08-05' },
])

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
function deleteUser() {
  if (userToDelete.value) users.value = users.value.filter(u => u.id !== userToDelete.value!.id)
  deleteDialog.value = false
  userToDelete.value = null
}
</script>
