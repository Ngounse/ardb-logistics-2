import { AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";

interface Props {
    title: string;
    description: string;
    open: boolean;
    close: () => void;
}

export default function PopupAlert({
    title,
    description,
    open,
    close,
}: Props) {

    return (
        <Dialog open={open} onOpenChange={close}>
            <DialogContent className="sm:max-w-[720px]">
                <DialogHeader>
                    <DialogTitle></DialogTitle>
                    <DialogDescription>
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-medium text-red-800">Warning</h3>
                                <p className="text-sm text-red-700 mt-1">
                                    {title ? `${title} : ` : ''}{description}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={close}>
                        Okay
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}