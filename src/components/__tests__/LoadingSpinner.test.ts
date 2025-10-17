// src/components/__tests__/LoadingSpinner.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LoadingSpinner from '../LoadingSpinner.vue'

describe('LoadingSpinner', () => {
  it('renders with default props', () => {
    const wrapper = mount(LoadingSpinner)
    
    expect(wrapper.find('.loading-spinner').exists()).toBe(true)
    expect(wrapper.find('.spinner').exists()).toBe(true)
    expect(wrapper.findAll('.spinner-ring')).toHaveLength(3)
  })

  it('applies correct size classes', () => {
    const smallWrapper = mount(LoadingSpinner, {
      props: { size: 'small' }
    })
    expect(smallWrapper.find('.loading-spinner--small').exists()).toBe(true)

    const largeWrapper = mount(LoadingSpinner, {
      props: { size: 'large' }
    })
    expect(largeWrapper.find('.loading-spinner--large').exists()).toBe(true)

    const mediumWrapper = mount(LoadingSpinner, {
      props: { size: 'medium' }
    })
    expect(mediumWrapper.find('.loading-spinner--medium').exists()).toBe(false) // Default, no class needed
  })

  it('applies correct variant classes', () => {
    const secondaryWrapper = mount(LoadingSpinner, {
      props: { variant: 'secondary' }
    })
    expect(secondaryWrapper.find('.loading-spinner--secondary').exists()).toBe(true)

    const lightWrapper = mount(LoadingSpinner, {
      props: { variant: 'light' }
    })
    expect(lightWrapper.find('.loading-spinner--light').exists()).toBe(true)

    const primaryWrapper = mount(LoadingSpinner, {
      props: { variant: 'primary' }
    })
    expect(primaryWrapper.find('.loading-spinner--primary').exists()).toBe(false) // Default, no class needed
  })

  it('displays custom message when provided', () => {
    const customMessage = 'Loading your activities...'
    const wrapper = mount(LoadingSpinner, {
      props: { message: customMessage }
    })
    
    expect(wrapper.find('.loading-message').text()).toBe(customMessage)
  })

  it('does not display message element when no message provided', () => {
    const wrapper = mount(LoadingSpinner, {
      props: { message: '' }
    })
    
    expect(wrapper.find('.loading-message').exists()).toBe(false)
  })

  it('uses custom aria-label when provided', () => {
    const customAriaLabel = 'Loading content, please wait'
    const wrapper = mount(LoadingSpinner, {
      props: { ariaLabel: customAriaLabel }
    })
    
    const spinnerElement = wrapper.find('.loading-spinner')
    expect(spinnerElement.attributes('aria-label')).toBe(customAriaLabel)
  })

  it('uses default aria-label when not provided', () => {
    const wrapper = mount(LoadingSpinner)
    
    const spinnerElement = wrapper.find('.loading-spinner')
    expect(spinnerElement.attributes('aria-label')).toBe('Loading content')
  })

  it('has proper accessibility attributes', () => {
    const wrapper = mount(LoadingSpinner)
    
    const spinnerElement = wrapper.find('.loading-spinner')
    expect(spinnerElement.attributes('role')).toBe('status')
    expect(spinnerElement.attributes('aria-label')).toBeDefined()
    
    // Check screen reader text
    const srText = wrapper.find('.sr-only')
    expect(srText.exists()).toBe(true)
    expect(srText.text()).toBe('Loading, please wait...')
  })

  it('updates screen reader text based on message prop', () => {
    const customMessage = 'Processing your request'
    const wrapper = mount(LoadingSpinner, {
      props: { message: customMessage }
    })
    
    const srText = wrapper.find('.sr-only')
    expect(srText.text()).toBe(customMessage)
  })

  it('falls back to default screen reader text when no message', () => {
    const wrapper = mount(LoadingSpinner, {
      props: { message: '' }
    })
    
    const srText = wrapper.find('.sr-only')
    expect(srText.text()).toBe('Loading, please wait...')
  })

  it('combines size and variant classes correctly', () => {
    const wrapper = mount(LoadingSpinner, {
      props: { 
        size: 'large',
        variant: 'secondary'
      }
    })
    
    const spinnerElement = wrapper.find('.loading-spinner')
    expect(spinnerElement.classes()).toContain('loading-spinner--large')
    expect(spinnerElement.classes()).toContain('loading-spinner--secondary')
  })

  it('renders all three spinner rings', () => {
    const wrapper = mount(LoadingSpinner)
    
    const rings = wrapper.findAll('.spinner-ring')
    expect(rings).toHaveLength(3)
    
    // Each ring should be a child of the spinner container
    rings.forEach(ring => {
      expect(ring.element.parentElement?.classList).toContain('spinner')
    })
  })

  it('maintains semantic structure', () => {
    const wrapper = mount(LoadingSpinner, {
      props: { message: 'Loading...' }
    })
    
    // Check the component structure
    const spinner = wrapper.find('.loading-spinner')
    expect(spinner.find('.spinner').exists()).toBe(true)
    expect(spinner.find('.loading-message').exists()).toBe(true)
    expect(spinner.find('.sr-only').exists()).toBe(true)
  })
})