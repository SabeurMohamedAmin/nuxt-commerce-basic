<template>
  <v-footer class="bg-white border-t pa-0">
    <v-container class="py-8">
      <!-- Links -->
      <div class="d-flex flex-wrap justify-center ga-6 mb-4">
        <NuxtLink to="/terms" class="text-body-2 text-grey-darken-1 text-decoration-none">
          Terms &amp; Conditions
        </NuxtLink>
        <NuxtLink to="/privacy" class="text-body-2 text-grey-darken-1 text-decoration-none">
          Privacy Policy
        </NuxtLink>
        <NuxtLink to="/dmca" class="text-body-2 text-grey-darken-1 text-decoration-none">
          DMCA
        </NuxtLink>
        <NuxtLink to="/contact" class="text-body-2 text-grey-darken-1 text-decoration-none">
          Contact
        </NuxtLink>
        <NuxtLink to="/refund" class="text-body-2 text-grey-darken-1 text-decoration-none">
          Refund Policy
        </NuxtLink>
        <NuxtLink to="/help" class="text-body-2 text-grey-darken-1 text-decoration-none">
          Help
        </NuxtLink>
      </div>

      <!-- Social -->
      <div class="d-flex justify-center ga-3 mb-4">
        <v-btn icon variant="text" size="small" color="grey-darken-1">
          <v-icon>mdi-facebook</v-icon>
        </v-btn>
        <v-btn icon variant="text" size="small" color="grey-darken-1">
          <v-icon>mdi-twitter</v-icon>
        </v-btn>
        <v-btn icon variant="text" size="small" color="grey-darken-1">
          <v-icon>mdi-pinterest</v-icon>
        </v-btn>
      </div>

      <!-- Copyright -->
      <p class="text-center text-body-2 text-grey">
        &copy; {{ new Date().getFullYear() }} devclub.store - All Rights Reserved
      </p>
    </v-container>
  </v-footer>
</template>
