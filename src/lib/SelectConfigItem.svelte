<script lang="ts">
  import type { SelectConfigItem } from '../types'
  import { UI_CONFIG } from '../config/settings'

  export let item: SelectConfigItem

  function handleSelect(event: Event) {
    const select = event.target as HTMLSelectElement
    item.value = select.value
  }

  $: selectedOption = item.validation.options.find(opt => opt.value.toString() === item.value)
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
    <select
      id={item.key}
      value={item.value}
      on:change={handleSelect}
      aria-label={`Value for ${item.label}`}
    >
      <option value="">Select...</option>
      {#each item.validation.options as option}
        <option value={option.value.toString()}>{option.label}</option>
      {/each}
    </select>
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

  .value-input {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
  }

  select {
    width: 100%;
    padding: 0.5rem 0.75rem;
    font-size: 0.95rem;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    background-color: white;
    color: #1a1a1a;
    transition: all 0.2s ease;
    cursor: pointer;
  }

  select:hover {
    border-color: #cbd5e1;
  }

  select:focus {
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

    select {
      width: 100%;
    }
  }
</style>