export const FIRMWARE_VERSION_OPTIONS = [
  { label: 'v1.1.3', value: 'v1.1.3' },
  { label: 'v1.1.2', value: 'v1.1.2' },
  { label: 'v1.1.1', value: 'v1.1.1' },
  { label: 'v1.1.0', value: 'v1.1.0' },
  { label: 'Other versions', value: 'other' }
] as const

export type FirmwareVersion = typeof FIRMWARE_VERSION_OPTIONS[number]['value']

export const DEFAULT_FIRMWARE_VERSION: FirmwareVersion = FIRMWARE_VERSION_OPTIONS[0].value

export function isFirmwareVersion(version: string | null): version is FirmwareVersion {
  return FIRMWARE_VERSION_OPTIONS.some(option => option.value === version)
}
