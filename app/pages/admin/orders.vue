<script setup lang="ts">
import type { Order, OrderStatus } from '~/types'
import { PAGINATION } from '~/constants'
import { formatPrice } from '~/utils/format'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const search = ref('')
const statusFilter = ref('All')
const dateFilter = ref('')
const currentPage = ref(1)
const detailDialog = ref(false)
const selectedOrder = ref<Order | null>(null)

const statusOptions = ['All', 'completed', 'pending', 'refunded']

function getStatusColor(status: OrderStatus): string {
  const map: Record<OrderStatus, string> = { completed: 'success', pending: 'warning', refunded: 'error' }
  return map[status] ?? 'grey'
}

// Mock data
const orders = ref<Order[]>(generateOrders())

function generateOrders(): Order[] {
  const emails = ['john@example.com', 'sarah@example.com', 'mike@example.com', 'emma@example.com', 'alex@example.com']
  const products = ['WPBakery Page Builder', 'Elementor Pro Plugin', 'Xanadu Shopify Theme', 'Sleepy Template Kit', 'Bloxic HTML Template']
  const statuses: OrderStatus[] = ['completed', 'completed', 'completed', 'pending', 'refunded']

  return Array.from({ length: 50 }, (_, i) => ({
    id: 1247 - i,
    customerEmail: emails[i % emails.length],
    productTitle: products[i % products.length],
    amount: 2.49,
    date: new Date(2026, 4, 30 - Math.floor(i / 3)).toISOString().split('T')[0],
    status: statuses[i % statuses.length],
  }))
}

const filteredOrders = computed(() => {
  let result = orders.value
  if (search.value) {
    const q = search.value.toLowerCase()
    result = result.filter(o => o.customerEmail.includes(q) || o.productTitle.toLowerCase().includes(q))
  }
  if (statusFilter.value !== 'All') result = result.filter(o => o.status === statusFilter.value)
  if (dateFilter.value) result = result.filter(o => o.date === dateFilter.value)
  return result
})

const totalPages = computed(() => Math.ceil(filteredOrders.value.length / PAGINATION.ADMIN_PER_PAGE))
const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * PAGINATION.ADMIN_PER_PAGE
  return filteredOrders.value.slice(start, start + PAGINATION.ADMIN_PER_PAGE)
})

watch([search, statusFilter, dateFilter], () => { currentPage.value = 1 })

function viewOrder(order: Order) {
  selectedOrder.value = order
  detailDialog.value = true
}
</script>

<template>
  <v-container class="py-8">
    <h1 class="text-h4 font-weight-bold mb-6">Orders</h1>

    <!-- Filters -->
    <v-card variant="outlined" rounded="lg" class="mb-6">
      <v-card-text>
        <v-row align="center">
          <v-col cols="12" md="4">
            <v-text-field v-model="search" placeholder="Search by email or product..." variant="outlined" density="compact" hide-details prepend-inner-icon="mdi-magnify" clearable />
          </v-col>
          <v-col cols="12" md="3">
            <v-select v-model="statusFilter" :items="statusOptions" label="Status" variant="outlined" density="compact" hide-details />
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field v-model="dateFilter" label="Date" type="date" variant="outlined" density="compact" hide-details clearable />
          </v-col>
          <v-col cols="12" md="2" class="text-right">
            <span class="text-body-2 text-grey">{{ filteredOrders.length }} orders</span>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Table -->
    <v-card variant="outlined" rounded="lg">
      <v-table density="comfortable">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Product</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in paginatedOrders" :key="order.id">
            <td class="text-body-2 font-weight-bold">#{{ order.id }}</td>
            <td class="text-body-2">{{ order.customerEmail }}</td>
            <td class="text-body-2" style="max-width: 250px">{{ order.productTitle }}</td>
            <td class="text-body-2 font-weight-bold">{{ formatPrice(order.amount) }}</td>
            <td class="text-body-2 text-grey">{{ order.date }}</td>
            <td><v-chip :color="getStatusColor(order.status)" size="x-small">{{ order.status }}</v-chip></td>
            <td>
              <v-menu>
                <template #activator="{ props }">
                  <v-btn icon variant="text" size="x-small" v-bind="props">
                    <v-icon size="18">mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list density="compact">
                  <v-list-item @click="viewOrder(order)"><v-list-item-title>View Details</v-list-item-title></v-list-item>
                  <v-list-item v-if="order.status === 'pending'" @click="order.status = 'completed'"><v-list-item-title>Mark Completed</v-list-item-title></v-list-item>
                  <v-list-item v-if="order.status === 'completed'" @click="order.status = 'refunded'"><v-list-item-title class="text-error">Refund</v-list-item-title></v-list-item>
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
      <v-card v-if="selectedOrder" rounded="lg" class="pa-6">
        <v-card-title class="text-h6 pa-0 mb-4">Order #{{ selectedOrder.id }}</v-card-title>
        <v-list density="compact" class="pa-0">
          <v-list-item class="px-0"><v-list-item-title class="text-body-2 text-grey">Customer</v-list-item-title><v-list-item-subtitle class="text-body-2 font-weight-medium">{{ selectedOrder.customerEmail }}</v-list-item-subtitle></v-list-item>
          <v-list-item class="px-0"><v-list-item-title class="text-body-2 text-grey">Product</v-list-item-title><v-list-item-subtitle class="text-body-2 font-weight-medium">{{ selectedOrder.productTitle }}</v-list-item-subtitle></v-list-item>
          <v-list-item class="px-0"><v-list-item-title class="text-body-2 text-grey">Amount</v-list-item-title><v-list-item-subtitle class="text-body-2 font-weight-bold">{{ formatPrice(selectedOrder.amount) }}</v-list-item-subtitle></v-list-item>
          <v-list-item class="px-0"><v-list-item-title class="text-body-2 text-grey">Status</v-list-item-title><v-list-item-subtitle><v-chip :color="getStatusColor(selectedOrder.status)" size="x-small">{{ selectedOrder.status }}</v-chip></v-list-item-subtitle></v-list-item>
        </v-list>
        <v-card-actions class="pa-0 mt-4"><v-spacer /><v-btn variant="text" @click="detailDialog = false">Close</v-btn></v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped></style>
