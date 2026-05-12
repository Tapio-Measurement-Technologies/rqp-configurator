import type { SectionConfig } from '../../types'
import { BASE_SECTIONS } from './base'

const { START_Y_AXIS_AT_ZERO: _startYAxisAtZero, ...systemItems } = BASE_SECTIONS.SYSTEM.items

export const SECTIONS: Record<string, SectionConfig> = {
  ...BASE_SECTIONS,
  SYSTEM: {
    ...BASE_SECTIONS.SYSTEM,
    items: systemItems
  }
}
