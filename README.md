# RQP Configurator

A web-based configuration tool for the Roll Quality Profiler (RQP) system. This application allows users to generate QR codes containing system configuration parameters that can be scanned by RQP devices.

## Features

- **System Configuration**
  - Set target energy levels
  - Configure solenoid pulse length
  - Adjust interpolation and encoder steps
  - Set accelerometer parameters
  - Configure PID control modes

- **Alert Limits**
  - Set min/max limits for various measurements
  - Configure statistical alert thresholds
  - Adjustable coefficient of variation limits

- **QR Code Generation**
  - Real-time QR code updates
  - Copy QR code image to clipboard
  - Download QR code as PNG
  - Display configuration content in human-readable format

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Tapio-Measurement-Technologies/rqp-configurator.git
   cd rqp-configurator
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist` directory.

## Usage

1. Enter configuration values in the appropriate fields
2. The QR code updates automatically as you type
3. Use the "Copy QR" button to copy the QR code image to clipboard
4. Use the "Download QR" button to save the QR code as a PNG file
5. The configuration content is displayed below the QR code for verification

## Technical Details

### QR Code Format

The QR code content follows this format:
- Starts with SOH character (`\x01`)
- Followed by `CFG:` prefix
- Configuration pairs in `key=value` format
- Multiple configurations separated by semicolons
- Example: `\x01CFG:TARGET_ENERGY=100;SOLENOID_PULSE_LEN_US=500`

### Configuration Types

- **Numeric Values**: Integer or float values with optional min/max limits
- **Select Options**: Predefined options that map to numeric values
- **Alert Limits**: Min/max pairs for various measurements

## Development

The project is built with:
- [Svelte](https://svelte.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) for building and development
- [qrcode](https://www.npmjs.com/package/qrcode) for QR code generation

## License

Copyright © 2024 Tapio Measurement Technologies. All rights reserved.

## Contact

For support or inquiries:
- Email: info@tapiotechnologies.com
- Website: [www.tapiotechnologies.com](https://www.tapiotechnologies.com)
