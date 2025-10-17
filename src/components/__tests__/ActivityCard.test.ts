// src/components/__tests__/ActivityCard.test.ts
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ActivityCard from '../ActivityCard.vue'
import type { Activity } from '../../types/Activity'

// Mock the formatters module
vi.mock('../../utils/formatters', () => ({
  formatDuration: (duration: number) => `${duration} min`,
  formatActivityType: (type: string) => type === 'chores' ? 'Productive Task' : 'Fun Activity'
}))

const mockActivity: Activity = {
  id: 1,
  title: 'Test Activity',
  duration: 20,
  type: 'fun',
  description: 'This is a test activity',
  difficulty: 'medium',
  materials: ['test material']
}

describe('ActivityCard', () => {
  it('renders welcome message when no activity is provided', () => {
    const wrapper = mount(ActivityCard, {
      props: {}
    })
    
    expect(wrapper.find('.welcome-message').text()).toContain('Click "Get Activity" to discover something to do!')
  })

  it('renders activity details when activity is provided', () => {
    const wrapper = mount(ActivityCard, {
      props: {
        activity: mockActivity
      }
    })
    
    expect(wrapper.find('.activity-title').text()).toBe('Test Activity')
    expect(wrapper.find('.activity-description').text()).toBe('This is a test activity')
    expect(wrapper.find('.activity-badge--duration').text()).toBe('20 min')
    expect(wrapper.find('.activity-badge--type').text()).toBe('Fun Activity')
  })

  it('renders loading state correctly', () => {
    const wrapper = mount(ActivityCard, {
      props: {
        isLoading: true
      }
    })
    
    expect(wrapper.find('.loading-message').exists()).toBe(true)
    expect(wrapper.find('button').text()).toBe('Loading...')
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })

  it('renders error state correctly', () => {
    const errorMessage = 'Test error message'
    const wrapper = mount(ActivityCard, {
      props: {
        error: errorMessage
      }
    })
    
    expect(wrapper.find('.error-message').text()).toBe(errorMessage)
  })

  it('emits get-activity event when button is clicked', async () => {
    const wrapper = mount(ActivityCard, {
      props: {}
    })
    
    await wrapper.find('button').trigger('click')
    
    expect(wrapper.emitted('get-activity')).toHaveLength(1)
  })

  it('does not emit event when button is disabled (loading)', async () => {
    const wrapper = mount(ActivityCard, {
      props: {
        isLoading: true
      }
    })
    
    await wrapper.find('button').trigger('click')
    
    expect(wrapper.emitted('get-activity')).toBeFalsy()
  })

  it('displays materials list when provided', () => {
    const wrapper = mount(ActivityCard, {
      props: {
        activity: mockActivity
      }
    })
    
    const materialsSection = wrapper.find('.activity-materials')
    expect(materialsSection.exists()).toBe(true)
    expect(materialsSection.text()).toContain('Materials needed:')
    expect(materialsSection.text()).toContain('test material')
  })

  it('displays difficulty badge when provided', () => {
    const wrapper = mount(ActivityCard, {
      props: {
        activity: mockActivity
      }
    })
    
    const difficultyBadge = wrapper.find('.activity-badge--difficulty')
    expect(difficultyBadge.exists()).toBe(true)
    expect(difficultyBadge.text()).toBe('Medium')
  })

  it('does not display optional elements when not provided', () => {
    const minimalActivity: Activity = {
      id: 1,
      title: 'Minimal Activity',
      duration: 10,
      type: 'fun'
    }
    
    const wrapper = mount(ActivityCard, {
      props: {
        activity: minimalActivity
      }
    })
    
    expect(wrapper.find('.activity-description').exists()).toBe(false)
    expect(wrapper.find('.activity-materials').exists()).toBe(false)
    expect(wrapper.find('.activity-badge--difficulty').exists()).toBe(false)
  })

  it('has proper accessibility attributes', () => {
    const wrapper = mount(ActivityCard, {
      props: {
        activity: mockActivity
      }
    })
    
    const activityCard = wrapper.find('.activity-card')
    expect(activityCard.attributes('role')).toBe('region')
    expect(activityCard.attributes('aria-live')).toBe('polite')
    expect(activityCard.attributes('aria-label')).toContain('Current activity')
    
    const button = wrapper.find('button')
    expect(button.attributes('aria-describedby')).toBeDefined()
  })

  it('updates aria-label based on current activity', () => {
    const wrapper = mount(ActivityCard, {
      props: {
        activity: mockActivity
      }
    })
    
    const activityCard = wrapper.find('.activity-card')
    const ariaLabel = activityCard.attributes('aria-label')
    expect(ariaLabel).toContain('Test Activity')
    expect(ariaLabel).toContain('20 min')
    expect(ariaLabel).toContain('Fun Activity')
  })
})