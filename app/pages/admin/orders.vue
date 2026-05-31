<script setup lang="ts">
import type { OrderStatus } from '~/types'
import { PAGINATION } from '~/constants'
import { formatPrice } from '~/utils/format'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const search = ref('')
const statusFilter = ref('All')
const currentPage = ref(1)
const loading = ref(true)
const detailDialog = ref(false)
const selectedOrder = ref<any>(null)
const orders = ref<any[]>([])

const statusOptions = ['All', 'completed', 'pending', 'refunded']

function getStatusColor(status: OrderStatus): string {
  const map: Record<OrderStatus, string> = { completed: 'success', pending: 'warning', refunded: 'error' }
  return map[status] ?? 'grey'
}

onMounted(async () => {
  try {
    orders.value = await $fetch('/api/orders')
  } catch {}
  loading.value = false
})

const filteredOrders = computed(() => {
  let result = orders.value
  if (search.value) {
    const q = search.value.toLowerCase()
    result = result.filter((o: any) => o.customerEmail?.toLowerCase().includes(q) || o.productTitle?.toLowerCase().includes(q))
  }
  if (statusFilter.value !== 'All') result = result.filter((o: any) => o.status === statusFilter.value)
  return result
})

const totalPages = computed(() => Math.ceil(filteredOrders.value.length / PAGINATION.ADMIN_PER_PAGE))
const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * PAGINATION.ADMIN_PER_PAGE
  return filteredOrders.value.slice(start, start + PAGINATION.ADMIN_PER_PAGE)
})

watch([search, statusFilter], () => { currentPage.value = 1 })

function viewOrder(order: any) { selectedOrder.value = order; detailDialog.value = true }

async function updateStatus(order: any, status: OrderStatus) {
  try {
    await $fetch(`/api/orders/${order.id}`, { method: 'PATCH', body: { status } })
    order.status = status
  } catch {}
}
</script>

<template>
  <v-container class="py-8">
    <h1 class="text-h4 font-weight-bold mb-6">Orders</h1>

    <v-card variant="outlined" rounded="lg" class="mb-6">
      <v-card-text>
        <v-row align="center">
          <v-col cols="12" md="5">
            <v-text-field v-model="search" placeholder="Search by email or product..." variant="outlined" density="compact" hide-details prepend-inner-icon="mdi-magnify" clearable />
          </v-col>
          <v-col cols="12" md="4">
            <v-select v-model="statusFilter" :items="statusOptions" label="Status" variant="outlined" density="compact" hide-details />
          </v-col>
          <v-col cols="12" md="3" class="text-right">
            <span class="text-body-2 text-grey">{{ filteredOrders.length }} orders</span>
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
          <tr><th>ID</th><th>Customer</th><th>Product</th><th>Amount</th><th>Date</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          <tr v-for="order in paginatedOrders" :key="order.id">
            <td class="text-body-2 font-weight-bold">#{{ order.id }}</td>
            <td class="text-body-2">{{ order.customerEmail }}</td>
            <td class="text-body-2">{{ order.productTitle }}</td>
            <td class="text-body-2 font-weight-bold">{{ formatPrice(order.amount) }}</td>
            <td class="text-body-2 text-grey">{{ order.createdAt?.split('T')[0] }}</td>
            <td><v-chip :color="getStatusColor(order.status)" size="x-small">{{ order.status }}</v-chip></td>
            <td>
              <v-menu>
                <template #activator="{ props }">
                  <v-btn icon variant="text" size="x-small" v-bind="props"><v-icon size="18">mdi-dots-vertical</v-icon></v-btn>
                </template>
                <v-list density="compact">
                  <v-list-item @click="viewOrder(order)"><v-list-item-title>View</v-list-item-title></v-list-item>
                  <v-list-item v-if="order.status === 'pending'" @click="updateStatus(order, 'completed')"><v-list-item-title>Complete</v-list-item-title></v-list-item>
                  <v-list-item v-if="order.status === 'completed'" @click="updateStatus(order, 'refunded')"><v-list-item-title class="text-error">Refund</v-list-item-title></v-list-item>
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
      <v-card v-if="selectedOrder" rounded="lg" class="pa-6">
        <v-card-title class="text-h6 pa-0 mb-4">Order #{{ selectedOrder.id }}</v-card-title>
        <v-list density="compact" class="pa-0">
          <v-list-item class="px-0"><v-list-item-title class="text-body-2 text-grey">Customer</v-list-item-title><v-list-item-subtitle>{{ selectedOrder.customerEmail }}</v-list-item-subtitle></v-list-item>
          <v-list-item class="px-0"><v-list-item-title class="text-body-2 text-grey">Product</v-list-item-title><v-list-item-subtitle>{{ selectedOrder.productTitle }}</v-list-item-subtitle></v-list-item>
          <v-list-item class="px-0"><v-list-item-title class="text-body-2 text-grey">Amount</v-list-item-title><v-list-item-subtitle>{{ formatPrice(selectedOrder.amount) }}</v-list-item-subtitle></v-list-item>
          <v-list-item class="px-0"><v-list-item-title class="text-body-2 text-grey">Status</v-list-item-title><v-list-item-subtitle><v-chip :color="getStatusColor(selectedOrder.status)" size="x-small">{{ selectedOrder.status }}</v-chip></v-list-item-subtitle></v-list-item>
        </v-list>
        <v-card-actions class="pa-0 mt-4"><v-spacer /><v-btn variant="text" @click="detailDialog = false">Close</v-btn></v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped></style>
