# Carpeta `public/`

Vite sirve todo lo que esté aquí en la raíz del sitio (`/`).

## Foto de fondo del hero

Coloca la foto oficial de Isla Chiquita en esta carpeta con el nombre exacto:

```
public/hero.jpg
```

El hero ([src/components/Hero.tsx](../src/components/Hero.tsx)) ya la referencia como
`url('/hero.jpg')` con una capa oscura encima para que el texto siga legible.

Recomendaciones para la imagen:
- Formato: `.jpg` (o cambia la extensión en `Hero.tsx` si usas `.png`/`.webp`).
- Orientación horizontal, buena resolución (mínimo ~1920px de ancho).
- Peso optimizado (idealmente < 500 KB) para que cargue rápido.

Si aún no hay `hero.jpg`, el hero simplemente muestra el fondo negro (sin error).
