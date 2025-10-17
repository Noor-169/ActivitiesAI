import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../App.vue'

// Mock fetch to prevent actual network calls
global.fetch = vi.fn(() => 
  Promise.resolve({
    ok: false,
    status: 404,
    json: () => Promise.resolve({}),
  } as Response)
)

describe('App', () => {
  it('renders the application header correctly', () => {
    const wrapper = mount(App)
    
    expect(wrapper.text()).toContain('ActivityAI')
    expect(wrapper.text()).toContain('Discover your next activity based on time and mood')
  })

  it('has proper semantic structure', () => {
    const wrapper = mount(App)
    
    // Check for proper semantic HTML elements
    expect(wrapper.find('header[role="banner"]').exists()).toBe(true)
    expect(wrapper.find('main[role="main"]').exists()).toBe(true)
    expect(wrapper.find('#main-content').exists()).toBe(true)
  })

  it('includes skip link for accessibility', () => {
    const wrapper = mount(App)
    
    const skipLink = wrapper.find('a.skip-link')
    expect(skipLink.exists()).toBe(true)
    expect(skipLink.attributes('href')).toBe('#main-content')
    expect(skipLink.text()).toContain('Skip to main content')
  })

  it('renders footer with correct information', () => {
    const wrapper = mount(App)
    
    const footer = wrapper.find('footer.app-footer')
    expect(footer.exists()).toBe(true)
    expect(footer.text()).toContain('2025 ActivityAI')
    expect(footer.text()).toContain('Vue 3 + TypeScript')
  })

  it('has proper CSS classes for styling', () => {
    const wrapper = mount(App)
    
    expect(wrapper.find('.app').exists()).toBe(true)
    expect(wrapper.find('.app-header').exists()).toBe(true)
    expect(wrapper.find('.app-main').exists()).toBe(true)
    expect(wrapper.find('.app-footer').exists()).toBe(true)
  })

  it('renders main application sections', async () => {
    const wrapper = mount(App)
    
    // Wait a bit for async operations to complete
    await wrapper.vm.$nextTick()
    
    // Check for main content areas - use more generic checks
    expect(wrapper.find('main').exists()).toBe(true)
    expect(wrapper.findAll('section').length).toBeGreaterThan(0)
    
    // Check that some buttons exist (activity and filter related)
    const buttons = wrapper.findAll('button')
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('contains essential app text content', async () => {
    const wrapper = mount(App)
    
    // Wait for component to fully mount
    await wrapper.vm.$nextTick()
    
    const text = wrapper.text()
    
    // Check for essential text that should always be present
    expect(text).toContain('ActivityAI')
    
    // Check for filter-related content
    expect(text).toContain('Duration') 
    expect(text).toContain('Activity Type')
    
    // These should be present from the filter options
    expect(text).toContain('Any duration')
    expect(text).toContain('Fun activities')
  })
})
