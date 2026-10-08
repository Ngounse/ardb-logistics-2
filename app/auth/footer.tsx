import gitInfo from "@/src/generated/git-info.json";

export default function Footer() {
    return (
        <div className="fixed bottom-0 left-0 w-full bg-green-100 text-center py-2 text-xs text-gray-500">
            Version: {gitInfo.hash} — {gitInfo.message}
        </div>
    );
}