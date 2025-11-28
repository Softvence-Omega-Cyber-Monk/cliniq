export const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
};
export const formatToYMD = (isoDate: string): string => {
    const date = new Date(isoDate);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};
export const formatToYMDWithTime = (isoDate: string): string => {
    const date = new Date(isoDate);

    // Format date
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    // Format time
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12; // Convert 0 => 12 for 12AM
    const hoursStr = String(hours).padStart(2, "0");

    return `${year}-${month}-${day} at ${hoursStr}:${minutes} ${ampm}`;
};
