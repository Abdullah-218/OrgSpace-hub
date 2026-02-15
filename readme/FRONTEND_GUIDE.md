# 🎨 FRONTEND SETUP GUIDE - Step by Step

## 📦 **STEP 1: Create React App with Vite**

```bash
# Navigate to project root
cd multi-org-blog-platform

# Create frontend with Vite (fast, modern)
npm create vite@latest frontend -- --template react

# Navigate to frontend
cd frontend

# Install dependencies
npm install
```

---

## 🎨 **STEP 2: Install Essential Packages**

```bash
# Core dependencies
npm install react-router-dom axios

# UI & Styling
npm install tailwindcss postcss autoprefixer
npm install @headlessui/react @heroicons/react
npm install clsx tailwind-merge

# Forms & Validation
npm install react-hook-form zod @hookform/resolvers

# Rich Text Editor (for blog creation)
npm install react-quill quill

# Image Upload
npm install react-dropzone

# Date formatting
npm install date-fns

# Notifications/Toasts
npm install react-hot-toast

# State Management (optional, we'll use Context)
# npm install zustand
```

---

## ⚙️ **STEP 3: Configure Tailwind CSS**

```bash
# Initialize Tailwind
npx tailwindcss init -p
```

This creates `tailwind.config.js` and `postcss.config.js`

**Update `tailwind.config.js`:**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Cal Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'hover': '0 10px 40px -10px rgba(0, 0, 0, 0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
```

**Install Tailwind plugins:**

```bash
npm install @tailwindcss/forms @tailwindcss/typography @tailwindcss/aspect-ratio
```

---

## 🎨 **STEP 4: Setup Global Styles**

**Create `src/styles/index.css`:**

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

/* Global base styles */
@layer base {
  * {
    @apply border-gray-200;
  }
  
  body {
    @apply bg-gray-50 text-gray-900 antialiased;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
  }

  h1, h2, h3, h4, h5, h6 {
    @apply font-semibold tracking-tight;
  }

  h1 {
    @apply text-4xl md:text-5xl;
  }

  h2 {
    @apply text-3xl md:text-4xl;
  }

  h3 {
    @apply text-2xl md:text-3xl;
  }
}

/* Custom components */
@layer components {
  /* Button variants */
  .btn {
    @apply px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed;
  }

  .btn-primary {
    @apply btn bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500;
  }

  .btn-secondary {
    @apply btn bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500;
  }

  .btn-ghost {
    @apply btn bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500;
  }

  /* Card */
  .card {
    @apply bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-200;
  }

  .card-hover {
    @apply card hover:shadow-md hover:border-gray-300;
  }

  /* Input */
  .input {
    @apply w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all duration-200 outline-none;
  }

  .input-error {
    @apply input border-red-300 focus:border-red-500 focus:ring-red-100;
  }

  /* Badge */
  .badge {
    @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium;
  }

  .badge-primary {
    @apply badge bg-primary-100 text-primary-800;
  }

  .badge-success {
    @apply badge bg-green-100 text-green-800;
  }

  .badge-warning {
    @apply badge bg-yellow-100 text-yellow-800;
  }

  .badge-error {
    @apply badge bg-red-100 text-red-800;
  }

  /* Container */
  .container-custom {
    @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
  }
}

/* Utilities */
@layer utilities {
  .text-balance {
    text-wrap: balance;
  }

  .glass {
    @apply bg-white/80 backdrop-blur-md;
  }

  .gradient-text {
    @apply bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent;
  }
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  @apply bg-gray-100;
}

::-webkit-scrollbar-thumb {
  @apply bg-gray-300 rounded-full hover:bg-gray-400;
}

/* Animations */
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.skeleton {
  @apply bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:1000px_100%];
  animation: shimmer 2s infinite;
}

/* Rich text editor styles */
.ql-editor {
  @apply min-h-[300px] text-base;
}

.ql-toolbar {
  @apply border-gray-300 rounded-t-lg;
}

.ql-container {
  @apply border-gray-300 rounded-b-lg;
}
```

---

## 📁 **STEP 5: Create Folder Structure**

```bash
# Create all directories
mkdir -p src/assets/images
mkdir -p src/components/common
mkdir -p src/components/layout
mkdir -p src/components/blog
mkdir -p src/components/admin
mkdir -p src/components/organization
mkdir -p src/pages/auth
mkdir -p src/pages/public
mkdir -p src/pages/user
mkdir -p src/pages/admin
mkdir -p src/context
mkdir -p src/hooks
mkdir -p src/services
mkdir -p src/utils
mkdir -p src/styles
```

---

## 🔧 **STEP 6: Environment Variables**

**Create `frontend/.env`:**

```env
# API Base URL
VITE_API_URL=http://localhost:5001/api

# App Info
VITE_APP_NAME=Blog Platform
VITE_APP_VERSION=1.0.0

# Upload Settings
VITE_MAX_FILE_SIZE=5242880
VITE_ALLOWED_FILE_TYPES=image/jpeg,image/jpg,image/png,image/gif,image/webp

# Feature Flags
VITE_ENABLE_COMMENTS=true
VITE_ENABLE_LIKES=true
```

---

## 📦 **STEP 7: Update `package.json`**

**Your `frontend/package.json` should have:**

```json
{
  "name": "blog-platform-frontend",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.21.0",
    "axios": "^1.6.2",
    "react-hook-form": "^7.49.0",
    "zod": "^3.22.4",
    "@hookform/resolvers": "^3.3.2",
    "react-quill": "^2.0.0",
    "quill": "^1.3.7",
    "react-dropzone": "^14.2.3",
    "date-fns": "^3.0.0",
    "react-hot-toast": "^2.4.1",
    "@headlessui/react": "^1.7.17",
    "@heroicons/react": "^2.1.1",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.0.8",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.32",
    "autoprefixer": "^10.4.16",
    "@tailwindcss/forms": "^0.5.7",
    "@tailwindcss/typography": "^0.5.10",
    "@tailwindcss/aspect-ratio": "^0.4.2",
    "eslint": "^8.55.0",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5"
  }
}
```

---

## ✅ **VERIFICATION CHECKLIST**

After setup, verify:

- [ ] Vite React app created
- [ ] All packages installed
- [ ] Tailwind configured
- [ ] Folder structure created
- [ ] `.env` file created
- [ ] Global styles added
- [ ] Can run `npm run dev`

---

## 🚀 **NEXT STEPS**

Once setup is complete, we'll create:

1. ✅ Setup & Configuration (DONE)
2. 📦 API Services & Context
3. 🧩 Common Components
4. 📄 Auth Pages
5. 🏠 Public Pages
6. 👤 User Dashboard
7. 👑 Admin Dashboards (3 types)
8. 🎨 Polish & Animations

---

**Run these commands now to get started! 🚀**

```bash
cd blog-platform
npm create vite@latest frontend -- --template react
cd frontend
npm install
# Then install all the packages listed above
```