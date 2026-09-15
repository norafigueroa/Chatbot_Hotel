/**
 * Prefijo para las imágenes del widget (logo, ícono del chat).
 *
 * En el sitio de demo (mismo origen) queda vacío y las imágenes se resuelven
 * relativas al sitio, como siempre. En el build del widget embebible
 * (dist-widget/), se define VITE_ASSET_BASE con la URL absoluta de donde
 * viven esas imágenes, porque el widget corre incrustado en OTRO dominio.
 */
export const ASSET_BASE = import.meta.env.VITE_ASSET_BASE ?? ''
