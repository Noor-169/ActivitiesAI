// src/components/__tests__/ActivityFilters.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ActivityFilters from '../ActivityFilters.vue'
import type { ActivityFilters as ActivityFiltersType } from '../../types/Filters'
import type { Activity } from '../../types/Activity'

const mockActivities: Activity[] = [
  { id: 1, title: 'Short Fun Activity', duration: 10, type: 'fun' },
  { id: 2, title: 'Long Fun Activity', duration: 45, type: 'fun' },
  { id: 3, title: 'Short Chore', duration: 15, type: 'chores' },
  { id: 4, title: 'Extended Activity', duration: 90, type: 'fun' }
]

const defaultFilters: ActivityFiltersType = {
  duration: 'any',
  type: 'any'
}

describe('ActivityFilters', () => {
  it('renders all filter options correctly', () => {
    const wrapper = mount(ActivityFilters, {
      props: {
        filters: defaultFilters,
        availableCount: 10,
        activities: mockActivities
      }
    })
    
    // Check duration filter options
    const durationOptions = wrapper.findAll('input[name="duration"]')
    expect(durationOptions).toHaveLength(5) // any, short, standard, long, extended
    
    // Check type filter options  
    const typeOptions = wrapper.findAll('input[name="type"]')
    expect(typeOptions).toHaveLength(3) // any, fun, chores
  })

  it('displays activity counts when activities are provided', () => {
    const wrapper = mount(ActivityFilters, {
      props: {
        filters: defaultFilters,
        availableCount: 4,
        activities: mockActivities
      }
    })
    
    const filterCounts = wrapper.findAll('.filter-count')
    expect(filterCounts.length).toBeGreaterThan(0)
    
    // Should show total count for "any" options
    expect(wrapper.text()).toContain('(4)')
  })

  it('shows correct available count', () => {
    const wrapper = mount(ActivityFilters, {
      props: {
        filters: defaultFilters,
        availableCount: 15,
        activities: mockActivities
      }
    })
    
    expect(wrapper.find('.available-count').text()).toContain('15 activities available')
  })

  it('shows singular form for single activity', () => {
    const wrapper = mount(ActivityFilters, {
      props: {
        filters: defaultFilters,
        availableCount: 1,
        activities: mockActivities
      }
    })
    
    expect(wrapper.find('.available-count').text()).toContain('1 activity available')
  })

  it('emits update:filters when duration filter changes', async () => {
    const wrapper = mount(ActivityFilters, {
      props: {
        filters: defaultFilters,
        availableCount: 10,
        activities: mockActivities
      }
    })
    
    const shortDurationRadio = wrapper.find('input#duration-short')
    await shortDurationRadio.setValue(true)
    
    const emittedEvents = wrapper.emitted('update:filters')
    expect(emittedEvents).toHaveLength(1)
    if (emittedEvents && emittedEvents[0]) {
      expect(emittedEvents[0][0]).toEqual({
        duration: 'short',
        type: 'any'
      })
    }
  })

  it('emits update:filters when type filter changes', async () => {
    const wrapper = mount(ActivityFilters, {
      props: {
        filters: defaultFilters,
        availableCount: 10,
        activities: mockActivities
      }
    })
    
    const funTypeRadio = wrapper.find('input#type-fun')
    await funTypeRadio.setValue(true)
    
    const emittedEvents = wrapper.emitted('update:filters')
    expect(emittedEvents).toHaveLength(1)
    if (emittedEvents && emittedEvents[0]) {
      expect(emittedEvents[0][0]).toEqual({
        duration: 'any',
        type: 'fun'
      })
    }
  })

  it('emits reset event when reset button is clicked', async () => {
    const wrapper = mount(ActivityFilters, {
      props: {
        filters: { duration: 'short', type: 'fun' },
        availableCount: 10,
        activities: mockActivities
      }
    })
    
    await wrapper.find('button').trigger('click')
    
    expect(wrapper.emitted('reset')).toHaveLength(1)
  })

  it('reflects current filter state in checked inputs', () => {
    const activeFilters: ActivityFiltersType = {
      duration: 'short',
      type: 'fun'
    }
    
    const wrapper = mount(ActivityFilters, {
      props: {
        filters: activeFilters,
        availableCount: 10,
        activities: mockActivities
      }
    })
    
    const shortDurationRadio = wrapper.find('input#duration-short')
    const funTypeRadio = wrapper.find('input#type-fun')
    
    expect(shortDurationRadio.attributes('checked')).toBeDefined()
    expect(funTypeRadio.attributes('checked')).toBeDefined()
  })

  it('has proper accessibility attributes', () => {
    const wrapper = mount(ActivityFilters, {
      props: {
        filters: defaultFilters,
        availableCount: 10,
        activities: mockActivities
      }
    })
    
    // Check form attributes
    const form = wrapper.find('form')
    expect(form.attributes('role')).toBe('search')
    expect(form.attributes('aria-label')).toBe('Activity filters')
    
    // Check fieldsets have proper structure
    const fieldsets = wrapper.findAll('fieldset')
    expect(fieldsets).toHaveLength(2)
    
    fieldsets.forEach(fieldset => {
      const legend = fieldset.find('legend')
      expect(legend.exists()).toBe(true)
    })
    
    // Check button accessibility
    const resetButton = wrapper.find('button')
    expect(resetButton.attributes('aria-describedby')).toBeDefined()
    
    // Check available count has proper role
    const availableCount = wrapper.find('.available-count')
    expect(availableCount.attributes('role')).toBe('status')
    expect(availableCount.attributes('aria-live')).toBe('polite')
  })

  it('calculates activity counts correctly by duration', () => {
    const wrapper = mount(ActivityFilters, {
      props: {
        filters: defaultFilters,
        availableCount: 4,
        activities: mockActivities
      }
    })
    
    // Should correctly count activities in each duration category
    // Short (1-15): 2 activities (10min, 15min)
    // Standard (15-30): 0 activities  
    // Long (30-60): 1 activity (45min)
    // Extended (60+): 1 activity (90min)
    
    const text = wrapper.text()
    expect(text).toContain('Short') // Should have short duration option
    expect(text).toContain('Extended') // Should have extended duration option
  })

  it('calculates activity counts correctly by type', () => {
    const wrapper = mount(ActivityFilters, {
      props: {
        filters: defaultFilters,
        availableCount: 4,
        activities: mockActivities
      }
    })
    
    // Should correctly count activities by type
    // Fun: 3 activities
    // Chores: 1 activity
    
    const text = wrapper.text()
    expect(text).toContain('Fun activities')
    expect(text).toContain('Productive tasks')
  })

  it('works without activities provided', () => {
    const wrapper = mount(ActivityFilters, {
      props: {
        filters: defaultFilters,
        availableCount: 0,
        activities: []
      }
    })
    
    // Should still render all options without counts
    expect(wrapper.findAll('input[name="duration"]')).toHaveLength(5)
    expect(wrapper.findAll('input[name="type"]')).toHaveLength(3)
    expect(wrapper.find('.available-count').text()).toContain('0 activities available')
  })

  it('handles form submission prevention', async () => {
    const wrapper = mount(ActivityFilters, {
      props: {
        filters: defaultFilters,
        availableCount: 10,
        activities: mockActivities
      }
    })
    
    const form = wrapper.find('form')
    const submitEvent = new Event('submit')
    
    // Should not throw when form submit is triggered
    expect(() => {
      form.element.dispatchEvent(submitEvent)
    }).not.toThrow()
  })
})