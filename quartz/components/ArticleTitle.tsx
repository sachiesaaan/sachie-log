import { QuartzComponentConstructor, QuartzComponentProps } from "./types"

function ArticleTitle({ fileData, displayClass }: QuartzComponentProps) {
  const title = fileData.frontmatter?.title
  if (title) {
    return <><h2 class={`article-title ${displayClass ?? ""}`}>{title}</h2><hr></hr></>
  } else {
    return null
  }
}
ArticleTitle.css = `
.article-title {
  text-align: center;
}
`

export default (() => ArticleTitle) satisfies QuartzComponentConstructor
