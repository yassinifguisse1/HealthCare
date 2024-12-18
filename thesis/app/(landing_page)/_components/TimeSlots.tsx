"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

type TimeSlotsProps = {
  date: Date
  doctorId: string
  onTimeSelect: (time: string) => void
}

export function TimeSlots({ date, doctorId, onTimeSelect }: TimeSlotsProps) {
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  useEffect(() => {
    // Here you would typically fetch available time slots from your backend
    // For this example, we'll use dummy data
    const dummySlots = [
      "09:00 AM", "10:00 AM", "11:00 AM",
      "02:00 PM", "03:00 PM", "04:00 PM"
    ]
    setAvailableSlots(dummySlots)
  }, [date, doctorId])

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    onTimeSelect(time)
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {availableSlots.map((time) => (
        <Button
          key={time}
          variant={selectedTime === time ? "default" : "outline"}
          onClick={() => handleTimeSelect(time)}
        >
          {time}
        </Button>
      ))}
    </div>
  )
}

