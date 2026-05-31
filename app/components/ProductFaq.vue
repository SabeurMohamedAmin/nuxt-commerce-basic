<script setup lang="ts">
const faqs = [
  {
    question: 'What is the best page builder plugin for WordPress?',
    answer: 'This depends on your needs, but our marketplace offers the most popular and highly-rated page builders available, all at an affordable price.',
  },
  {
    question: 'How do I create a custom layout without coding?',
    answer: 'Most of our template kits and page builders include drag-and-drop interfaces that let you create custom layouts visually without writing any code.',
  },
  {
    question: 'Is a premium page builder worth it compared to free alternatives?',
    answer: 'Premium page builders offer more features, better support, regular updates, and professional-grade design options that free alternatives typically lack.',
  },
]
</script>

<template>
  <v-card flat variant="outlined" rounded="lg" class="pa-6">
    <h2 class="text-h6 font-weight-bold mb-4">Frequently Asked Questions</h2>
    <v-expansion-panels variant="accordion" flat>
      <v-expansion-panel v-for="faq in faqs" :key="faq.question">
        <v-expansion-panel-title class="text-body-2 font-weight-medium">
          {{ faq.question }}
        </v-expansion-panel-title>
        <v-expansion-panel-text class="text-body-2 text-grey-darken-1">
          {{ faq.answer }}
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-card>
</template>

<style scoped></style>
