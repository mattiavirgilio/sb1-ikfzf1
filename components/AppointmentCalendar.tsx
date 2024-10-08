import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Calendar } from "@/components/ui/calendar"

export function AppointmentCalendar() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const socket = io();

    socket.on('appointment-updated', (updatedAppointment) => {
      setAppointments(prevAppointments => 
        prevAppointments.map(apt => 
          apt.id === updatedAppointment.id ? updatedAppointment : apt
        )
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Calendar
      mode="multiple"
      selected={appointments.map(apt => new Date(apt.date))}
      // ... other props
    />
  );
}