"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@clerk/nextjs'
import { format } from 'date-fns'
import axios from 'axios'


type TimeSlotsProps = {
  date: Date
  doctorId: string
  onTimeSelect: (time: string) => void
}

export function TimeSlots({ date, doctorId, onTimeSelect }: TimeSlotsProps) {
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { getToken } = useAuth()
  
  useEffect(() => {
    const fetchTimeSlots = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = await getToken({ template: "TOKEN_Healthcare" });
        const response = await axios.get(`/api/timeslots/${doctorId}`, {
          params: { date: format(date, "yyyy-MM-dd") },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
       
        setAvailableSlots(response.data);
      } catch (err) {
        console.error("Error fetching time slots:", err);
        setError("Failed to load available time slots");
      } finally {
        setIsLoading(false);
      }
    };

    if (date && doctorId) {
      fetchTimeSlots();
    }
  }, [date, doctorId, getToken]);

  const handleTimeSelect = (time: string, event: React.MouseEvent) => {
    event.preventDefault();
    setSelectedTime(time);
    onTimeSelect(time);
  };

  if (isLoading) {
    return <div>Loading available time slots...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }
  if (availableSlots.length === 0) {
    return <div className="text-center text-gray-500">No available slots for this date</div>
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {availableSlots.map((time) => (
        <Button
          key={time}
          variant={selectedTime === time ? "default" : "outline"}
          onClick={(e) => handleTimeSelect(time, e)}
        >
          {time}
        </Button>
      ))}
    </div>
  );
}

