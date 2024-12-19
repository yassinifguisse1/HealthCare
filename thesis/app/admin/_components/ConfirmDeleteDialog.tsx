import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
   
  } from "@/components/ui/dialog"
  import { Button } from "@/components/ui/button";

type ConfirmDeleteDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  doctorName: string;
  isLoading:boolean
};

export function ConfirmDeleteDialog({ isOpen, onClose, onConfirm,doctorName ,isLoading}: ConfirmDeleteDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger> */}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete Dr. {doctorName}? This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirm}
              className="ml-2"
              disabled={isLoading} // Disable button if loading
            >
              {isLoading ? "Deleting..." : "Delete"} {/* Show loading text */}
            </Button>
          </div>{" "}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}