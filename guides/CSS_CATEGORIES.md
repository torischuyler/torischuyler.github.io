# CSS Property Categories

This guide organizes CSS properties into four categories—**Size**, **Space**, **Style**, and **Chaos**—to help structure stylesheets clearly and consistently.

## Size

Properties that control the **dimensions** or **scale** of elements or their content.

- `font-size` (e.g., `16px`, `1.5rem`)
- `width`, `height` (e.g., `100px`, `50%`)
- `min-width`, `max-width`, `min-height`, `max-height`
- `line-height` (e.g., `1.6`, `24px`)

## Space

Properties that manage **layout**, **positioning**, or **gaps** around/between elements.

- `margin` (e.g., `20px`, `auto`)
- `padding` (e.g., `10px 20px`)
- `gap` (e.g., `15px` for flex/grid)
- `position` (e.g., `relative`, `absolute`)
- `top`, `right`, `bottom`, `left` (e.g., `10px`)
- `display` (e.g., `flex`, `grid`)
- `justify-content`, `align-items` (e.g., `center`, `space-between`)

## Style

Properties that define the **visual appearance** or **aesthetics** without affecting size or spacing.

- `color` (e.g., `#333`, `red`)
- `background-color` (e.g., `gold`)
- `border-style` (e.g., `solid`, `dashed`)
- `border-radius` (e.g., `8px`)
- `font-family` (e.g., `"Righteous", sans-serif`)
- `font-weight` (e.g., `700`)
- `text-decoration` (e.g., `underline`)
- `box-shadow` (e.g., `0 2px 4px rgb(0 0 0 / 10%);`)

## Chaos

Properties that add **animations**, **transitions**, or **dynamic actions** to elements.

- `animation` (e.g., `typewriter 2s steps(10) forwards;`)
- `transition` (e.g., `background-color 0.3s ease`)
- `transform` (e.g., `rotate(45deg)`, `scale(1.2)`)
- `opacity` (e.g., `0.5`, often used with transitions)
- `cursor` (e.g., `pointer`, `grab`)
- `pointer-events` (e.g., `none`, `auto`)

### Why Use This?

Organizing CSS into Size, Space, Style, and Chaos helps separate concerns, making stylesheets easier to maintain and reason about. Use these categories to guide how you structure your CSS rules.
