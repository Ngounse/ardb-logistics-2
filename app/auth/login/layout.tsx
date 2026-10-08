"use client";
export default function LoginLayout({
    children,
}: {
    readonly children: React.ReactNode;
}) {
    return (
        <div className="relative min-h-screen overflow-hidden">

            {/* Blurred background */}
            <div
                className="
                            absolute 
                            inset-0 
                            bg-cover 
                            bg-center 
                            bg-no-repeat 
                            blur-sm
                            scale-110
                            "
            // style={{
            //     backgroundImage: `url('${process.env.NEXT_PUBLIC_BASE_PATH
            //         ? "/" + process.env.NEXT_PUBLIC_BASE_PATH
            //         : ""
            //         }/bg/bg_01.png')`,
            // }}
            />

            {/* Dark overlay (optional) */}
            <div className="absolute inset-0 bg-black/30" />

            {/* Page content */}
            <div className="relative z-10 min-h-screen">
                {children}
            </div>

        </div>
    );
}