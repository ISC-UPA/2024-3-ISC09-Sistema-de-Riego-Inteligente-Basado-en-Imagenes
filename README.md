# **2024-3-ISC09-Intelligent-Irrigation-System-Based-on-Images**

![Agronova Logo](./agronova-app/assets/images/logo.png)

## **Overview**

This monorepo contains multiple packages related to the **Agronova** application. The main packages are:

- **RaspberryApp**: Applications related to the Raspberry Pi.
- **agronova-api**: Backend API built with KeystoneJS.
- **agronova-app**: Frontend application built with Expo React Native.

---

## **Repository Structure**

### **Packages**

#### **RaspberryApp**

Contains the programs developed for the Raspberry Pi.

---

#### **agronova-api**

Backend API for the **Agronova** application, built using KeystoneJS.

- **Main Files:**
  - keystone.ts: KeystoneJS configuration and setup.
  - schema.ts: Main file for schemas.
  - Dockerfile: Builds the backend image.

---

#### **agronova-app**

Frontend application for the **Agronova** platform, built with React Native.

- **Main Files:**
  - app/: Main layout and pages of the application.
  - assets/: Fonts and images used in the app.
  - components/: Reusable React components.
  - tsconfig.json: TypeScript configuration file.
  - babel.config.js: Babel configuration file.

---

## **Getting Started**

### **Prerequisites**

- **Node.js** (recommended version)
- **Yarn** or **NPM**
- **Expo CLI** (for the frontend application)

---

### **Installation**

1. Clone the repository:
    
    ```sh
    git clone <repository-url>
    cd 2024-3-ISC09-Intelligent-Irrigation-System-Based-on-Images
    ```

2. Install dependencies:
   Run the following commands inside the **agronova-app** and **agronova-api** folders (once in each).

   If using **Yarn**:
    
    ```sh
    yarn install
    ```

   If using **NPM**:
    
    ```sh
    npm install
    ```

---

### **Running the Applications**

#### **Backend (agronova-api)**

Navigate to the **agronova-api** folder and start the KeystoneJS server:

1. Open the folder:
    
    ```sh
    cd agronova-api
    ```

2. Start the server:
    - Using Yarn:
      
      ```sh
      yarn start
      ```

    - Using NPM:
      
      ```sh
      npx keystone dev
      ```

---

#### **Frontend (agronova-app)**

Navigate to the **agronova-app** folder and start the React Native application:

1. Open the folder:
    
    ```sh
    cd agronova-app
    ```

2. Start the application:
    - Using Yarn:
      
      ```sh
      yarn start
      ```

    - Using NPM:
      
      ```sh
      npx expo start
      ```

---

You are now ready to work with the **Agronova Intelligent Irrigation System**! 🚀
