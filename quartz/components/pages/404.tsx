import { QuartzComponentConstructor } from "../types"

function NotFound() {
  return (
    <article class="popover-hint">
      <h1>404</h1>
      <p>Sachieはまだこのページを書いていないようだ.</p>
      <p>404といえば、MIU404.</p>
      <p> 妹が居酒屋のシーンを異常に好んでいて、外食の際にはそれを再現するのが恒例となっている.</p>
    </article>
  )
}

export default (() => NotFound) satisfies QuartzComponentConstructor
