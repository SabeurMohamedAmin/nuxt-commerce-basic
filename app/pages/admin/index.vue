<script setup lang="ts">
import type { OrderStatus } from '~/types'
import { formatPrice } from '~/utils/format'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const loading = ref(true)
const stats = ref({ totalProducts: 0, totalOrders: 0, totalUsers: 0, totalRevenue: 0 })
const recentOrders = ref<any[]>([])

function getStatusColor(status: OrderStatus): string {
  const map: Record<OrderStatus, string> = { completed: 'success', pending: 'warning', refunded: 'error' }
  return map[status] ?? 'grey'
}

const statCards = computed(() => [
  { label: 'Products', value: stats.value.totalProducts, icon: 'mdi-package-variant', color: 'primary' },
  { label: 'Orders', value: stats.value.totalOrders, icon: 'mdi-cart-check', color: 'success' },
  { label: 'Users', value: stats.value.totalUsers, icon: 'mdi-account-group', color: 'info' },
  { label: 'Revenue', value: formatPrice(stats.value.totalRevenue), icon: 'mdi-currency-usd', color: 'warning' },
])

onMounted(async () => {
  try {
    const [statsData, ordersData] = await Promise.all([
      $fetch('/api/admin/stats'),
      $fetch('/api/orders'),
    ])
    stats.value = statsData
    recentOrders.value = (ordersData as any[]).slice(0, 5)
  } catch {}
  loading.value = false
})
</script>

<template>
  <v-container class="py-8">
    <h1 class="text-h4 font-weight-bold mb-6">Admin Dashboard</h1>

    <div v-if="loading" class="text-center py-12">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <template v-else>
      <!-- Stats -->
      <v-row class="mb-8">
        <v-col v-for="stat in statCards" :key="stat.label" cols="12" sm="6" md="3">
          <v-card variant="outlined" rounded="lg" class="pa-4">
            <div class="d-flex align-center ga-3">
              <v-avatar :color="stat.color" variant="tonal" size="48">
                <v-icon>{{ stat.icon }}</v-icon>
              </v-avatar>
              <div>
                <p class="text-h5 font-weight-bold">{{ stat.value }}</p>
                <p class="text-body-2 text-grey">{{ stat.label }}</p>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Recent Orders -->
      <v-card variant="outlined" rounded="lg" class="mb-8">
        <v-card-title class="d-flex align-center justify-space-between">
          <span>Recent Orders</span>
          <v-btn variant="text" size="small" color="primary" to="/admin/orders">View All</v-btn>
        </v-card-title>
        <v-table v-if="recentOrders.length" density="comfortable">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in recentOrders" :key="order.id">
              <td class="text-body-2 font-weight-medium">#{{ order.id }}</td>
              <td class="text-body-2">{{ order.customerEmail }}</td>
              <td class="text-body-2">{{ order.productTitle }}</td>
              <td class="text-body-2 font-weight-medium">{{ formatPrice(order.amount) }}</td>
              <td class="text-body-2 text-grey">{{ order.createdAt?.split('T')[0] }}</td>
              <td><v-chip :color="getStatusColor(order.status)" size="x-small">{{ order.status }}</v-chip></td>
            </tr>
          </tbody>
        </v-table>
        <v-card-text v-else class="text-center text-grey">No orders yet</v-card-text>
      </v-card>

      <!-- Quick Actions -->
      <v-row>
        <v-col cols="12" md="6">
          <v-card variant="outlined" rounded="lg" class="pa-6">
            <h3 class="text-h6 font-weight-bold mb-4">Quick Actions</h3>
            <div class="d-flex flex-column ga-3">
              <v-btn color="primary" variant="flat" prepend-icon="mdi-plus" to="/admin/products/new">Add New Product</v-btn>
              <v-btn variant="outlined" prepend-icon="mdi-package-variant" to="/admin/products">Manage Products</v-btn>
              <v-btn variant="outlined" prepend-icon="mdi-account-group" to="/admin/users">Manage Users</v-btn>
              <v-btn variant="outlined" prepend-icon="mdi-cart" to="/admin/orders">View Orders</v-btn>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<style scoped></style>
