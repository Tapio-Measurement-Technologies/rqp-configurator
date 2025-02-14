export type ConfigValueType = 'integer' | 'float' | 'select' | 'toggle'

export interface BaseConfigItem {
  key: string;
  label: string;
  description: string;
  unit: string;
  validation: ConfigValidation | SelectValidation | ToggleValidation;
  advanced?: boolean;
  defaultValue?: string;
}

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

export interface SectionConfig {
  id: string;
  title: string;
  type?: 'alert_limits';
  defaultExpanded?: boolean;
  items: Record<string, BaseConfigItem>;
}