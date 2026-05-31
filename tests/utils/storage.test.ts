import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getStoredItem, setStoredItem, removeStoredItem } from '~/utils/storage'

describe('storage utilities', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('setStoredItem', () => {
    it('stores a serialized value in localStorage', () => {
      setStoredItem('test_key', { name: 'John' })
      expect(localStorage.getItem('test_key')).toBe('{"name":"John"}')
    })

    it('stores arrays', () => {
      setStoredItem('arr', [1, 2, 3])
      expect(localStorage.getItem('arr')).toBe('[1,2,3]')
    })

    it('stores primitive values', () => {
      setStoredItem('num', 42)
      expect(localStorage.getItem('num')).toBe('42')
    })
  })

  describe('getStoredItem', () => {
    it('retrieves and parses a stored value', () => {
      localStorage.setItem('test_key', '{"name":"Jane"}')
      expect(getStoredItem('test_key')).toEqual({ name: 'Jane' })
    })

    it('returns null for non-existent key', () => {
      expect(getStoredItem('missing')).toBeNull()
    })

    it('returns null for invalid JSON', () => {
      localStorage.setItem('bad', '{invalid}')
      expect(getStoredItem('bad')).toBeNull()
    })
  })

  describe('removeStoredItem', () => {
    it('removes item from localStorage', () => {
      localStorage.setItem('to_remove', '"value"')
      removeStoredItem('to_remove')
      expect(localStorage.getItem('to_remove')).toBeNull()
    })

    it('does not throw for non-existent key', () => {
      expect(() => removeStoredItem('nope')).not.toThrow()
    })
  })
})
