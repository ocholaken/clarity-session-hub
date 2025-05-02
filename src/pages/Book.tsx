
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { toast } from "sonner";
import { Check, Phone } from "lucide-react";

const Book = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string>("individual");
  const [confirmationStep, setConfirmationStep] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

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

  const handleConfirmBooking = () => {
    setLoading(true);
    // Simulate API call to book appointment
    setTimeout(() => {
      setLoading(false);
      toast.success("Appointment booked successfully! We'll confirm via SMS at 0769331729.", {
        duration: 5000,
      });
      setConfirmationStep(false);
      setDate(undefined);
      setSelectedTime(null);
    }, 1500);
  };

  const selectedServiceData = services.find((service) => service.id === selectedService);

  if (confirmationStep && date && selectedTime) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <section className="py-12 md:py-20 bg-lavender-50">
            <div className="container">
              <div className="max-w-3xl mx-auto text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">Confirm Your Booking</h1>
                <p className="text-xl text-gray-600">
                  Please review your session details below
                </p>
              </div>
            </div>
          </section>

          <section className="py-12">
            <div className="container">
              <div className="max-w-xl mx-auto">
                <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-6">
                  <h2 className="text-2xl font-bold mb-6">Appointment Details</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-4">
                      <span className="text-gray-600">Service:</span>
                      <span className="font-medium">{selectedServiceData?.name}</span>
                    </div>
                    
                    <div className="flex items-center justify-between border-b pb-4">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">{date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    
                    <div className="flex items-center justify-between border-b pb-4">
                      <span className="text-gray-600">Time:</span>
                      <span className="font-medium">{selectedTime}</span>
                    </div>
                    
                    <div className="flex items-center justify-between border-b pb-4">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{selectedServiceData?.duration}</span>
                    </div>
                    
                    <div className="flex items-center justify-between border-b pb-4">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-semibold text-lavender-600">{selectedServiceData?.price}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 mr-2 text-lavender-600" />
                        <span className="text-gray-600">Confirmation via:</span>
                      </div>
                      <span className="font-medium">0769331729</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    className="bg-lavender-500 hover:bg-lavender-600 text-white px-8 py-6 text-lg flex-1"
                    onClick={handleConfirmBooking}
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Confirm Booking"}
                    {!loading && <Check className="ml-2" />}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="border-lavender-300 text-lavender-600 hover:bg-lavender-50 px-8 py-6 text-lg flex-1"
                    onClick={() => setConfirmationStep(false)}
                    disabled={loading}
                  >
                    Back
                  </Button>
                </div>
                
                <p className="mt-6 text-sm text-center text-gray-500">
                  By confirming, you agree to our booking terms and conditions.
                  A confirmation SMS will be sent to 0769331729.
                </p>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

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
                  <div className="flex justify-center items-center mb-4">
                    <Phone className="h-5 w-5 mr-2 text-lavender-600" />
                    <p className="text-gray-600">Confirmation will be sent to: <span className="font-medium">0769331729</span></p>
                  </div>
                  <Button 
                    className="bg-lavender-500 hover:bg-lavender-600 text-white px-8 py-6 text-lg"
                    disabled={!date || !selectedTime}
                    onClick={() => setConfirmationStep(true)}
                  >
                    Continue to Confirm
                  </Button>
                  <p className="mt-4 text-gray-500 text-sm">
                    You'll receive a confirmation SMS once your appointment is scheduled.
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
