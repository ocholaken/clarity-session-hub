
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";

const Book = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string>("individual");

  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", 
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"
  ];

  const services = [
    { id: "individual", name: "Individual Therapy", price: "$85", duration: "50 minutes" },
    { id: "couples", name: "Couples Counseling", price: "$120", duration: "80 minutes" },
    { id: "family", name: "Family Therapy", price: "$150", duration: "90 minutes" },
    { id: "group", name: "Group Therapy", price: "$60", duration: "120 minutes" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <section className="py-12 md:py-20 bg-lavender-50">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Book a Session</h1>
              <p className="text-xl text-gray-600">
                Take the first step toward your mental wellness journey. Select a service, date, and time that works for you.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-6">Select Your Appointment Details</h2>
                
                {/* Service Selection */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-3">1. Choose a Service</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((service) => (
                      <div 
                        key={service.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedService === service.id 
                            ? 'border-lavender-500 bg-lavender-50' 
                            : 'border-gray-200 hover:border-lavender-300'
                        }`}
                        onClick={() => setSelectedService(service.id)}
                      >
                        <div className="font-medium">{service.name}</div>
                        <div className="flex justify-between mt-2">
                          <span className="text-lavender-600 font-semibold">{service.price}</span>
                          <span className="text-gray-500">{service.duration}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Date Selection */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-3">2. Choose a Date</h3>
                  <div className="flex justify-center">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-md border"
                      disabled={(date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return (
                          date < today ||
                          date.getDay() === 0 // Disable Sundays
                        );
                      }}
                    />
                  </div>
                </div>
                
                {/* Time Selection */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-3">3. Choose a Time</h3>
                  {date ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {timeSlots.map((time) => (
                        <div
                          key={time}
                          className={`border rounded-md p-3 text-center cursor-pointer transition-colors ${
                            selectedTime === time
                              ? 'bg-lavender-500 text-white border-lavender-500'
                              : 'hover:border-lavender-300'
                          }`}
                          onClick={() => setSelectedTime(time)}
                        >
                          {time}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center">Please select a date first</p>
                  )}
                </div>
                
                {/* Submit Button */}
                <div className="text-center">
                  <Button 
                    className="bg-lavender-500 hover:bg-lavender-600 text-white px-8 py-6 text-lg"
                    disabled={!date || !selectedTime}
                  >
                    Confirm Booking
                  </Button>
                  <p className="mt-4 text-gray-500 text-sm">
                    You'll receive a confirmation email once your appointment is scheduled.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Book;
