/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL base del backend (opcional). Vacío = mismo origen. Ver frontend/src/services/chatService.ts. */
  readonly VITE_API_BASE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
