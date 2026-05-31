import { describe, it, expect } from 'vitest'
import { formatPrice, formatFileSize, slugify } from '~/utils/format'

describe('formatPrice', () => {
  it('formats a number as USD with two decimals', () => {
    expect(formatPrice(2.49)).toBe('$2.49')
  })

  it('formats zero correctly', () => {
    expect(formatPrice(0)).toBe('$0.00')
  })

  it('rounds to two decimal places', () => {
    expect(formatPrice(9.999)).toBe('$10.00')
  })

  it('handles large numbers', () => {
    expect(formatPrice(1234.5)).toBe('$1234.50')
  })
})

describe('formatFileSize', () => {
  it('formats bytes', () => {
    expect(formatFileSize(500)).toBe('500 B')
  })

  it('formats kilobytes', () => {
    expect(formatFileSize(2048)).toBe('2.0 KB')
  })

  it('formats megabytes', () => {
    expect(formatFileSize(5 * 1024 * 1024)).toBe('5.0 MB')
  })

  it('handles boundary at 1024', () => {
    expect(formatFileSize(1024)).toBe('1.0 KB')
  })

  it('handles boundary at 1MB', () => {
    expect(formatFileSize(1024 * 1024)).toBe('1.0 MB')
  })
})

describe('slugify', () => {
  it('converts text to lowercase slug', () => {
    expect(slugify('Hello World')).toBe('hello-world')
  })

  it('removes special characters', () => {
    expect(slugify('WPBakery Page Builder for WordPress')).toBe('wpbakery-page-builder-for-wordpress')
  })

  it('trims leading and trailing dashes', () => {
    expect(slugify('--hello--')).toBe('hello')
  })

  it('collapses multiple separators', () => {
    expect(slugify('foo   bar   baz')).toBe('foo-bar-baz')
  })

  it('handles empty string', () => {
    expect(slugify('')).toBe('')
  })

  it('handles special chars like ampersand', () => {
    expect(slugify('Drag & Drop Interface')).toBe('drag-drop-interface')
  })
})
