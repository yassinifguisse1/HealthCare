import { useState } from 'react'
import { Star } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"; // Import dialog components
import { toast } from 'sonner'

interface AppointmentRatingProps {
  appointmentId: string
  onRatingSubmit: (appointmentId: string, rating: number) => Promise<void>
}

export function AppointmentRating({ appointmentId, onRatingSubmit }: AppointmentRatingProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false); // New state to track submission status
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Track dialog visibility

  const handleRatingSubmit = async () => {
    if (rating === 0) {
      toast.error("Please select a rating before submitting")
      setIsSubmitted(true); // Mark as submitted
      return
    }

    setIsSubmitting(true)
    try {
      await onRatingSubmit(appointmentId, rating)
      setIsSubmitted(true)
      setIsDialogOpen(true); // Open the dialog on success
    } catch (error) {
      console.error("Error submitting rating:", error)
      toast.error("Failed to submit rating. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
          key={star}
          className={`w-6 h-6 ${
            (isSubmitted ? rating : hoveredRating || rating) >= star
              ? 'text-yellow-400 fill-yellow-400'
              : 'text-gray-300'
          } ${!isSubmitted ? 'cursor-pointer' : ''}`}
          onClick={() => !isSubmitted && setRating(star)}
          onMouseEnter={() => !isSubmitted && setHoveredRating(star)}
          onMouseLeave={() => !isSubmitted && setHoveredRating(0)}
        />
        ))}
      </div>
     {/* Submit Button */}
     {!isSubmitted && (
        <Button
          onClick={handleRatingSubmit}
          // Hidden 
          className={`${isSubmitting || rating === 0 ?"hidden" : "block "}`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Rating'}
        </Button>
      )}


       {/* Confirmation Dialog */}
       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thank You!</DialogTitle>
          </DialogHeader>
          <p>Your feedback has been submitted successfully.</p>
          <div className="mt-4 flex justify-end">
            <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

