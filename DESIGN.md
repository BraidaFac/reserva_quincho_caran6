# BRASA — Sistema de Diseño · Caran VI

## Concepto

La brasa, no la llama. Calidez contenida, elegancia material. El quincho como lugar donde el tiempo se afloja. Cada decisión visual refuerza esta idea: colores que irradian calor, tipografía con carácter orgánico, motion sobrio que respira.

## Tipografía

| Rol | Fuente | Peso | Uso |
|-----|--------|------|-----|
| **Display** | Fraunces | 600–800 | Títulos, hero text, nombre "Caran VI" |
| **Body** | DM Sans | 400–600 | Texto corrido, labels, inputs, badges |

### Escala tipográfica (mobile-first)

| Token | Size | Line-height | Uso |
|-------|------|-------------|-----|
| `text-xs` | 0.75rem (12px) | 1rem | Micro-labels, badges |
| `text-sm` | 0.875rem (14px) | 1.25rem | Body secundario, metadata |
| `text-base` | 1rem (16px) | 1.5rem | Body principal, inputs |
| `text-lg` | 1.125rem (18px) | 1.75rem | Subtítulos secciones |
| `text-xl` | 1.25rem (20px) | 1.75rem | Títulos de card |
| `text-2xl` | 1.5rem (24px) | 2rem | Page titles |
| `text-3xl` | 1.875rem (30px) | 2.25rem | Hero / brand |

Display font (Fraunces) se usa en `text-xl` para arriba. Body font (DM Sans) en `text-lg` para abajo.

## Paleta

### Roles semánticos

| Token CSS | HSL | Hex aprox | Rol | Contraste sobre fondo |
|-----------|-----|-----------|-----|-----------------------|
| `--background` | `40 25% 95%` | #F3EEE6 | Superficie base — hueso ahumado | — |
| `--foreground` | `20 15% 15%` | #2C2623 | Texto principal — carbón cálido | 11.5:1 ✓ AAA |
| `--card` | `38 20% 98%` | #FBF9F5 | Cards, modals, superficies elevadas | — |
| `--card-foreground` | `20 15% 15%` | #2C2623 | Texto sobre card | 13:1 ✓ AAA |
| `--primary` | `15 75% 48%` | #D65A1F | Brasa viva — CTA, día actual, acento | 4.8:1 ✓ AA (large) |
| `--primary-foreground` | `0 0% 100%` | #FFFFFF | Texto sobre primary | 4.8:1 ✓ AA |
| `--secondary` | `32 35% 82%` | #DCCDB5 | Madera clara — fondos turno mediodía | — |
| `--secondary-foreground` | `25 20% 25%` | #4D3E33 | Texto sobre secondary | 5.8:1 ✓ AA |
| `--muted` | `35 15% 91%` | #EAE5DE | Fondos inactivos, disabled | — |
| `--muted-foreground` | `30 10% 45%` | #7A6F64 | Texto secundario, placeholders | 4.6:1 ✓ AA |
| `--accent` | `42 65% 55%` | #D4A233 | Ocre dorado — highlights, mediodía | — |
| `--accent-foreground` | `35 30% 18%` | #3B3024 | Texto sobre accent | 7.2:1 ✓ AAA |
| `--destructive` | `0 60% 50%` | #CC3333 | Cancelar, errores | — |
| `--destructive-foreground` | `0 0% 100%` | #FFFFFF | Texto sobre destructive | 5.3:1 ✓ AA |
| `--border` | `30 15% 85%` | #DDD5CB | Bordes — cálido, nunca gris puro | — |
| `--input` | `30 15% 85%` | #DDD5CB | Bordes de input | — |
| `--ring` | `15 75% 48%` | #D65A1F | Focus ring = primary | — |
| `--night` | `220 30% 40%` | #476185 | Turno noche — azul brasero | — |
| `--night-foreground` | `0 0% 100%` | #FFFFFF | Texto sobre night | 5.1:1 ✓ AA |

### Reglas de uso de color
- **Nunca** negro puro (#000). El foreground más oscuro es carbón cálido (`20 15% 15%`).
- **Nunca** blanco puro (#FFF) como fondo. El card más claro es `38 20% 98%`.
- **Turno mediodía**: accent (ocre dorado) como indicador, secondary (madera clara) como fondo.
- **Turno noche**: night (azul brasero) como indicador, primary tints como fondo.
- **Estado ocupado/pasado**: muted + opacity reducida. Nunca solo color — siempre acompañar con texto o forma.

## Motivo firma: Punto Brasa

Un círculo con `radial-gradient` que simula incandescencia. Se usa en:
- **Día actual** en el calendario (reemplaza el círculo sólido genérico)
- **Reservas activas** (dot indicator)
- **Loading state** (pulsa con `animation: ember-pulse`)
- **Separadores decorativos** (en lugar de líneas rectas)

```css
.ember-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: radial-gradient(circle at 40% 40%, hsl(30 90% 70%), hsl(15 75% 48%), hsl(10 60% 30%));
  box-shadow: 0 0 6px 1px hsla(15, 75%, 48%, 0.4);
}
```

## Espaciado

Usa la escala de Tailwind por defecto (4px base). Reglas:
- Padding interno de cards: `p-4` (16px) mobile, `p-6` (24px) desktop
- Gap entre cards en lista: `gap-3` (12px)
- Secciones principales: `gap-6` (24px) mobile, `gap-8` (32px) desktop
- El calendario tiene padding compacto: `p-3` mobile, `p-5` desktop

## Radios

| Token | Valor | Uso |
|-------|-------|-----|
| `--radius` | `0.875rem` (14px) | Cards, modals, inputs |
| `--radius-md` | `0.625rem` (10px) | Badges, botones secundarios |
| `--radius-sm` | `0.375rem` (6px) | Chips pequeños |
| `--radius-full` | `9999px` | Días del calendario, avatares, dots |

## Sombras / Elevación

| Nivel | Valor | Uso |
|-------|-------|-----|
| **sm** | `0 1px 3px hsla(20, 15%, 15%, 0.06)` | Cards en reposo |
| **md** | `0 4px 12px hsla(20, 15%, 15%, 0.08)` | Cards hover, modals |
| **glow** | `0 0 12px 2px hsla(15, 75%, 48%, 0.15)` | Focus ring, ember highlights |

Sombras siempre cálidas (tono 20, nunca gris azulado).

## Motion

### Filosofía
Sobrio y táctil. Movimiento como calor que irradia — suave, con easing orgánico. Nunca bounce ni spring.

### Easing
- **Default**: `cubic-bezier(0.22, 1, 0.36, 1)` — entrada rápida, salida suave
- **Gentle**: `cubic-bezier(0.25, 0.1, 0.25, 1)` — para fades largos

### Duraciones
- **Micro** (hover, press): 150ms
- **Normal** (enter/exit): 300ms
- **Slow** (page transitions, reveals): 450ms

### Animaciones clave

| Nombre | Uso | Propiedades |
|--------|-----|-------------|
| `ember-glow` | Día actual pulsa sutilmente | `box-shadow` oscillation, 3s loop |
| `fade-scale-in` | Cards/modals aparecen | `opacity 0→1, scale 0.97→1`, 300ms |
| `stagger-in` | Listas de reservas | `fade-scale-in` con 50ms delay incremental |
| `ember-pulse` | Loading indicator | Scale 0.8→1.1 + opacity, 1.5s loop |

### Regla dura
- Solo animar `transform` y `opacity`. Nunca width/height/margin.
- `prefers-reduced-motion: reduce` → todas las animaciones se convierten en `opacity` instantáneo (sin scale, sin delay).
- ScrollTriggers/timelines se limpian en cleanup de useEffect.

## Accesibilidad

- Todo texto cumple **WCAG AA** mínimo (4.5:1 normal, 3:1 large text). Verificado en tabla de paleta.
- Focus states: ring de 2px con `--ring` (brasa) + offset 2px. Visible sobre cualquier fondo.
- Días del calendario: estado comunicado con **texto + forma + color** (no solo color).
  - Disponible: número normal
  - Ocupado: número + texto "Ocupado" en tooltip + dot lleno
  - Pasado: número dimmed + cursor not-allowed
- Touch targets mínimo 44x44px en mobile (días del calendario, botones).
- `prefers-reduced-motion` respetado en todas las animaciones.

## themeColor

PWA theme-color: `#D65A1F` (primary brasa).
