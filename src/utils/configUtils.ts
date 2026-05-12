import type { BaseConfigItem, ConfigSection } from '../types'
import { SECTIONS_BY_VERSION } from '../config/sections'
import { DEFAULT_FIRMWARE_VERSION, type FirmwareVersion } from '../config/firmwareVersions'

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

export function groupItemsBySection(version: FirmwareVersion = DEFAULT_FIRMWARE_VERSION): ConfigSection[] {
  return Object.entries(SECTIONS_BY_VERSION[version]).map(([_, section]) => ({
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
