import { SECTIONS } from './config/settings'

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
  defaultExpanded?: boolean;
}

function createConfigItems(items: Record<string, BaseConfigItem>): ConfigItem[] {
  return Object.values(items).map(item => ({
    ...item,
    value: ''
  }))
}

function createAlertItems(items: Record<string, BaseConfigItem>): AlertLimitItem[] {
  return Object.values(items).map(item => ({
    ...item,
    minValue: '',
    maxValue: ''
  }))
}

function groupItemsBySection(): ConfigSection[] {
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