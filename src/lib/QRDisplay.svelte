<script lang="ts">
  import QRCode from 'qrcode'
  import { onMount } from 'svelte'
  import { QR_CONFIG } from '../config/settings'

  export let text: string

  let qrCanvas: HTMLCanvasElement
  let errorMessage = ''
  let copyMessage = ''
  let copyTimeout: ReturnType<typeof setTimeout> | undefined

  function getQRContent(input: string): string {
    return `${QR_CONFIG.SOH_CHARACTER}${QR_CONFIG.CONFIG_PREFIX}${input}`
  }

  function generateQR() {
    errorMessage = ''
    if (!text || !text.trim()) {
      return
    }
    const qrContent = getQRContent(text)
    QRCode.toCanvas(qrCanvas, qrContent, QR_CONFIG.QR_OPTIONS).catch((err: Error) => {
      errorMessage = 'Error generating QR code: ' + err.message
    })
  }

  function formatContentWithHex(input: string): string {
    const qrContent = getQRContent(input)
    return qrContent.split('').map((char, i) => {
      if (i === 0) return '\\x01' // SOH character
      return char
    }).join('')
  }

  async function copyToClipboard() {
    if (!qrCanvas) return

    try {
      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) =>
        qrCanvas.toBlob(blob => resolve(blob!), 'image/png')
      )

      // Create ClipboardItem and copy
      const item = new ClipboardItem({ 'image/png': blob })
      await navigator.clipboard.write([item])

      copyMessage = 'Copied!'
      if (copyTimeout) clearTimeout(copyTimeout)
      copyTimeout = setTimeout(() => copyMessage = '', 2000)
    } catch (err) {
      copyMessage = 'Failed to copy'
      if (copyTimeout) clearTimeout(copyTimeout)
      copyTimeout = setTimeout(() => copyMessage = '', 2000)
    }
  }

  function downloadQR() {
    if (!qrCanvas) return

    const link = document.createElement('a')
    link.download = 'rqp-config-qr.png'
    link.href = qrCanvas.toDataURL('image/png')
    link.click()
  }

  $: if (text !== undefined) {
    generateQR()
  }

  onMount(() => {
    generateQR()
  })
</script>

<div class="qr-section">
  <div class="qr-container">
    {#if !text}
      <div class="placeholder">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <rect x="7" y="7" width="3" height="3"></rect>
          <rect x="14" y="7" width="3" height="3"></rect>
          <rect x="7" y="14" width="3" height="3"></rect>
        </svg>
        <span>Enter configuration values to generate QR code</span>
      </div>
    {/if}
    <canvas bind:this={qrCanvas} class:hidden={!text}></canvas>
  </div>
  {#if text}
    <div class="content-section">
      <div class="content-header">
        <p class="qr-text">Content:</p>
        <div class="button-group">
          <button type="button" class="action-button copy-button" on:click={copyToClipboard}>
            {#if copyMessage}
              {copyMessage}
            {:else}
              Copy QR
            {/if}
          </button>
          <button type="button" class="action-button download-button" on:click={downloadQR}>
            Download QR
          </button>
        </div>
      </div>
      <pre class="code-block">{formatContentWithHex(text)}</pre>
    </div>
  {/if}
  {#if errorMessage}
    <p class="error">{errorMessage}</p>
  {/if}
</div>

<style>
  .qr-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .qr-container {
    background-color: white;
    padding: 2rem;
    border-radius: 12px;
    display: inline-block;
    border: 2px solid #e2e8f0;
    min-width: 300px;
    min-height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    height: 300px;
    width: 300px;
    color: #94a3b8;
  }

  .placeholder svg {
    width: 48px;
    height: 48px;
    stroke: currentColor;
  }

  .placeholder span {
    font-size: 0.95rem;
  }

  .hidden {
    display: none;
  }

  .qr-text {
    color: #4b5563;
    font-size: 0.95rem;
    margin: 0;
    font-weight: 500;
  }

  .code-block {
    background-color: #f8f9fa;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 0.75rem 1rem;
    font-family: monospace;
    font-size: 0.9rem;
    color: #1a1a1a;
    margin: 0;
    max-width: 100%;
    overflow-x: auto;
    white-space: pre-wrap;
    word-break: break-all;
  }

  .error {
    color: #dc2626;
    margin: 1rem 0;
    font-weight: 500;
    background-color: #fee2e2;
    padding: 0.75rem;
    border-radius: 8px;
  }

  .content-section {
    width: 100%;
  }

  .content-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .button-group {
    display: flex;
    gap: 0.5rem;
  }

  .action-button {
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
    background-color: transparent;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    min-width: 60px;
    text-align: center;
  }

  .copy-button {
    color: #3b82f6;
    border: 1px solid #3b82f6;
  }

  .copy-button:hover {
    background-color: #3b82f6;
    color: white;
  }

  .copy-button:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }

  .download-button {
    color: #10b981;
    border: 1px solid #10b981;
  }

  .download-button:hover {
    background-color: #10b981;
    color: white;
  }

  .download-button:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
  }
</style>