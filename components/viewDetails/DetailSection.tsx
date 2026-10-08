'use client'

type DetailSectionProps = {
    readonly title: string;
    readonly children: React.ReactNode;
};

export function DetailSection({ title, children }: DetailSectionProps) {
    return (
        <div className="rounded-lg border bg-card">
            <div className="border-b px-5 py-4">
                <h3 className="font-semibold">{title}</h3>
            </div>

            <div className="px-5">
                {children}
            </div>
        </div>
    );
}