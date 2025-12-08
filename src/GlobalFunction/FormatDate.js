export const getFormatDate = (date) => {
    if (!date) return "-"; // null/undefined safety
    const d = new Date(date);
    return isNaN(d.getTime()) ? "-" : d.toLocaleDateString();
};