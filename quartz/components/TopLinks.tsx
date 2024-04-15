import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/topLinks.scss"
import { version } from "../../package.json"

interface Options {
  links: Record<string, string>
}

export default ((opts?: Options) => {
  function TopLinks({ displayClass }: QuartzComponentProps) {
    const year = new Date().getFullYear()
    const links = opts?.links ?? []
    return (
      <div class={`top-links ${displayClass ?? ""}`}>
        <ul>
          {Object.entries(links).map(([text, link]) => (
            <li>
              <a href={link}>{text}</a>
            </li>
          ))}
        </ul>
      </div>
    )
  }
  TopLinks.css = style

  return TopLinks
}) satisfies QuartzComponentConstructor
