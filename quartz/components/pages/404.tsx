import { QuartzComponentConstructor } from "../types"

function NotFound() {
  return (
    <article class="popover-hint">
      <h2 class={`article-title`}>404</h2>
      <blockquote>ページが存在しないか、非公開になっています。</blockquote>
    </article>
  )
}

NotFound.css = `
.article-title {
}
`

export default (() => NotFound) satisfies QuartzComponentConstructor
