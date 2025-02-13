<script lang="ts">
  import type { AlertLimitItem } from '../types'
  import { UI_CONFIG } from '../config/settings'

  export let item: AlertLimitItem
  let minError = ''
  let maxError = ''
  let rememberedMinValue = ''
  let rememberedMaxValue = ''

  function validateInput(value: string, isMin: boolean): boolean {
    if (!value.trim()) {
      if (isMin) minError = ''
      else maxError = ''
      return true
    }

    // Allow only numbers, decimal point, and backspace
    if (!/^-?\d*\.?\d*$/.test(value)) {
      if (isMin) minError = 'Invalid number format'
      else maxError = 'Invalid number format'
      return false
    }

    const num = item.validation.type === 'integer'
      ? parseInt(value)
      : parseFloat(value)

    if (isNaN(num)) {
      const error = `Must be a ${item.validation.type} number`
      if (isMin) minError = error
      else maxError = error
      return false
    }

    if ('min' in item.validation && item.validation.min !== undefined && num < item.validation.min) {
      const error = `Minimum value is ${item.validation.min}`
      if (isMin) minError = error
      else maxError = error
      return false
    }

    if ('max' in item.validation && item.validation.max !== undefined && num > item.validation.max) {
      const error = `Maximum value is ${item.validation.max}`
      if (isMin) minError = error
      else maxError = error
      return false
    }

    // Check if min is greater than max
    if (isMin && item.maxValue && item.maxValue !== 'NaN' && num > parseFloat(item.maxValue)) {
      minError = 'Min value cannot be greater than max'
      return false
    }
    if (!isMin && item.minValue && item.minValue !== 'NaN' && num < parseFloat(item.minValue)) {
      maxError = 'Max value cannot be less than min'
      return false
    }

    if (isMin) minError = ''
    else maxError = ''
    return true
  }

  function handleInput(event: Event, isMin: boolean) {
    const input = event.target as HTMLInputElement
    const isValid = validateInput(input.value, isMin)
    if (isValid) {
      if (isMin) {
        item.minValue = input.value
      } else {
        item.maxValue = input.value
      }
    }
  }

  function formatPlaceholder(isMin: boolean): string {
    if (item.validation.type === 'integer') {
      return isMin ? 'Min' : 'Max'
    }
    return isMin ? 'min' : 'max'
  }

  function toggleValue(isMin: boolean) {
    if (isMin) {
      if (item.minValue === 'NaN') {
        item.minValue = rememberedMinValue || ''
      } else {
        rememberedMinValue = item.minValue
        item.minValue = 'NaN'
      }
    } else {
      if (item.maxValue === 'NaN') {
        item.maxValue = rememberedMaxValue || ''
      } else {
        rememberedMaxValue = item.maxValue
        item.maxValue = 'NaN'
      }
    }
  }
</script>

<div class="alert-limit-item">
  <div class="limit-info">
    <div class="label-row">
      <label class="limit-label">{item.label}</label>
      {#if UI_CONFIG.SHOW_CONFIG_KEYS}
        <span class="limit-key">{item.key}</span>
      {/if}
    </div>
    <span class="limit-description">{item.description}</span>
    {#if minError || maxError}
      <div class="error-container">
        {#if minError}<span class="error-message">{minError}</span>{/if}
        {#if maxError}<span class="error-message">{maxError}</span>{/if}
      </div>
    {/if}
  </div>
  <div class="limit-inputs">
    <div class="input-group">
      <div class="input-with-toggle">
        <input
          type="text"
          inputmode="decimal"
          pattern={item.validation.type === 'integer' ? '[0-9]*' : '[0-9]*[.]?[0-9]*'}
          value={item.minValue !== 'NaN' ? item.minValue : ''}
          on:input={(e) => handleInput(e, true)}
          placeholder={formatPlaceholder(true)}
          aria-label={`Minimum value for ${item.label}`}
          disabled={item.minValue === 'NaN'}
        />
        <button
          type="button"
          class="not-set-button"
          class:active={item.minValue === 'NaN'}
          on:click={() => toggleValue(true)}
          title={item.minValue === 'NaN' ? 'Set value' : 'Not set'}
        >
          {item.minValue === 'NaN' ? 'Not set' : '×'}
        </button>
      </div>
      <span class="separator">to</span>
      <div class="input-with-toggle">
        <input
          type="text"
          inputmode="decimal"
          pattern={item.validation.type === 'integer' ? '[0-9]*' : '[0-9]*[.]?[0-9]*'}
          value={item.maxValue !== 'NaN' ? item.maxValue : ''}
          on:input={(e) => handleInput(e, false)}
          placeholder={formatPlaceholder(false)}
          aria-label={`Maximum value for ${item.label}`}
          disabled={item.maxValue === 'NaN'}
        />
        <button
          type="button"
          class="not-set-button"
          class:active={item.maxValue === 'NaN'}
          on:click={() => toggleValue(false)}
          title={item.maxValue === 'NaN' ? 'Set value' : 'Not set'}
        >
          {item.maxValue === 'NaN' ? 'Not set' : '×'}
        </button>
      </div>
      <span class="unit">{item.unit || ' '}</span>
    </div>
  </div>
</div>

<style>
  .alert-limit-item {
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    gap: 1.5rem;
    align-items: center;
    padding: 0.75rem;
    background-color: #f8fafc;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
  }

  .limit-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .label-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .limit-label {
    font-size: 1rem;
    font-weight: 600;
    color: #1a1a1a;
  }

  .limit-key {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.8rem;
    color: #64748b;
    padding: 0.2rem 0.4rem;
    background-color: #f1f5f9;
    border-radius: 4px;
    border: 1px solid #e2e8f0;
  }

  .limit-description {
    font-size: 0.85rem;
    color: #64748b;
    line-height: 1.3;
  }

  .error-container {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .error-message {
    font-size: 0.85rem;
    color: #dc2626;
    font-weight: 500;
  }

  .limit-inputs {
    display: flex;
    align-items: center;
  }

  .input-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
  }

  .input-with-toggle {
    position: relative;
    display: flex;
    align-items: center;
    flex: 1;
  }

  input[type="text"] {
    min-width: 60px;
    width: 100%;
    padding: 0.5rem 2.2rem 0.5rem 0rem;
    font-size: 0.95rem;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    text-align: right;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    background-color: white;
    color: #1a1a1a;
    transition: all 0.2s ease;
  }

  input[type="text"]:hover:not(:disabled) {
    border-color: #cbd5e1;
  }

  input[type="text"]:focus:not(:disabled) {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }

  input[type="text"]:disabled {
    background-color: #f8fafc;
    cursor: not-allowed;
  }

  .not-set-button {
    position: absolute;
    right: 0.5rem;
    padding: 0.2rem 0.4rem;
    font-size: 0.8rem;
    border-radius: 4px;
    border: 1px solid #e2e8f0;
    border-left: none;
    background-color: #f1f5f9;
    color: #64748b;
    cursor: pointer;
    transition: all 0.2s ease;
    min-width: 1rem;
    text-align: center;
    display: flex;
    align-items: center;
  }

  .not-set-button:hover {
    background-color: #e2e8f0;
  }

  .not-set-button.active {
    background-color: #64748b;
    color: white;
    border-color: #475569;
  }

  .separator {
    color: #64748b;
    font-size: 0.9rem;
    padding: 0 0.25rem;
  }

  .unit {
    color: #64748b;
    font-size: 0.9rem;
    font-weight: 500;
    min-width: 2rem;
    text-align: left;
    flex: 0 0 2rem;
  }

  @media (max-width: 768px) {
    .alert-limit-item {
      grid-template-columns: 1fr;
      gap: 0.75rem;
    }

    .input-group {
      width: 100%;
    }
  }
</style>