'use client'

type DetailRowProps = {
    readonly label: string;
    readonly value?: React.ReactNode;
    readonly last?: boolean;
};

export function DetailRow({ label, value, last }: Readonly<DetailRowProps>) {
    return (
        <div className={`grid grid-cols-1 gap-1 ${last ? '' : 'border-b'} py-3 sm:grid-cols-[220px_1fr]`}>
            <span className="text-sm font-medium text-muted-foreground my-auto">
                {label}
            </span>

            <div className="text-sm break-all">
                {value ?? "-"}
            </div>
        </div>
    );
}