import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import toast from 'react-hot-toast';
import { 
  User, 
  MapPin, 
  Calendar, 
  Plane, 
  Hotel, 
  Plus, 
  Trash2, 
  Download,
  Loader2,
  Users,
  Phone,
  Mail
} from 'lucide-react';
import { itineraryAPI } from '../services/api';

const ItineraryForm = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPDF, setGeneratedPDF] = useState(null);

  const { 
    register, 
    control, 
    handleSubmit, 
    formState: { errors } 
  } = useForm({
    defaultValues: {
      userDetails: {
        name: '',
        email: '',
        phone: '',
        numberOfTravelers: 1
      },
      tripDetails: {
        destination: '',
        departureFrom: '',
        departureDate: '',
        arrivalDate: '',
        numberOfDays: 1,
        numberOfNights: 0,
        tripType: 'leisure'
      },
      activities: [
        {
          activityId: 'act_1',
          activityName: '',
          description: '',
          day: 1,
          timeSlot: 'Morning',
          price: 0,
          duration: '',
          notes: ''
        }
      ],
      flights: [],
      hotels: [],
      additionalServices: {
        scopeOfServices: [],
        specialNotes: '',
        paymentPlan: {
          totalAmount: 0,
          currency: 'INR',
          installments: []
        },
        visa: {
          required: false,
          type: '',
          validity: '',
          processingDate: null
        }
      }
    }
  });

  const { 
    fields: activityFields, 
    append: appendActivity, 
    remove: removeActivity 
  } = useFieldArray({
    control,
    name: 'activities'
  });

  const { 
    fields: flightFields, 
    append: appendFlight, 
    remove: removeFlight 
  } = useFieldArray({
    control,
    name: 'flights'
  });

  const { 
    fields: hotelFields, 
    append: appendHotel, 
    remove: removeHotel 
  } = useFieldArray({
    control,
    name: 'hotels'
  });

  const onSubmit = async (data) => {
    setIsGenerating(true);
    
    try {
      console.log('📋 Form data:', data);
      
      // Calculate numberOfDays and numberOfNights
      const departureDate = new Date(data.tripDetails.departureDate);
      const arrivalDate = new Date(data.tripDetails.arrivalDate);
      const timeDiff = arrivalDate.getTime() - departureDate.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
      // Process activities to ensure proper data types
      const processedActivities = data.activities.map(activity => ({
        ...activity,
        price: Number(activity.price) || 0,
        day: Number(activity.day) || 1
      }));
      
      // Process payment plan
      const totalAmount = Number(data.additionalServices?.paymentPlan?.totalAmount) || 0;
      
      const processedData = {
        ...data,
        userDetails: {
          ...data.userDetails,
          numberOfTravelers: Number(data.userDetails.numberOfTravelers) || 1
        },
        tripDetails: {
          ...data.tripDetails,
          numberOfDays: daysDiff + 1,
          numberOfNights: daysDiff
        },
        activities: processedActivities,
        additionalServices: {
          ...data.additionalServices,
          paymentPlan: {
            ...data.additionalServices.paymentPlan,
            totalAmount: totalAmount,
            currency: data.additionalServices?.paymentPlan?.currency || 'INR'
          }
        }
      };

      console.log('📤 Processed data:', processedData);

      const result = await itineraryAPI.generateItinerary(processedData);
      
      if (result.success) {
        setGeneratedPDF(result.data);
        toast.success('Itinerary generated successfully!');
      } else {
        toast.error(result.error || 'Failed to generate itinerary');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const addActivity = () => {
    appendActivity({
      activityId: `act_${Date.now()}`,
      activityName: '',
      description: '',
      day: 1,
      timeSlot: 'Morning',
      price: 0,
      duration: '',
      notes: ''
    });
  };

  const addFlight = () => {
    appendFlight({
      date: '',
      airline: '',
      route: '',
      flightNumber: '',
      departureTime: '',
      arrivalTime: '',
      class: 'Economy'
    });
  };

  const addHotel = () => {
    appendHotel({
      city: '',
      checkIn: '',
      checkOut: '',
      nights: 1,
      hotelName: '',
      roomType: 'Standard',
      address: ''
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Create Your Perfect Itinerary
        </h1>
        <p className="text-xl text-white/80 max-w-2xl mx-auto">
          Tell us about your dream trip and we'll create a detailed itinerary for you
        </p>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* User Details Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center mb-6">
            <User className="h-6 w-6 text-vigovia-primary mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">Traveler Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                {...register('userDetails.name', { required: 'Name is required' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vigovia-accent focus:border-transparent"
                placeholder="Enter your full name"
              />
              {errors.userDetails?.name && (
                <p className="text-red-500 text-sm mt-1">{errors.userDetails.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-vigovia-accent" />
                <input
                  type="email"
                  {...register('userDetails.email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vigovia-accent focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>
              {errors.userDetails?.email && (
                <p className="text-red-500 text-sm mt-1">{errors.userDetails.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-5 w-5 text-vigovia-accent" />
                <input
                  type="tel"
                  {...register('userDetails.phone', { required: 'Phone number is required' })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vigovia-accent focus:border-transparent"
                  placeholder="+91 9999999999"
                />
              </div>
              {errors.userDetails?.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.userDetails.phone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Travelers *
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-3 h-5 w-5 text-vigovia-accent" />
                <input
                  type="number"
                  min="1"
                  max="50"
                  {...register('userDetails.numberOfTravelers', { 
                    required: 'Number of travelers is required',
                    min: { value: 1, message: 'At least 1 traveler required' }
                  })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vigovia-accent focus:border-transparent"
                />
              </div>
              {errors.userDetails?.numberOfTravelers && (
                <p className="text-red-500 text-sm mt-1">{errors.userDetails.numberOfTravelers.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Trip Details Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center mb-6">
            <MapPin className="h-6 w-6 text-vigovia-primary mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">Trip Details</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destination *
              </label>
              <input
                type="text"
                {...register('tripDetails.destination', { required: 'Destination is required' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vigovia-accent focus:border-transparent"
                placeholder="e.g., Singapore"
              />
              {errors.tripDetails?.destination && (
                <p className="text-red-500 text-sm mt-1">{errors.tripDetails.destination.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Departure From *
              </label>
              <input
                type="text"
                {...register('tripDetails.departureFrom', { required: 'Departure location is required' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vigovia-accent focus:border-transparent"
                placeholder="e.g., Delhi"
              />
              {errors.tripDetails?.departureFrom && (
                <p className="text-red-500 text-sm mt-1">{errors.tripDetails.departureFrom.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trip Type
              </label>
              <select
                {...register('tripDetails.tripType')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vigovia-accent focus:border-transparent"
              >
                <option value="leisure">Leisure</option>
                <option value="business">Business</option>
                <option value="adventure">Adventure</option>
                <option value="cultural">Cultural</option>
                <option value="romantic">Romantic</option>
                <option value="family">Family</option>
                <option value="exploration">Exploration</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Departure Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-vigovia-accent" />
                <input
                  type="date"
                  {...register('tripDetails.departureDate', { required: 'Departure date is required' })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vigovia-accent focus:border-transparent bg-white"
                />
              </div>
              {errors.tripDetails?.departureDate && (
                <p className="text-red-500 text-sm mt-1">{errors.tripDetails.departureDate.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Return Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-vigovia-accent" />
                <input
                  type="date"
                  {...register('tripDetails.arrivalDate', { required: 'Return date is required' })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vigovia-accent focus:border-transparent bg-white"
                />
              </div>
              {errors.tripDetails?.arrivalDate && (
                <p className="text-red-500 text-sm mt-1">{errors.tripDetails.arrivalDate.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Activities Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <MapPin className="h-6 w-6 text-vigovia-primary mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">Activities & Experiences</h2>
            </div>
            <button
              type="button"
              onClick={addActivity}
              className="flex items-center px-4 py-2 bg-vigovia-primary text-white rounded-lg hover:bg-vigovia-secondary transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Activity
            </button>
          </div>

          <div className="space-y-6">
            {activityFields.map((field, index) => (
              <div key={field.id} className="border border-gray-200 rounded-lg p-6 bg-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Activity {index + 1}</h3>
                  {activityFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeActivity(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Activity Name *
                    </label>
                    <input
                      type="text"
                      {...register(`activities.${index}.activityName`, { required: 'Activity name is required' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vigovia-accent focus:border-transparent"
                      placeholder="e.g., Marina Bay Sands Sky Park"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Day
                    </label>
                    <input
                      type="number"
                      min="1"
                      {...register(`activities.${index}.day`, { required: true })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vigovia-accent focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time Slot
                    </label>
                    <select
                      {...register(`activities.${index}.timeSlot`)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vigovia-accent focus:border-transparent"
                    >
                      <option value="Morning">Morning</option>
                      <option value="Afternoon">Afternoon</option>
                      <option value="Evening">Evening</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      {...register(`activities.${index}.description`)}
                      rows="2"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vigovia-accent focus:border-transparent"
                      placeholder="Brief description of the activity"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      {...register(`activities.${index}.price`)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vigovia-accent focus:border-transparent"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration
                    </label>
                    <input
                      type="text"
                      {...register(`activities.${index}.duration`)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vigovia-accent focus:border-transparent"
                      placeholder="e.g., 2-3 hours"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Flights Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Plane className="h-6 w-6 text-vigovia-primary mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">Flight Information</h2>
            </div>
            <button
              type="button"
              onClick={addFlight}
              className="flex items-center px-4 py-2 bg-vigovia-primary text-white rounded-lg hover:bg-vigovia-secondary transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Flight
            </button>
          </div>

          {flightFields.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No flights added yet. Click "Add Flight" to add flight details.</p>
          ) : (
            <div className="space-y-4">
              {flightFields.map((field, index) => (
                <div key={field.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Flight {index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeFlight(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                      <input
                        type="date"
                        {...register(`flights.${index}.date`)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vigovia-accent focus:border-transparent bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Airline</label>
                      <input
                        type="text"
                        {...register(`flights.${index}.airline`)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vigovia-accent focus:border-transparent"
                        placeholder="e.g., Air India"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Route</label>
                      <input
                        type="text"
                        {...register(`flights.${index}.route`)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vigovia-accent focus:border-transparent"
                        placeholder="From Delhi (DEL) To Singapore (SIN)"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Flight Number</label>
                      <input
                        type="text"
                        {...register(`flights.${index}.flightNumber`)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vigovia-accent focus:border-transparent"
                        placeholder="e.g., AI 345"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Hotels Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Hotel className="h-6 w-6 text-vigovia-primary mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">Hotel Bookings</h2>
            </div>
            <button
              type="button"
              onClick={addHotel}
              className="flex items-center px-4 py-2 bg-vigovia-primary text-white rounded-lg hover:bg-vigovia-secondary transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Hotel
            </button>
          </div>

          {hotelFields.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No hotels added yet. Click "Add Hotel" to add accommodation details.</p>
          ) : (
            <div className="space-y-4">
              {hotelFields.map((field, index) => (
                <div key={field.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Hotel {index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeHotel(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <input
                        type="text"
                        {...register(`hotels.${index}.city`)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vigovia-accent focus:border-transparent"
                        placeholder="e.g., Singapore"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Check In</label>
                      <input
                        type="date"
                        {...register(`hotels.${index}.checkIn`)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vigovia-accent focus:border-transparent bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Check Out</label>
                      <input
                        type="date"
                        {...register(`hotels.${index}.checkOut`)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vigovia-accent focus:border-transparent bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nights</label>
                      <input
                        type="number"
                        min="1"
                        {...register(`hotels.${index}.nights`)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vigovia-accent focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Hotel Name</label>
                      <input
                        type="text"
                        {...register(`hotels.${index}.hotelName`)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vigovia-accent focus:border-transparent"
                        placeholder="e.g., Super Townhouse Oak"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payment Information */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Amount (₹)
              </label>
              <input
                type="number"
                min="0"
                {...register('additionalServices.paymentPlan.totalAmount')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vigovia-accent focus:border-transparent"
                placeholder="Enter total package cost"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Notes
              </label>
              <textarea
                {...register('additionalServices.specialNotes')}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vigovia-accent focus:border-transparent"
                placeholder="Any special requirements or notes"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            disabled={isGenerating}
            className="inline-flex items-center px-12 py-4 bg-vigovia-primary text-white text-lg font-semibold rounded-full hover:bg-vigovia-secondary transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-6 w-6 mr-3 animate-spin" />
                Generating Itinerary...
              </>
            ) : (
              <>
                <Download className="h-6 w-6 mr-3" />
                Generate Itinerary PDF
              </>
            )}
          </button>
        </div>
      </form>

      {/* Generated PDF Section */}
      {generatedPDF && (
        <div className="mt-12 bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              🎉 Your Itinerary is Ready!
            </h2>
            <p className="text-gray-600 mb-6">
              Your personalized travel itinerary has been generated successfully.
            </p>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <div className="text-left">
                <h3 className="font-semibold text-green-800 mb-2">Trip Summary:</h3>
                <ul className="text-green-700 space-y-1">
                  <li>📍 Destination: {generatedPDF.data.tripSummary.destination}</li>
                  <li>⏱️ Duration: {generatedPDF.data.tripSummary.duration}</li>
                  <li>👥 Travelers: {generatedPDF.data.tripSummary.travelers}</li>
                  <li>🎯 Activities: {generatedPDF.data.tripSummary.activitiesCount}</li>
                </ul>
              </div>
            </div>

            <a
              href={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}${generatedPDF.data.downloadUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-3 bg-vigovia-primary text-white font-semibold rounded-lg hover:bg-vigovia-secondary transition-all duration-200 transform hover:scale-105"
            >
              <Download className="h-5 w-5 mr-2" />
              Download PDF
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItineraryForm;
