export const getFormatDate = (date) => {
    if (!date) return "-"; // null/undefined safety
    const d = new Date(date);
    return isNaN(d.getTime()) ? "-" : d.toLocaleDateString();
};

export const getDateInputValue = (dateTime) => {
    if (!dateTime) return "";
    return dateTime.split("T")[0];
};