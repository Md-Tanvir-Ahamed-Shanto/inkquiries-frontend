"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import backendUrl from '@/utils/baseUrl';

const Subscription = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('hostedPage');
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [plansLoading, setPlansLoading] = useState(true);
  const router = useRouter();

  // Fetch subscription plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/artists/promotion`);
        setPlans(response.data.plans);
        if (response.data.plans.length > 0) {
          setSelectedPlan(response.data.plans[0]);
        }
      } catch (err) {
        setError('Failed to load subscription plans');
        console.error(err);
      } finally {
        setPlansLoading(false);
      }
    };
    
    fetchPlans();
  }, []);

  // Get subscription amount from selected plan
  const subscriptionAmount = selectedPlan ? selectedPlan.price : 0;

  // Card details state
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: ''
  });
  
  // Card validation state
  const [cardValidation, setCardValidation] = useState({
    cardNumber: { isValid: true, message: '' },
    expiryMonth: { isValid: true, message: '' },
    expiryYear: { isValid: true, message: '' },
    cvv: { isValid: true, message: '' },
    cardholderName: { isValid: true, message: '' }
  });

  // Handle card input changes with validation
  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    let isValid = true;
    let message = '';
    
    // Format and validate based on field type
    if (name === 'cardNumber') {
      // Remove non-digits and format with spaces
      formattedValue = value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').trim();
      
      // Validate card number (simple length check)
      if (formattedValue.replace(/\s/g, '').length > 0 && formattedValue.replace(/\s/g, '').length < 13) {
        isValid = false;
        message = 'Card number must be at least 13 digits';
      } else if (formattedValue.replace(/\s/g, '').length > 19) {
        isValid = false;
        message = 'Card number cannot exceed 19 digits';
        formattedValue = formattedValue.substring(0, 19 + Math.floor(19/4));
      }
    } else if (name === 'expiryMonth') {
      // Remove non-digits
      formattedValue = value.replace(/\D/g, '');
      
      // Validate month (1-12)
      const month = parseInt(formattedValue, 10);
      if (formattedValue && (isNaN(month) || month < 1 || month > 12)) {
        isValid = false;
        message = 'Month must be between 1-12';
      }
      
      // Limit to 2 digits
      if (formattedValue.length > 2) {
        formattedValue = formattedValue.substring(0, 2);
      }
    } else if (name === 'expiryYear') {
      // Remove non-digits
      formattedValue = value.replace(/\D/g, '');
      
      // Validate year (current year or later)
      const currentYear = new Date().getFullYear();
      const year = parseInt(formattedValue, 10);
      if (formattedValue && (isNaN(year) || year < currentYear)) {
        isValid = false;
        message = `Year must be ${currentYear} or later`;
      }
      
      // Limit to 4 digits
      if (formattedValue.length > 4) {
        formattedValue = formattedValue.substring(0, 4);
      }
    } else if (name === 'cvv') {
      // Remove non-digits
      formattedValue = value.replace(/\D/g, '');
      
      // Validate CVV (3-4 digits)
      if (formattedValue && formattedValue.length < 3) {
        isValid = false;
        message = 'CVV must be at least 3 digits';
      } else if (formattedValue.length > 4) {
        formattedValue = formattedValue.substring(0, 4);
      }
    }
    
    // Update card data with formatted value
    setCardData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
    
    // Update validation state
    setCardValidation(prev => ({
      ...prev,
      [name]: { isValid, message }
    }));
    
    // Clear any previous errors/success messages
    setError(null);
    setSuccess(null);
  };

  // Handle payment method selection
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setError(null);
    setSuccess(null);
  };

  // Process subscription payment
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!selectedPlan) {
      setError('Please select a subscription plan');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `${backendUrl}/api/payments/subscription`,
        { 
          planId: selectedPlan.id,
          paymentMethod: paymentMethod === 'hostedPage' ? 'hostedPage' : paymentMethod, 
          cardData: paymentMethod === 'card' ? {
            number: cardData.cardNumber.replace(/\s/g, ''),
            expirationMonth: cardData.expiryMonth,
            expirationYear: cardData.expiryYear,
            cvv: cardData.cvv,
            cardholderName: cardData.cardholderName
          } : undefined
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (paymentMethod === 'hostedPage' && response.data.paymentPageHtml) {
        // Create a temporary container and write the HTML response
        // This is necessary because the response is a full HTML page with a form that auto-submits
        document.open();
        document.write(response.data.paymentPageHtml);
        document.close();
        return;
      } else if (paymentMethod === 'hostedPage' && response.data.paymentPageUrl) {
        window.location.href = response.data.paymentPageUrl;
        return;
      }

      setSuccess('Subscription payment processed successfully!');
      // Store the response data for displaying mock payment notice
      setResponseData(response.data);
      setCardData({
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        cardholderName: ''
      });
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold mb-6">Artist Subscription</h2>
      
      {plansLoading ? (
        <div className="text-center py-8">Loading subscription plans...</div>
      ) : error && !plans.length ? (
        <div className="text-center py-4 text-red-500">{error}</div>
      ) : (
        <div className="mb-6">
          <h3 className="font-medium mb-4">Select a Subscription Plan</h3>
          <div className="space-y-4">
            {plans.map((plan) => (
              <div 
                key={plan.id} 
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 ${
                  selectedPlan?.id === plan.id 
                    ? 'border-black bg-slate-50 shadow-lg transform scale-105' 
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                } ${
                  plan.recommended ? 'relative' : ''
                }`}
                onClick={() => setSelectedPlan(plan)}
              >
                {plan.recommended && (
                  <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                    RECOMMENDED
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{plan.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
                    <div className="mt-2">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">{plan.duration} months</span>
                    </div>
                    <ul className="mt-3 space-y-1">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="text-sm flex items-center">
                          <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="text-xl font-bold">${plan.price}<span className="text-sm text-gray-500 font-normal">/month</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mb-6">
        <h3 className="font-medium mb-3">Payment Method</h3>
        <div className="flex flex-wrap gap-4">
          <button
            type="button"
            onClick={() => handlePaymentMethodChange('card')}
            disabled={paymentMethod === 'hostedPage'}
            className={`flex items-center px-4 py-3 border rounded-lg transition-colors ${paymentMethod === 'card'
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-300 hover:bg-gray-50'}`}
          >
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
            </svg>
            Credit Card
          </button>
          <button
            type="button"
            onClick={() => handlePaymentMethodChange('hostedPage')}
            className={`flex items-center px-4 py-3 border rounded-lg transition-colors ${paymentMethod === 'hostedPage'
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-300 hover:bg-gray-50'}`}
          >
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z"></path>
            </svg>
            Hosted Payment Page
          </button>
        </div>
      </div>

      {paymentMethod === 'card' && (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Card Number
            </label>
            <input
              type="text"
              name="cardNumber"
              value={cardData.cardNumber}
              onChange={handleCardInputChange}
              placeholder="1234 5678 9012 3456"
              className={`w-full px-3 py-2 border rounded-md transition-colors ${
                !cardValidation.cardNumber.isValid 
                  ? 'border-red-500 bg-red-50' 
                  : cardData.cardNumber.length > 0 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-300'
              }`}
              required
            />
            {!cardValidation.cardNumber.isValid && (
              <p className="mt-1 text-sm text-red-600">{cardValidation.cardNumber.message}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cardholder Name
            </label>
            <input
              type="text"
              name="cardholderName"
              value={cardData.cardholderName}
              onChange={handleCardInputChange}
              placeholder="John Doe"
              className={`w-full px-3 py-2 border rounded-md transition-colors ${
                !cardValidation.cardholderName.isValid 
                  ? 'border-red-500 bg-red-50' 
                  : cardData.cardholderName.length > 0 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-300'
              }`}
              required
            />
            {!cardValidation.cardholderName.isValid && (
              <p className="mt-1 text-sm text-red-600">{cardValidation.cardholderName.message}</p>
            )}
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Month
              </label>
              <input
                type="text"
                name="expiryMonth"
                value={cardData.expiryMonth}
                onChange={handleCardInputChange}
                placeholder="MM"
                className={`w-full px-3 py-2 border rounded-md transition-colors ${
                  !cardValidation.expiryMonth.isValid 
                    ? 'border-red-500 bg-red-50' 
                    : cardData.expiryMonth.length > 0 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-300'
                }`}
                required
              />
              {!cardValidation.expiryMonth.isValid && (
                <p className="mt-1 text-sm text-red-600">{cardValidation.expiryMonth.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Year
              </label>
              <input
                type="text"
                name="expiryYear"
                value={cardData.expiryYear}
                onChange={handleCardInputChange}
                placeholder="YYYY"
                className={`w-full px-3 py-2 border rounded-md transition-colors ${
                  !cardValidation.expiryYear.isValid 
                    ? 'border-red-500 bg-red-50' 
                    : cardData.expiryYear.length > 0 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-300'
                }`}
                required
              />
              {!cardValidation.expiryYear.isValid && (
                <p className="mt-1 text-sm text-red-600">{cardValidation.expiryYear.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CVV
              </label>
              <input
                type="text"
                name="cvv"
                value={cardData.cvv}
                onChange={handleCardInputChange}
                placeholder="123"
                className={`w-full px-3 py-2 border rounded-md transition-colors ${
                  !cardValidation.cvv.isValid 
                    ? 'border-red-500 bg-red-50' 
                    : cardData.cvv.length > 0 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-300'
                }`}
                required
              />
              {!cardValidation.cvv.isValid && (
                <p className="mt-1 text-sm text-red-600">{cardValidation.cvv.message}</p>
              )}
            </div>
          </div>

          {success && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md flex flex-col">
          <div>{success}</div>
          {responseData?.isMockPayment && (
            <div className="mt-2 text-sm bg-yellow-100 p-2 rounded">
              <strong>Note:</strong> This is a mock payment for testing purposes. No actual charges were made.
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400"
      >
        {loading ? 'Processing...' : `Pay $${subscriptionAmount}`}
      </button>
        </form>
      )}

      {paymentMethod === 'hostedPage' && (
        <div className="text-center">
          <p className="mb-4 text-gray-600">
            You'll be redirected to our secure payment page to complete your subscription.
          </p>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400"
          >
            {loading ? 'Redirecting...' : 'Continue to Payment'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Subscription;