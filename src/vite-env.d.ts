/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_ENV: 'development' | 'production' | 'test'
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_APP_URL: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_TIMEOUT?: string
  readonly VITE_ENABLE_MOCK_DATA?: string
  readonly VITE_ENABLE_DEMO_BANNER?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
