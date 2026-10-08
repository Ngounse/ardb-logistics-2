import { toast } from "@/hooks/use-toast";
import { Loader2, Plus, Save, Trash, X } from "lucide-react";

type SubstringProps = {
    readonly item: string
    readonly substring?: number
};

export function MySubstring({
    item,
    substring = 20
}: SubstringProps) {
    if (!item) return "";
    return (
        <>
            {item.substring(0, substring)}{item.length > substring && '...'}
        </>
    );
}

export const MyHashID = (item: string = '') => {
    if (!item) return <></>
    return (
        <button type="button" className="hover:text-green-500" onClick={() => MyHandleCopy(item)}>
            #{item.substring(9, 23)}
        </button>
    );
}

export const MyShortenId = (id?: string, start = 6, end = 4) => {
    if (!id) return "-";
    if (id.length <= start + end + 3) return id;

    return `${id.substring(0, start)}...${id.substring(id.length - end)}`;
};

export const MyHandleCopy = async (text: string) => {
    try {
        if (navigator.clipboard) {
            await navigator.clipboard.writeText(text);
        } else {
            // Fallback for HTTP / unsupported browsers
            const textarea = document.createElement("textarea");
            textarea.value = text;
            textarea.style.position = "fixed";
            textarea.style.opacity = "0";
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();

            document.execCommand("copy");
            document.body.removeChild(textarea);
        }

        toast({
            title: "Copied to clipboard",
            description: "Text has been copied to the clipboard",
        });
    } catch (error) {
        console.error("Copy failed:", error);

        toast({
            title: "Copy failed",
            description: "Unable to copy the text.",
            variant: "destructive",
        });
    }
};

export const MytoUpperCase = (item: string = '') => {
    if (!item) return <></>
    return (
        <>
            {item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()}
        </>
    );
}

export const MyOptionalParams = <T,>(value: T | "all") =>
    value === "all" || value === "" ? undefined : value;

export const MyRequired = () => {
    return (
        <span className="text-red-500">*</span>
    );
}

export const MyCreate = () => {
    return (
        <>
            <Plus className="h-4 w-4 mr-2" />
            Create
        </>
    );
}

export const MyCancel = () => {
    return (
        <>
            <X className="h-4 w-4 mr-2" />
            Cancel
        </>
    );
}

export const MyClose = () => {
    return (
        <>
            <X className="h-4 w-4 mr-2" />
            Close
        </>
    );
}

export const MySave = () => {
    return (
        <>
            <Save className="h-4 w-4 mr-2" />
            Save
        </>
    );
}

export const MySaving = () => {
    return (
        <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
        </>
    );
}

export const MyDelete = () => {
    return (
        <>
            <Trash className="h-4 w-4 mr-2" />
            Delete
        </>
    );
}