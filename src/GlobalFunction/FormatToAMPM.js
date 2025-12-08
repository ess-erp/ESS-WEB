export const getFormatToAMPM = (time) => {
    if (!time) return "-"; // handle null/undefined

    const [hour, minute] = time.split(":");
    const h = ((+hour + 11) % 12) + 1;
    const ampm = +hour >= 12 ? "PM" : "AM";

    return `${h}:${minute} ${ampm}`;
};