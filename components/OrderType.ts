export const FormatByOrderType = (amount: number, type: string) => {
    switch (type) {
        case "FLAT":
            return FormatKHR(amount);
        case "KHR":
            return FormatKHR(amount);
        case "PERCENTAGE":
            return `${amount}%`;
        case "TIERED":
            return `(Tiered)`;
        default:
            return FormatKHR(amount);
    }
}

export const FormatKHR = (amount: number | null) => {
    if (!amount) return
    return "KHR " + new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(amount);
};