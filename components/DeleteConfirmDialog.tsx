"use client";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, Loader2, Trash, X } from "lucide-react";

interface DeleteConfirmDialogProps {
    readonly open: boolean;
    readonly onOpenChange: (open: boolean) => void;
    readonly onConfirm: () => void;
    readonly loading?: boolean;

    readonly title?: string;
    readonly description?: string;

    readonly itemName?: string;
    readonly children?: React.ReactNode;
}

export default function DeleteConfirmDialog({
    open,
    onOpenChange,
    onConfirm,
    loading = false,
    title = "Delete Item",
    description = "This action cannot be undone.",
    itemName,
    children,
}: DeleteConfirmDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete {itemName}? {description}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                            <div>
                                <h3 className="font-medium text-red-800">Warning</h3>
                                <p className="text-sm text-red-700 mt-1">
                                    This {itemName} will be permanently deleted.
                                </p>
                            </div>
                        </div>
                    </div>

                    {children}
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                    </Button>

                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}