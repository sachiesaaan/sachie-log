import { QuartzComponentConstructor } from "../types"

function NotFound() {
  return (
    <article class="popover-hint">
      <h2 class={`article-title`}>4️⃣0️⃣4️⃣</h2>
      <blockquote>In computer network communications, the HTTP 404, 404 not found, 404, 404 error, page not found, or file not found error message is a hypertext transfer protocol (HTTP) standard response code, to indicate that the browser was able to communicate with a given server, but the server could not find what was requested. The error may also be used when a server does not wish to disclose whether it has the requested information.[1]

        The website hosting server will typically generate a "404 Not Found" web page when a user attempts to follow a broken or dead link; hence the 404 error is one of the most recognizable errors encountered on the World Wide Web. - Wikipedia</blockquote>
    </article>
  )
}

NotFound.css = `
.article-title {
}
`

export default (() => NotFound) satisfies QuartzComponentConstructor
