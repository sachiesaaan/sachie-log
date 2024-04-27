import { QuartzEmitterPlugin } from "../types";
import { QuartzComponentProps } from "../../components/types";
import HeaderConstructor from "../../components/Header";
import BodyConstructor from "../../components/Body";
import { pageResources, renderPage } from "../../components/renderPage";
import { FullPageLayout } from "../../cfg";
import { FilePath, pathToRoot } from "../../util/path";
import { defaultContentPageLayout, sharedPageComponents } from "../../../quartz.layout";
import { Content, CustomContent } from "../../components";
import chalk from "chalk";

export const ContentPage: QuartzEmitterPlugin<Partial<FullPageLayout>> = (userOpts) => {
    const opts: FullPageLayout = {
        ...sharedPageComponents,
        ...defaultContentPageLayout,
        pageBody: Content(),
        ...userOpts,
    };
    const { head: Head, header, beforeBody, pageBody, left, right, footer: Footer } = opts;
    const Header = HeaderConstructor();
    const Body = BodyConstructor();

    return {
        name: "ContentPage",
        getQuartzComponents() {
            return [Head, Header, Body, ...header, ...beforeBody, pageBody, ...left, ...right, Footer];
        },
        async emit(ctx, content, resources, emit): Promise<FilePath[]> {
            const cfg = ctx.cfg.configuration;
            const fps: FilePath[] = [];
            const allFiles = content.map((c) => c[1].data);
            let containsIndex = false;

            for (const [tree, file] of content) {
                const slug = file.data.slug!;

                if (slug === "index") {
                    containsIndex = true;
                }

                if (slug === "custom") {
                    // Specific logic for the "custom" page
                    // For example, you can use a different template or component
                    const customComponentData: QuartzComponentProps = {
                        fileData: file.data,
                        externalResources: pageResources(pathToRoot(slug), resources),
                        cfg,
                        children: [],
                        tree,
                        allFiles,
                    };

                    const customContent = renderPage(slug, customComponentData, {
                        ...opts,
                        pageBody: CustomContent()/* Your custom component here */,
                    }, customComponentData.externalResources);

                    const customFp = await emit({
                        content: customContent,
                        slug,
                        ext: ".html",
                    });
                    fps.push(customFp);
                } else {
                    // Default logic for other pages
                    const componentData: QuartzComponentProps = {
                        fileData: file.data,
                        externalResources: pageResources(pathToRoot(slug), resources),
                        cfg,
                        children: [],
                        tree,
                        allFiles,
                    };

                    const content = renderPage(slug, componentData, opts, componentData.externalResources);

                    const fp = await emit({
                        content,
                        slug,
                        ext: ".html",
                    });
                    fps.push(fp);
                }
            }

            if (!containsIndex) {
                console.log(
                    chalk.yellow(
                        `\nWarning: you seem to be missing an \`index.md\` home page file at the root of your \`${ctx.argv.directory}\` folder. This may cause errors when deploying.`,
                    ),
                );
            }

            return fps;
        },
    };
};