import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"

type ProgressDialogProps = {
  isOpen: boolean;
  progress: number;
  editingDoctor: boolean;
}

export function ProgressDialog({ isOpen, progress,editingDoctor }: ProgressDialogProps) {
  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editingDoctor ? "Updating Doctor" : "Adding Doctor"}</DialogTitle>
        </DialogHeader>
        <div className="w-full py-4">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-center mt-2">
            {progress < 100
              ? `Progress: ${progress}%`
              : "Doctor added successfully!"}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}