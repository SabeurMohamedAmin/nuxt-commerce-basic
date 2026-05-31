<script setup lang="ts">
import type { OrderStatus } from '~/types'
import { formatPrice } from '~/utils/format'

definePageMeta({ layout: 'admin', middleware: 'admin' })

function getStatusColor(status: OrderStatus): string {
  const map: Record<OrderStatus, string> = { completed: 'success', pending: 'warning', refunded: 'error' }
  return map[status] ?? 'grey'
}

const stats = [
  { label: 'Products', value: '614', icon: 'mdi-package-variant', color: 'primary' },
  { label: 'Orders', value: '1,247', icon: 'mdi-cart-check', color: 'success' },
  { label: 'Users', value: '389', icon: 'mdi-account-group', color: 'info' },
  { label: 'Revenue', value: '$3,104.03', icon: 'mdi-currency-usd', color: 'warning' },
]

const recentOrders = [
  { id: 1247, customerEmail: 'john@example.com', productTitle: 'WPBakery Page Builder', amount: 2.49, date: '2026-05-30', status: 'completed' as OrderStatus },
  { id: 1246, customerEmail: 'sarah@example.com', productTitle: 'Elementor Pro Plugin', amount: 2.49, date: '2026-05-30', status: 'completed' as OrderStatus },
  { id: 1245, customerEmail: 'mike@example.com', productTitle: 'Xanadu Shopify Theme', amount: 2.49, date: '2026-05-29', status: 'completed' as OrderStatus },
  { id: 1244, customerEmail: 'emma@example.com', productTitle: 'Sleepy Template Kit', amount: 2.49, date: '2026-05-29', status: 'pending' as OrderStatus },
  { id: 1243, customerEmail: 'alex@example.com', productTitle: 'Bloxic HTML Template', amount: 2.49, date: '2026-05-28', status: 'completed' as OrderStatus },
]

const recentActivity = [
  { id: 1, icon: 'mdi-cart-check', color: 'success', text: 'New order #1247 from john@example.com', time: '2 minutes ago' },
  { id: 2, icon: 'mdi-account-plus', color: 'info', text: 'New user registered: sarah@example.com', time: '15 minutes ago' },
  { id: 3, icon: 'mdi-upload', color: 'primary', text: 'Product updated: WPBakery Page Builder', time: '1 hour ago' },
  { id: 4, icon: 'mdi-cart-check', color: 'success', text: 'New order #1246 from sarah@example.com', time: '2 hours ago' },
  { id: 5, icon: 'mdi-plus-circle', color: 'primary', text: 'New product added: Flavstarter Template', time: '5 hours ago' },
]
</script>

<template>
  <v-container class="py-8">
    <h1 class="text-h4 font-weight-bold mb-6">Admin Dashboard</h1>

    <!-- Stats -->
    <v-row class="mb-8">
      <v-col v-for="stat in stats" :key="stat.label" cols="12" sm="6" md="3">
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
      <v-table density="comfortable">
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
            <td class="text-body-2 text-grey">{{ order.date }}</td>
            <td>
              <v-chip :color="getStatusColor(order.status)" size="x-small">{{ order.status }}</v-chip>
            </td>
          </tr>
        </tbody>
      </v-table>
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
      <v-col cols="12" md="6">
        <v-card variant="outlined" rounded="lg" class="pa-6">
          <h3 class="text-h6 font-weight-bold mb-4">Recent Activity</h3>
          <v-list density="compact">
            <v-list-item v-for="activity in recentActivity" :key="activity.id" class="px-0">
              <template #prepend>
                <v-icon :color="activity.color" size="20" class="mr-3">{{ activity.icon }}</v-icon>
              </template>
              <v-list-item-title class="text-body-2">{{ activity.text }}</v-list-item-title>
              <v-list-item-subtitle class="text-caption">{{ activity.time }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped></style>
