# **2024-3-ISC09-Intelligent-Irrigation-System-Based-on-Images**

<p align="center">
  <img src="./agronova-app/assets/images/logo.png" alt="Agronova Logo" />
</p>

## **Overview**

This monorepo contains multiple packages related to the **Agronova** application. The main packages are:

- **raspberry**: Applications related to the Raspberry Pi.
- **agronova-api**: Backend API built with KeystoneJS.
- **agronova-app**: Frontend application built with Expo React Native.

---

## **Repository Structure**

### **Packages**

#### **raspberry**

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

Before starting, make sure you have the following installed:

- **Node.js**
- **Yarn** or **NPM**
- **Expo CLI** (for the frontend application)
- **Python 3** (for Raspberry Pi scripts)
- **Raspberry Pi** (for the hardware integration)

---

### **Installation**

1. Clone the repository:

    ```sh
    git clone <repository-url>
    cd 2024-3-ISC09-Intelligent-Irrigation-System-Based-on-Images
    ```

2. Install dependencies for both **agronova-app** and **agronova-api**:

   For **agronova-app**:

   If using **Yarn**:

    ```sh
    yarn install
    ```

   If using **NPM**:

    ```sh
    npm install
    ```

   For **agronova-api**:

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

1. Navigate to the **agronova-api** folder:

    ```sh
    cd agronova-api
    ```

2. Start the KeystoneJS server:

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

1. Navigate to the **agronova-app** folder:

    ```sh
    cd agronova-app
    ```

2. Start the React Native application:

    - Using Yarn:
      
      ```sh
      yarn start
      ```

    - Using NPM:
      
      ```sh
      npx expo start
      ```

---

#### **RaspberryPi Setup (RaspberryApp)**

1. Clone the repository to your Raspberry Pi:

    ```sh
    git clone <repository-url>
    cd 2024-3-ISC09-Intelligent-Irrigation-System-Based-on-Images/RaspberryApp
    ```

2. Install Python dependencies.

3. Run the Raspberry Pi scripts to handle the irrigation system's data collection:

    ```sh
    python3 Riego_IA.py
    ```
    To modify the automatic execution of the program, access from the terminal. 
    ```sh
    sudo nano /etc/rc.local
    ```
    To disable the automation, uncomment line 4 and restart the raspberry.
    ```sh
    python3 /home/pi/Documents/Project/Riego_IA.py 
    ```
---

## **Deployment on Azure**

Both the **agronova-api** and **agronova-app** applications are automatically built and pushed to **GitHub** via Docker containers whenever changes are made.

### **1. Azure Resources**

1. **Azure App Service** for hosting both **agronova-api** and **agronova-app**:
   - Go to the [Azure Portal](https://portal.azure.com).
   - Create two **App Services**: one for the **agronova-api** and another for the **agronova-app**.
   - Configure each App Service with the appropriate settings for **Node.js** runtime stack.

2. **Azure Blob Storage** (Optional) for storing images and other static assets:
   - Create a **Storage Account** in Azure.
   - Use **Azure Blob Storage** to store images used in your application.

### **2. Continuous Deployment with GitHub Actions**

The **agronova-api** and **agronova-app** applications are automatically deployed to Azure through **GitHub Actions**:

1. GitHub Actions are configured to build Docker images and push them to the appropriate container registries each time there are updates to the repository.

2. These workflows are set up in the `.github/workflows/` directory:
   - **agronova-api** workflow: Builds and pushes the Docker image for the backend API to the container registry and then deploys to **Azure App Service**.
   - **agronova-app** workflow: Builds and pushes the Docker image for the frontend React Native app and then deploys to **Azure App Service**.

### **3. Monitor and Manage**

1. After the deployment is complete, you can manage and monitor both the **agronova-api** and **agronova-app** via the **Azure Portal**.
2. Check logs and performance metrics to ensure everything is working smoothly.


