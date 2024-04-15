import { QuartzComponentConstructor } from "../types"

function NotFound() {
  return (
    <article class="popover-hint">
      <h1>404</h1>
      <p>🐧🐧🐧</p>
    </article>
  )
}

export default (() => NotFound) satisfies QuartzComponentConstructor
