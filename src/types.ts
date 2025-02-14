import { SYSTEM_CONFIG, ALERT_LIMITS, BASIC_CONFIG, SECTIONS } from './config/settings'
import type { ConfigValueType, SectionType } from './config/settings'

export interface ConfigValidation {
  type: 'integer' | 'float';
  min?: number;
  max?: number;
}

export interface SelectValidation {
  type: 'select';
  options: { label: string; value: number | string }[];
}

export interface ToggleValidation {
  type: 'toggle';
  offLabel?: string;
  onLabel?: string;
}

interface BaseConfigItem {
  key: string;
  label: string;
  description: string;
  unit?: string;
  section: SectionType;
  validation: ConfigValidation | SelectValidation | ToggleValidation;
  advanced?: boolean;
}

export interface ConfigItem extends BaseConfigItem {
  value: string;
}

export interface SelectConfigItem extends BaseConfigItem {
  value: string;
  validation: SelectValidation;
}

export interface AlertLimitItem extends BaseConfigItem {
  minValue: string;
  maxValue: string;
}

export interface ConfigSection {
  id: string;
  title: string;
  items: ConfigItem[] | AlertLimitItem[];
  type?: 'alert_limits';
}

function createConfigItems(configs: Record<string, any>): ConfigItem[] {
  return Object.values(configs).map(config => ({
    ...config,
    value: ''
  }))
}

function createAlertItems(configs: Record<string, any>): AlertLimitItem[] {
  return Object.values(configs).map(config => ({
    ...config,
    minValue: '',
    maxValue: ''
  }))
}

function groupItemsBySection(items: (ConfigItem | AlertLimitItem)[]): ConfigSection[] {
  const sections = new Map<SectionType, (ConfigItem | AlertLimitItem)[]>()

  items.forEach(item => {
    const section = sections.get(item.section) || []
    section.push(item)
    sections.set(item.section, section)
  })

  const result: ConfigSection[] = []

  // Add basic section if it has items
  const basicItems = sections.get(SECTIONS.BASIC)
  if (basicItems) {
    result.push({
      id: SECTIONS.BASIC,
      title: 'Basic Settings',
      items: basicItems as ConfigItem[]
    })
  }

  // Add alerts section if it has items
  const alertItems = sections.get(SECTIONS.ALERTS)
  if (alertItems) {
    result.push({
      id: SECTIONS.ALERTS,
      title: 'Alert Limits',
      type: 'alert_limits',
      items: alertItems as AlertLimitItem[]
    })
  }

  // Add system section if it has items
  const systemItems = sections.get(SECTIONS.SYSTEM)
  if (systemItems) {
    result.push({
      id: SECTIONS.SYSTEM,
      title: 'System Configuration',
      items: systemItems as ConfigItem[]
    })
  }

  // Add unassigned section if it has items
  const unassignedItems = sections.get(SECTIONS.UNASSIGNED)
  if (unassignedItems) {
    const configItems = unassignedItems.filter((item): item is ConfigItem => 'value' in item)
    const alertItems = unassignedItems.filter((item): item is AlertLimitItem => 'minValue' in item)

    if (configItems.length > 0) {
      result.push({
        id: `${SECTIONS.UNASSIGNED}_config`,
        title: 'Other Configuration',
        items: configItems
      })
    }

    if (alertItems.length > 0) {
      result.push({
        id: `${SECTIONS.UNASSIGNED}_alerts`,
        title: 'Other Alert Limits',
        type: 'alert_limits',
        items: alertItems
      })
    }
  }

  return result
}

// Combine all config items
const allConfigItems = [
  ...createConfigItems(BASIC_CONFIG),
  ...createConfigItems(SYSTEM_CONFIG),
  ...createAlertItems(ALERT_LIMITS)
]

export const defaultConfigs: ConfigSection[] = groupItemsBySection(allConfigItems)