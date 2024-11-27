# 2024-3-ISC09-Sistema-de-Riego-Inteligente-Basado-en-Imagenes

## Overview

This monorepo contains multiple packages related to the Agronova application. The main packages are:

- `RaspberryApp`: Placeholder for Raspberry Pi related applications.
- `agronova-api`: Backend API built with KeystoneJS.
- `agronova-app`: Frontend application built with EXPO REACT NATIVE.

## Repository Structure

### Packages

#### RaspberryApp

This directory contains the programs found on the raspberry.

#### agronova-api

This package contains the backend API for the agronova application. It is built using KeystoneJS.

- **Main Files:**
  - `keystone.ts`: KeystoneJS configuration and setup.
  - `schema.ts`: Call all the schemes.
  - `dockerfile`: Build the backend image.

#### agronova-app

This package contains the frontend application for the agronova platform. It is built using React.

- **Main Files:**
  - `app/`: Contains the main application layout and pages.
  - `assets/`: Contains fonts and images used in the application.
  - `components/`: Contains reusable React components.
  - `constants/`: Contains application-wide constants.
  - `hooks/`: Contains custom React hooks.
  - `scripts/`: Contains utility scripts.
  - `tsconfig.json`: TypeScript configuration file.
  - `babel.config.js`: Babel configuration file.

For more details, refer to the [README.md](packages/vive-hub-app/README.md) in the `vive-hub-app` directory.

## Getting Started

### Prerequisites

- Node.js
- Yarn

### Installation

1. Clone the repository:
    ```sh
    git clone <repository-url>
    cd 2024-3-PM-ViveHUBApp
    ```

2. Install dependencies:
    ```sh
    yarn install
    ```

### Running the Applications

#### Backend (vive-hub-api)

Navigate to the `vive-hub-api` directory and start the KeystoneJS server:

    ```sh
    cd packages/vive-hub-api
    yarn start
    ```

#### Frontend (vive-hub-app)

Navigate to the `vive-hub-app` directory and start the React Native App:

    ```sh
    cd packages/vive-hub-api
    yarn start
    ```

For Android:

    ```sh
    yarn android
    ```
For iOS:

    ```sh
    yarn ios
    ```
