import { htmlToJsx } from "../../util/jsx"
import { QuartzComponentConstructor, QuartzComponentProps } from "../types"
// @ts-ignore
import script from "../scripts/custom.inline"
import { CustomComponent } from "../CustomComponent";
import fetch from "node-fetch";
const BEEMINDER_USER = "sachie"
const BEEMINDER_AUTHTOKEN = "EgxhCAo3aGVMMz8VpxEE"

const response = await fetch(`https://www.beeminder.com/api/v1/users/${BEEMINDER_USER}/goals.json?auth_token=${BEEMINDER_AUTHTOKEN}`);
const json: any = await response.json();
const goals: string[] = json.map((goal: { slug: string }) => goal.slug);;
const txt = "hi";

function CustomContent({ fileData, tree }: QuartzComponentProps) {
  const content = htmlToJsx(fileData.filePath!, tree)
  return (
    <article class="popover-hint">
      <p>this is custom page</p>
      <svg id="gfg" width="100" height="100"></svg>
      <div id="cal-heatmap"></div>
      {content}
      {goals}
      <p>
        <CustomComponent txt={txt} />
      </p>

    </article>
  )
}

export default (() => CustomContent) satisfies QuartzComponentConstructor

