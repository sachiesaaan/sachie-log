import { QuartzComponentConstructor, QuartzComponentProps } from "./types"

function Header({ children }: QuartzComponentProps) {
  return children.length > 0 ? <header>{children}</header> : null
}

Header.css = `

`

export default (() => Header) satisfies QuartzComponentConstructor
