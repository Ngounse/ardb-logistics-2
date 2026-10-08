export const Countries = [
    { code: "kh", dialCode: "+855", flag: "🇰🇭" },
    { code: "us", dialCode: "+1", flag: "🇺🇸" },
    { code: "jp", dialCode: "+81", flag: "🇯🇵" },
    {
        code: "vn",
        name: "Vietnam",
        dialCode: "+84",
        flag: "🇻🇳",
    },
    {
        code: "cn",
        name: "China",
        dialCode: "+86",
        flag: "🇨🇳",
    },

];

export const normalizePhone = (value: string, dialCode: string) => {
    let phone = value.trim();

    // Remove spaces and dashes
    phone = phone.replace(/[\s-]/g, "");

    // Remove selected country code if pasted
    if (phone.startsWith(dialCode)) {
        phone = phone.slice(dialCode.length);
    }

    // Remove leading zero
    if (phone.startsWith("0")) {
        phone = phone.slice(1);
    }

    return phone;
};