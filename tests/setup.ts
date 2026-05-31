import { ref, computed, reactive, readonly, watch } from 'vue'
import { vi } from 'vitest'

// Mock Vue auto-imports that Nuxt provides
globalThis.ref = ref
globalThis.computed = computed
globalThis.reactive = reactive
globalThis.readonly = readonly
globalThis.watch = watch
globalThis.onMounted = vi.fn()
globalThis.navigateTo = vi.fn()
globalThis.useRoute = vi.fn(() => ({ query: {}, params: {} }))
globalThis.useHead = vi.fn()
globalThis.definePageMeta = vi.fn()
globalThis.useRuntimeConfig = vi.fn(() => ({
  public: { stripePublicKey: '', baseUrl: 'http://localhost:3000' },
  stripeSecretKey: '',
}))
globalThis.$fetch = vi.fn()

// Mock import.meta.client / import.meta.server for Nuxt
// In test environment, treat as client
Object.defineProperty(import.meta, 'client', { value: true })
Object.defineProperty(import.meta, 'server', { value: false })
