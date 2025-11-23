import { formatDate } from "./formatDate";

export const getDateRangeParams = (tab: string) => {
    const today = new Date();
    const endDate = formatDate(today);

    const days = tab === "Week" ? 7 : 30;
    const start = new Date();
    start.setDate(start.getDate() - days);
    const startDate = formatDate(start);

    return { startDate, endDate };
};