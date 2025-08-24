# Pixora 
Pixora is an AI-powered photo editing app that lets users upload, edit, and enhance images with powerful tools like AI-based modifications, background search via Unsplash, and premium features with authentication and billing support.

---

## 📌 Tech Stack
- **Frontend:** Next.js, Tailwind CSS, Shadcn UI 
- **Backend & Database:** Node.js, Convex
- **Authentication & Billing:** Clerk 
- **Canvas Tools:** Fabric.js  
- **AI Image Processing:** ImageKit  

---

## 📂 Project Structure
````
📂 Pixora  
 ├── 📂 app/                  # Next.js App Router (routes, layouts, pages)  
 ├── 📂 components/           # Reusable UI components (shadcn/ui based)  
 ├── 📂 context/              # React context providers (global state mgmt)  
 ├── 📂 convex/               # Convex backend functions + schema  
 ├── 📂 hooks/                # Custom React hooks  
 ├── 📂 lib/                  # Utility functions, helpers  
 ├── 📂 node_modules/         # Installed dependencies (ignored in git)  
 ├── 📂 public/               # Static assets (images, icons, logos)  
 │
 ├── .env.local               # Environment variables  
 ├── .gitignore               # Git ignore rules  
 ├── components.json          # shadcn/ui configuration  
 ├── eslint.config.mjs        # ESLint config  
 ├── jsconfig.json            # JS/TS path aliases + intellisense config  
 ├── middleware.js            # Next.js middleware (auth, redirects, etc.)  
 ├── next.config.mjs          # Next.js configuration  
 ├── package.json             # Project dependencies + scripts  
 ├── package-lock.json        # Locked dependency tree   

````
---

## 🛠️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Riyachauhan11/Pixora.git
cd Pixora
````

### 2️⃣ Install Dependencies

Make sure you have **Node.js 18+** installed:

```bash
npm install
```

### 3️⃣ Configure Environment Variables

Create a `.env.local` file in the project root and add:

```ini
# Convex
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=

# Clerk (Auth + Billing)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
CLERK_JWT_ISSUER_DOMAIN=

# ImageKit
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=
IMAGEKIT_PRIVATE_KEY=

# Unsplash
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=
```

🔹 **Clerk Setup**

* Sign up at [Clerk](https://clerk.com)
* Copy your API keys and JWT issuer domain.

🔹 **ImageKit Setup**

* Sign up at [ImageKit.io](https://imagekit.io)
* Get Public Key, Private Key, and URL endpoint.

🔹 **Unsplash Setup**

* Register at [Unsplash Developers](https://unsplash.com/developers)
* Generate an Access Key.

### 4️⃣ Set Up Convex

Convex powers the backend with real-time database:

```bash
npx convex dev
```

This starts Convex locally and connects to your environment config.

### 5️⃣ Run the Next.js Frontend

Launch the frontend:

```bash
npm run dev
```

Now open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎨 Features

* 📷 Upload or search images (Unsplash integration)
* 🖌️ Edit with Fabric.js canvas tools (crop, text, adjust)
* 🖼️ Apply AI-based modifications via ImageKit
* 🔐 Auth & Pro subscription powered by Clerk
* 💾 Save and download final images

---

## 🎥 How it looks like


https://github.com/user-attachments/assets/1f15b0cd-7cba-4ebc-9102-8544a714ea06





---
