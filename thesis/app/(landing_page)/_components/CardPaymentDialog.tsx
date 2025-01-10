import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle ,DialogDescription} from "@/components/ui/dialog"
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface CardPaymentDialogProps {
  isOpen: boolean
  onClose: () => void
  onPaymentSuccess: (transactionId: string) => void
  clientSecret: string | null
}

export function CardPaymentDialog({ isOpen, onClose, onPaymentSuccess, clientSecret }: CardPaymentDialogProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (!stripe || !elements) {
      return
    }
  }, [stripe, elements])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements || !clientSecret) {
      return
    }

    setIsProcessing(true)

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      })

      if (error) {
        toast.error(error.message || "An error occurred during payment.")
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        toast.success("Payment successful!")
        onPaymentSuccess(paymentIntent.id)
        onClose()
      }
    } catch (error) {
      console.error("Payment error:", error)
      toast.error("An unexpected error occurred. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Card Payment</DialogTitle>
          <DialogDescription>
            Enter your card. Click Pay Now when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {clientSecret && <PaymentElement />}
          <Button
            type="submit"
            className="w-full mt-4"
            disabled={isProcessing || !stripe || !elements}
          >
            {isProcessing ? "Processing..." : "Pay Now"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

