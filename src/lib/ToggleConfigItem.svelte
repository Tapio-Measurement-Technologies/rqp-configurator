<script lang="ts">
  import type { ConfigItem } from '../types'
  import { UI_CONFIG } from '../config/settings'

  export let item: ConfigItem

  function handleToggle() {
    if (validation.tristate) {
      // Cycle through states: not set -> on -> off -> not set
      if (!item.value) {
        item.value = '1'
      } else if (item.value === '1') {
        item.value = '0'
      } else {
        item.value = ''
      }
    } else {
      // Traditional toggle behavior
      item.value = item.value === '1' ? '0' : '1'
    }
  }

  $: isChecked = item.value === '1'
  $: isOff = item.value === '0'
  $: isNotSet = !item.value && validation.tristate
  $: validation = item.validation as { type: 'toggle'; offLabel?: string; onLabel?: string; notSetLabel?: string; tristate?: boolean }
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
  </div>
  <div class="value-input">
    <label class="toggle">
      <input
        type="checkbox"
        id={item.key}
        checked={isChecked}
        on:change={handleToggle}
      />
      <span
        class="slider"
        class:checked={isChecked}
        class:not-set={isNotSet}
        class:off={isOff}
      ></span>
      <span class="toggle-label">
        {#if isNotSet}
          {validation.notSetLabel || 'Not set'}
        {:else}
          {isChecked ? (validation.onLabel || 'On') : (validation.offLabel || 'Off')}
        {/if}
      </span>
    </label>
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

  .value-input {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  .toggle {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
  }

  .toggle input {
    display: none;
  }

  .slider {
    position: relative;
    width: 48px;
    height: 24px;
    background-color: #e2e8f0;
    border-radius: 24px;
    transition: all 0.2s ease;
  }

  .slider:before {
    content: "";
    position: absolute;
    height: 20px;
    width: 20px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    border-radius: 50%;
    transition: all 0.2s ease;
  }

  .slider.checked {
    background-color: #3b82f6;
  }

  .slider.checked:before {
    transform: translateX(24px);
  }

  .slider.not-set {
    background-color: #94a3b8;
  }

  .slider.not-set:before {
    transform: translateX(12px);
    background-color: #f1f5f9;
  }

  .slider.off {
    background-color: #e2e8f0;
  }

  .slider.off:before {
    transform: translateX(0);
  }

  .toggle-label {
    font-size: 0.9rem;
    font-weight: 500;
    color: #1a1a1a;
    min-width: 32px;
  }

  @media (max-width: 768px) {
    .config-item {
      grid-template-columns: 1fr;
      gap: 0.75rem;
    }
  }
</style>