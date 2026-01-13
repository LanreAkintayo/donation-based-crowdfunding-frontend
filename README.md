# Donation-Based Crowdfunding System

## 📄 Overview
It is a crowdfunding application that allows users to create campaigns, donate via fiat (Naira) and crypto to causes, and track donation milestones transparently on the blockchain.

This is the **Frontend** repository. It interacts with smart contracts deployed on BSC Testnet.

### 🌟 Key Features
* **Campaign Creation:** Users can launch new fundraising campaigns with a target amount and deadline.
* **Donation System:** Direct crypto donations using [Wallet Connect / Metamask] and fiat donations via Paystack.
* **Real-time Tracking:** Progress bars showing funds raised vs. target.
* **Transparency:** All transaction history is verifiable on-chain.
* **Responsive Design:** Optimized for desktop using Tailwind CSS.

## 🛠️ Tech Stack
* **Framework:** Next.js
* **Styling:** Tailwind CSS
* **Blockchain Interaction:** [ethers.js / moralis ]
* **Contract Development:** [ Hardhat] 

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed:
* [Node.js](https://nodejs.org/) (v18 or higher)
* [Git](https://git-scm.com/)

### Installation

1.  **Clone the repository**
    ```bash
    git clone git@github.com:LanreAkintayo/donation-based-crowdfunding-frontend.git
    cd donation-based-crowdfunding-frontend
    ```

2.  **Install dependencies**
    ```bash
    yarn install
    ```

3.  **Set up Environment Variables**
    Create a `.env.local` file in the root directory and add your keys:
    ```bash
    NEXT_PUBLIC_API_URL=
    NEXT_PUBLIC_PROJECT_ID=
    NEXT_PUBLIC_API_SECRET_KEY=
    NEXT_PUBLIC_IPFS_API_ENDPOINT=
    NEXT_PUBLIC_PINATA_API_KEY=
    NEXT_PUBLIC_PINATA_API_SECRET=
    NEXT_PUBLIC_PINATA_JWT=
    NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=
    NEXT_PUBLIC_GOOGLE_CLIENT_ID=
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) to view it in your browser.