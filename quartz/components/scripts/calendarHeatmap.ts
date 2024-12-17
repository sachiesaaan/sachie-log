import * as Plot from "@observablehq/plot";
import * as d3 from "d3";

// Define the ContributionData interface
interface ContributionData {
    date: Date;
    value: number;
}

// Define the Calendar object
const Calendar = {
    valueAccessor: (d: ContributionData | any): number =>
        typeof d === "object" && "value" in d ? d.value : d[1],

    dateAccessor: (d: ContributionData | any): Date =>
        typeof d === "object" && "date" in d ? d.date : d[0],

    utcWeekday: (i: number): d3.TimeInterval => {
        return d3.timeInterval(
            (date: Date) => {
                date.setUTCDate(date.getUTCDate() - ((date.getUTCDay() + 7 - i) % 7));
                date.setUTCHours(0, 0, 0, 0);
            },
            (date: Date, step: number) =>
                date.setUTCDate(date.getUTCDate() + step * 7),
            (start: Date, end: Date) => (end.getTime() - start.getTime()) / 604800000
        );
    },

    create: function (
        data: (ContributionData | any)[] = [],
        {
            date = this.dateAccessor,
            value = this.valueAccessor,
            reduce = (d: any[]) => d[0],
            width = 726,
            gap = 0.15,
            color,
            fill = value || "steelblue",
            textFill = "white",
            title,
            colors = {
                base: "#eee",
                today: "red",
            },
            weekStart = 0,
            daysToShow = d3.range(7).map((d) => (d + weekStart) % 7),
            weekNumber,
            locale = "en-US",
            weekNumberFormat = weekStart === 0 ? "%U" : "%W",
            dayFormat = (d: Date) =>
                d.toLocaleString(locale, { weekday: "narrow", timeZone: "UTC" }),
            monthFormat = (d: Date) =>
                d.toLocaleString(locale, { month: "short", timeZone: "UTC" }),
            fy,
        }: {
            date?: (d: ContributionData | any) => Date;
            value?: (d: ContributionData | any) => number;
            reduce?: (d: any[]) => any;
            width?: number;
            gap?: number;
            color?: any;
            fill?: string | ((d: any) => string);
            textFill?: string;
            title?: string;
            colors?: { base: string; today: string };
            weekStart?: number;
            daysToShow?: number[];
            weekNumber?: boolean;
            locale?: string;
            weekNumberFormat?: string;
            dayFormat?: (d: Date) => string;
            monthFormat?: (d: Date) => string;
            fy?: any;
        } = {}
    ) {
        // rollup the data into days
        data = Array.from(data, (d) => (typeof d === "string" ? [d, ""] : d));
        const dates = Plot.valueof(data, date);
        const marked = d3.rollup(data, reduce, (d, i) =>
            dates[i] instanceof Date ? dates[i] : d3.isoParse(dates[i])
        );
        const days = [...marked.keys()].filter((d) => !isNaN(d.getTime())); // filter out invalid dates
        if (days.length === 0) days.push(new Date());
        const e = d3.extent(days);

        // responsive
        const W = width < 726 ? "H" : "Y";

        // sort all days, with days containing information put at the beginning of the
        // array (so we can pass channels as arrays, e.g. fill: [1, 2, 3] for three events)
        const fullExtent = [
            d3.utcYear.floor(e[0]),
            d3.utcYear.offset(d3.utcYear.floor(e[1]))
        ];
        // filter out empty semesters
        if (W === "H") {
            if (e[0].getUTCMonth() >= 6)
                fullExtent[0] = d3.utcMonth.offset(fullExtent[0], 6);
            if (e[1].getUTCMonth() < 6)
                fullExtent[1] = d3.utcMonth.offset(fullExtent[1], -6);
        }
        const alldays = new Set([...days, ...d3.utcDays(...fullExtent)]);

        // copy the rolled-up data into the days array
        data = Array.from(alldays, (date) => ({
            date,
            ...(marked.has(date)
                ? { ...marked.get(date), date, foreground: true }
                : { background: true })
        }));

        // weekStart and weekNumber
        const utcWeek = this.utcWeekday(weekStart);
        if (typeof weekNumberFormat === "string")
            weekNumberFormat = d3.utcFormat(weekNumberFormat);
        if (![0, 1].includes(weekStart))
            throw new Error("unsupported weekStart value");

        const weekX =
            W === "H"
                ? (d: Date) =>
                    +utcWeek.count(d3.utcYear(d), d) -
                    26.2 * (d.getUTCMonth() >= 6) +
                    gap * d.getUTCMonth()
                : (d: Date) => +utcWeek.count(d3.utcYear(d), d) + gap * +d.getUTCMonth();
        const height =
            (d3.utcMonths(...d3.extent(alldays)).length / 12) *
            (daysToShow.length + 2) *
            17 *
            (W === "H" ? 2 : 1);

        // We want the UTC date that corresponds to our local calendar date
        const now = new Date();
        const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());

        // formats
        if (typeof dayFormat !== "function") dayFormat = d3.utcFormat(dayFormat);
        if (typeof monthFormat !== "function")
            monthFormat = d3.utcFormat(monthFormat);

        // positions
        const barOptions = {
            x1: (d: any) => -0.45 + weekX(d.date),
            x2: (d: any) => 0.5 + weekX(d.date),
            y: (d: any) => d.date.getUTCDay(),
            insetBottom: 1
        };
        const textOptions = {
            x: (d: any) => weekX(d.date),
            y: (d: any) => d.date.getUTCDay(),
            text: (d: any) => d.date.getUTCDate(),
            fontSize: 8,
            pointerEvents: "none"
        };

        // default title
        if (title === undefined) {
            const values = Plot.valueof(data, value);
            const format = d3.format("~f");
            const formatValue = (d: any) => (typeof d === "number" ? format(d) : d);
            title = Plot.valueof(data, (d, i) =>
                d.foreground
                    ? `${new Intl.DateTimeFormat(locale, { timeZone: "UTC" }).format(
                        d.date
                    )}: ${formatValue(values[i])}`
                    : undefined
            );
        }

        const p = Plot.plot({
            width,
            marginTop: 0,
            marginBottom: 0,
            marginLeft: W === "H" ? 70 : 40,
            height,
            facet: {
                data,
                y:
                    W === "H"
                        ? (d) =>
                            `${d.date.getUTCFullYear()} H${d.date.getUTCMonth() < 6 ? "1" : "2"
                            }`
                        : (d) => `${d.date.getUTCFullYear()}`
            },
            y: {
                // -2/-1 is for the legend/week number, 0=Sun, 1=Mon… 6=Sat
                domain: weekNumber ? [-2, -1, ...daysToShow] : [-1, ...daysToShow],
                tickFormat: (day) =>
                    day < 0 ? "" : dayFormat(d3.isoParse(`2000-02-2${day}`)),
                tickSize: 0
            },
            x: { axis: null },
            fy: { reverse: true, axis: null, ...fy },
            color,
            marks: [
                // cells
                [
                    colors.base &&
                    Plot.barX(data, {
                        filter: "background",
                        ...barOptions,
                        fill: colors.base
                    }),
                    Plot.barX(data, {
                        filter: "foreground",
                        ...barOptions,
                        fill,
                        title
                    }),
                    colors.today &&
                    Plot.barX(data, {
                        filter: (d) => +d.date === +today,
                        ...barOptions,
                        fill: "none",
                        stroke: colors.today
                    })
                ],

                // labels
                [
                    Plot.text(data, {
                        filter: "background",
                        ...textOptions,
                        fill: "black"
                    }),
                    Plot.text(data, {
                        filter: "foreground",
                        ...textOptions,
                        fill: textFill
                    })
                ],

                // years and months
                [
                    Plot.text(
                        data,
                        Plot.selectMinX({
                            filter: (d) => d.date.getUTCDay() === weekStart,
                            x: (d) => weekX(d.date),
                            y: weekNumber ? -2 : -1,
                            text: (d) => monthFormat(d.date),
                            z: (d) => d.date.getUTCMonth()
                        })
                    ),
                    Plot.text(
                        data,
                        Plot.selectFirst({
                            sort: "date",
                            x: 0,
                            y: weekNumber ? -2 : -1,
                            text:
                                W === "H"
                                    ? (d) =>
                                        d.date.getUTCFullYear() +
                                        (d.date.getUTCMonth() < 6 ? " H1" : "H2")
                                    : (d) => `${d.date.getUTCFullYear()}`,
                            textAnchor: "end",
                            fontWeight: "bold",
                            dx: -14
                        })
                    )
                ],

                // week numbers
                weekNumber
                    ? Plot.text(
                        data,
                        Plot.selectFirst({
                            filter: (d) => d.date.getUTCDay() === (weekStart + 6) % 7,
                            x: (d) => weekX(d.date),
                            y: -1,
                            text: (d) => weekNumberFormat(d.date),
                            fontSize: 7,
                            fill: "grey",
                            z: (d) => weekNumberFormat(d.date)
                        })
                    )
                    : null
            ]
        });

        p.appendChild(html`<style>.plot text { pointer-events: none }`);

        return p;
    },
};

export default Calendar;
