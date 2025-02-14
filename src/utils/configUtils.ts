import type { BaseConfigItem, ConfigSection } from '../types'
import { SECTIONS } from '../config/sections'

export function createConfigItems(items: Record<string, BaseConfigItem>) {
  return Object.values(items).map(item => ({
    ...item,
    value: item.defaultValue ?? ''
  }))
}

export function createAlertItems(items: Record<string, BaseConfigItem>) {
  return Object.values(items).map(item => ({
    ...item,
    minValue: '',
    maxValue: ''
  }))
}

export function groupItemsBySection(): ConfigSection[] {
  return Object.entries(SECTIONS).map(([_, section]) => ({
    id: section.id,
    title: section.title,
    type: section.type,
    defaultExpanded: section.defaultExpanded,
    items: section.type === 'alert_limits'
      ? createAlertItems(section.items)
      : createConfigItems(section.items)
  }))
}

export const defaultConfigs: ConfigSection[] = groupItemsBySection()