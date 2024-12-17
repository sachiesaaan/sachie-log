import { QuartzComponentConstructor } from "./types"
// @ts-ignore: typescript doesn't know about our inline bundling system
// so we need to silence the error
import script from "./scripts/custom.inline"
import { QuartzComponentProps } from "./types"

import CalHeatmap from 'cal-heatmap';

interface Props {
    txt: string
}


export function CustomComponent({ txt }: Props) {
    const cal: CalHeatmap = new CalHeatmap();
    cal.paint({});
    return (<>
        {txt}

        <div id="cal-heatmap"></div>
    </>)
}
