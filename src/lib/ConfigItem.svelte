<script lang="ts">
  import type { ConfigItem, ConfigValidation, SelectValidation } from '../types'
  import { UI_CONFIG } from '../config/settings'

  export let item: ConfigItem

  function validateInput(value: string): boolean {
    if (!value.trim()) {
      error = ''
      return true
    }

    // Allow only numbers, decimal point, and backspace
    if (!/^-?\d*\.?\d*$/.test(value)) {
      return false
    }

    const validation = item.validation as ConfigValidation
    const num = validation.type === 'integer'
      ? parseInt(value)
      : parseFloat(value)

    if (isNaN(num)) {
      error = `Must be a ${validation.type} number`
      return false
    }

    if (validation.min !== undefined && num < validation.min) {
      error = `Minimum value is ${validation.min}`
      return false
    }

    if (validation.max !== undefined && num > validation.max) {
      error = `Maximum value is ${validation.max}`
      return false
    }

    error = ''
    return true
  }

  function formatPlaceholder(): string {
    const validation = item.validation as ConfigValidation
    if (validation.type === 'integer') {
      return 'Enter number'
    }
    return validation.min !== undefined && validation.max !== undefined
      ? `${validation.min}...${validation.max}`
      : 'Enter decimal'
  }

  let error = ''

  function handleInput(event: Event) {
    const input = event.target as HTMLInputElement
    const isValid = validateInput(input.value)
    if (isValid) {
      item.value = input.value
    }
  }

  function isNumberValidation(validation: ConfigValidation | SelectValidation): validation is ConfigValidation {
    return validation.type === 'integer' || validation.type === 'float';
  }
</script>

<div class="config-item">
  <div class="config-info">
    <div class="label-row">
      <label for={item.key} class="config-label">{item.label}</label>
      {#if UI_CONFIG.SHOW_CONFIG_KEYS}
        <span class="config-key">{item.key}</span>
      {/if}
    </div>
    <span class="config-description">{item.description}</span>
    {#if error}
      <span class="error-message">{error}</span>
    {/if}
  </div>
  <div class="value-input">
    <input
      type="text"
      inputmode="decimal"
      pattern={item.validation.type === 'integer' ? '[0-9]*' : '[0-9]*[.]?[0-9]*'}
      id={item.key}
      value={item.value}
      on:input={handleInput}
      placeholder={formatPlaceholder()}
      aria-label={`Value for ${item.label}`}
    />
    <span class="unit">{item.unit || '\u00A0'}</span>
  </div>
</div>

<style>
  .config-item {
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    gap: 1.5rem;
    align-items: center;
    padding: 0.75rem;
    background-color: #f8fafc;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
  }

  .config-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .label-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .config-label {
    font-size: 1rem;
    font-weight: 600;
    color: #1a1a1a;
  }

  .config-key {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.8rem;
    color: #64748b;
    padding: 0.2rem 0.4rem;
    background-color: #f1f5f9;
    border-radius: 4px;
    border: 1px solid #e2e8f0;
  }

  .config-description {
    font-size: 0.85rem;
    color: #64748b;
    line-height: 1.3;
  }

  .error-message {
    font-size: 0.85rem;
    color: #dc2626;
    font-weight: 500;
  }

  .value-input {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
  }

  input[type="text"] {
    width: 100%;
    padding: 0.5rem 0.75rem;
    font-size: 0.95rem;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    text-align: right;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    background-color: white;
    color: #1a1a1a;
    transition: all 0.2s ease;
  }

  input[type="text"]:hover {
    border-color: #cbd5e1;
  }

  input[type="text"]:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }

  .unit {
    color: #64748b;
    font-size: 0.9rem;
    font-weight: 500;
    width: 2rem;
    text-align: left;
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    .config-item {
      grid-template-columns: 1fr;
      gap: 0.75rem;
    }

    input[type="text"] {
      width: 100%;
    }
  }
</style>