import { writable, derived } from 'svelte/store'
import type { ConfigItem, AlertLimitItem, ConfigSection } from '../types'
import { defaultConfigs } from '../types'

function createConfigStore() {
  const { subscribe, set, update } = writable(defaultConfigs)

  return {
    subscribe,
    clearAllValues: () => update(sections =>
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
    resetAdvancedValues: () => update(sections =>
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
    updateVisibleSectionValues: (visibleSections: ConfigSection[]) => update(sections => {
      visibleSections.forEach(visibleSection => {
        const originalSection = sections.find(s => s.id === visibleSection.id)
        if (originalSection) {
          visibleSection.items.forEach(item => {
            const originalItem = originalSection.items.find(i =>
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
    })
  }
}

export const configStore = createConfigStore()

// Create a store for the showAdvanced state
export const showAdvancedStore = writable(false)

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