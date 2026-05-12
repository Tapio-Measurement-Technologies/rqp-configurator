import type { SectionConfig } from '../types'
import { DEFAULT_FIRMWARE_VERSION, type FirmwareVersion } from './firmwareVersions'
import { SECTIONS as v1_1_3 } from './sections/v1_1_3'
import { SECTIONS as v1_1_2 } from './sections/v1_1_2'
import { SECTIONS as v1_1_1 } from './sections/v1_1_1'
import { SECTIONS as v1_1_0 } from './sections/v1_1_0'
import { SECTIONS as other } from './sections/other'

export const SECTIONS_BY_VERSION: Record<FirmwareVersion, Record<string, SectionConfig>> = {
  'v1.1.3': v1_1_3,
  'v1.1.2': v1_1_2,
  'v1.1.1': v1_1_1,
  'v1.1.0': v1_1_0,
  other
}

export const SECTIONS = SECTIONS_BY_VERSION[DEFAULT_FIRMWARE_VERSION]
