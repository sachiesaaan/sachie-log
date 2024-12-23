import { htmlToJsx } from "../../util/jsx"
import { QuartzComponentConstructor, QuartzComponentProps } from "../types"


function CustomContent({ fileData, tree }: QuartzComponentProps) {
  const content = htmlToJsx(fileData.filePath!, tree)
  return (
    <article class="popover-hint">
      {content}
    </article>
  )
}

export default (() => CustomContent) satisfies QuartzComponentConstructor

