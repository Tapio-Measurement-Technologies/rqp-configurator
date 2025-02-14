import { writable, derived } from 'svelte/store'
import type { ConfigItem, AlertLimitItem, ConfigSection } from '../types'
import { defaultConfigs } from '../utils/configUtils'
import { UI_CONFIG } from '../config/settings'

const STORAGE_KEY = 'rqp-configurator-state'

// Load initial state from localStorage or use default
const loadInitialState = () => {
  if (typeof window === 'undefined' || !UI_CONFIG.PERSIST_STATE) return defaultConfigs

  const savedState = window.localStorage.getItem(STORAGE_KEY)
  if (!savedState) return defaultConfigs

  try {
    const parsedState = JSON.parse(savedState)
    return parsedState
  } catch (error) {
    console.error('Error loading saved state:', error)
    return defaultConfigs
  }
}

function createConfigStore() {
  const { subscribe, set, update } = writable<ConfigSection[]>(loadInitialState())

  // Save to localStorage whenever the store changes
  subscribe(state => {
    if (typeof window !== 'undefined' && UI_CONFIG.PERSIST_STATE) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    }
  })

  return {
    subscribe,
    clearAllValues: () => update((sections: ConfigSection[]) =>
      sections.map(section => {
        if (section.type === 'alert_limits') {
          return {
            ...section,
            items: section.items.map(item => ({ ...item as AlertLimitItem, minValue: '', maxValue: '' }))
          }
        }
        return {
          ...section,
          items: section.items.map(item => ({ ...item as ConfigItem, value: '' }))
        }
      })
    ),
    resetAdvancedValues: () => update((sections: ConfigSection[]) =>
      sections.map(section => {
        if (section.type === 'alert_limits') {
          return {
            ...section,
            items: (section.items as AlertLimitItem[]).map(item =>
              item.advanced ? { ...item, minValue: '', maxValue: '' } : item
            )
          }
        }
        return {
          ...section,
          items: (section.items as ConfigItem[]).map(item =>
            item.advanced ? { ...item, value: '' } : item
          )
        }
      }) as ConfigSection[]
    ),
    updateVisibleSectionValues: (visibleSections: ConfigSection[]) => update((sections: ConfigSection[]) => {
      visibleSections.forEach(visibleSection => {
        const originalSection = sections.find((s: ConfigSection) => s.id === visibleSection.id)
        if (originalSection) {
          visibleSection.items.forEach(item => {
            const originalItem = originalSection.items.find((i: ConfigItem | AlertLimitItem) =>
              'key' in item && 'key' in i && item.key === i.key
            )
            if (originalItem) {
              if ('value' in item && 'value' in originalItem) {
                originalItem.value = item.value
              } else if ('minValue' in item && 'minValue' in originalItem) {
                originalItem.minValue = item.minValue
                originalItem.maxValue = item.maxValue
              }
            }
          })
        }
      })
      return sections
    }),
    resetToDefault: () => {
      if (typeof window !== 'undefined' && UI_CONFIG.PERSIST_STATE) {
        window.localStorage.removeItem(STORAGE_KEY)
      }
      set(defaultConfigs)
    }
  }
}

export const configStore = createConfigStore()

// Create a store for the showAdvanced state with localStorage persistence
const loadShowAdvanced = () => {
  if (typeof window === 'undefined' || !UI_CONFIG.PERSIST_STATE) return false
  return window.localStorage.getItem('showAdvanced') === 'true'
}

export const showAdvancedStore = writable(loadShowAdvanced())

// Save showAdvanced state to localStorage
showAdvancedStore.subscribe(value => {
  if (typeof window !== 'undefined' && UI_CONFIG.PERSIST_STATE) {
    window.localStorage.setItem('showAdvanced', value.toString())
  }
})

// Create a derived store that depends on both configStore and showAdvancedStore
export const visibleSections = derived(
  [configStore, showAdvancedStore],
  ([$configStore, $showAdvanced]) => {
    return $configStore.map(section => {
      const filteredItems = section.type === 'alert_limits'
        ? (section.items as AlertLimitItem[]).filter(item => $showAdvanced || !item.advanced)
        : (section.items as ConfigItem[]).filter(item => $showAdvanced || !item.advanced)

      return {
        ...section,
        items: filteredItems
      }
    }).filter(section => section.items.length > 0)
  }
)