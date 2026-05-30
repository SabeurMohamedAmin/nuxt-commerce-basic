<template>
  <v-container class="py-12">
    <h1 class="text-h3 font-weight-bold text-center mb-2">Membership Plans</h1>
    <p class="text-body-1 text-grey text-center mb-10">
      Get unlimited access to all our digital products with a single membership
    </p>

    <v-row justify="center">
      <v-col v-for="plan in plans" :key="plan.name" cols="12" sm="6" md="4">
        <v-card
          :variant="plan.popular ? 'elevated' : 'outlined'"
          :elevation="plan.popular ? 8 : 0"
          rounded="xl"
          class="h-100 d-flex flex-column"
          :class="{ 'border-primary': plan.popular }"
        >
          <v-card-text class="text-center pa-8 flex-grow-1">
            <v-chip v-if="plan.popular" color="primary" size="small" class="mb-4">Most Popular</v-chip>
            <h2 class="text-h5 font-weight-bold mb-2">{{ plan.name }}</h2>
            <p class="text-h3 font-weight-bold text-primary mb-1">
              ${{ plan.price }}
            </p>
            <p class="text-body-2 text-grey mb-6">{{ plan.period }}</p>

            <v-list density="compact" class="text-left">
              <v-list-item v-for="feature in plan.features" :key="feature" class="px-0">
                <template #prepend>
                  <v-icon color="success" size="20" class="mr-2">mdi-check-circle</v-icon>
                </template>
                <v-list-item-title class="text-body-2">{{ feature }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card-text>

          <v-card-actions class="pa-8 pt-0">
            <v-btn
              block
              :color="plan.popular ? 'primary' : 'grey-darken-3'"
              :variant="plan.popular ? 'flat' : 'outlined'"
              size="large"
              rounded="pill"
              to="/checkout"
            >
              Choose {{ plan.name }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
const plans = [
  {
    name: 'Monthly',
    price: '4.99',
    period: 'per month',
    popular: false,
    features: [
      'Unlimited downloads',
      'Access to all products',
      'New products weekly',
      'Cancel anytime',
    ],
  },
  {
    name: 'Annual',
    price: '29.99',
    period: 'per year',
    popular: true,
    features: [
      'Unlimited downloads',
      'Access to all products',
      'New products weekly',
      'Cancel anytime',
      'Save 50% vs monthly',
      'Priority support',
    ],
  },
  {
    name: 'Lifetime',
    price: '99.99',
    period: 'one-time payment',
    popular: false,
    features: [
      'Unlimited downloads forever',
      'Access to all products',
      'All future products included',
      'Priority support',
      'No recurring charges',
    ],
  },
]
</script>
