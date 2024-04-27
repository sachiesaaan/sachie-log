import { htmlToJsx } from "../../util/jsx"
import { QuartzComponentConstructor, QuartzComponentProps } from "../types"
// @ts-ignore
import script from "../scripts/custom.inline"

export default (() => {
  function CustomContent({ fileData, tree }: QuartzComponentProps) {
    const content = htmlToJsx(fileData.filePath!, tree)


    return (
      <article class="popover-hint">
        <p>this is custom page</p>
        <svg id="gfg" width="100" height="100"></svg>
        {content}
      </article>)
  }
  CustomContent.afterDOM = script
  return CustomContent
}) satisfies QuartzComponentConstructor
