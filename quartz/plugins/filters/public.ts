import { QuartzFilterPlugin } from "../types"

export const FilterPublic: QuartzFilterPlugin<{}> = () => ({
    name: "FilterPublic",
    shouldPublish(_ctx, [_tree, vfile]) {
        // Access the tags in the frontmatter
        const tags: string[] = vfile.data?.frontmatter?.tags ?? []
        // Only publish if the "public" tag is present
        return tags.includes("public")
    },
})
