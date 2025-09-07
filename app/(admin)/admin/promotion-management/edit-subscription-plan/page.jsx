"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllSubscriptionPlans, updateSubscriptionPlan } from "@/service/adminApi";

export default function Page() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // Fetch subscription plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const response = await getAllSubscriptionPlans();
        
        // Format the plans data
        const formattedPlans = response.plans.map(plan => ({
          id: plan.id, // Use plan.id instead of plan._id
          title: plan.name || `Plan ${plan.duration} days`,
          days: plan.duration,
          cost: `$${plan.price}`,
          originalData: plan // Keep original data for reference
        }));
        
        setPlans(formattedPlans);
        setError(null);
      } catch (err) {
        console.error("Error fetching subscription plans:", err);
        setError("Failed to load subscription plans. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleChange = (index, field, value) => {
    const updatedPlans = [...plans];
    updatedPlans[index][field] = value;
    setPlans(updatedPlans);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveSuccess(false);
      setSaveError(null);
      
      // Process each plan and update via API
      const updatePromises = plans.map(plan => {
        // Extract price from cost string (remove $ and convert to number)
        const price = parseFloat(plan.cost.replace(/[^0-9.-]+/g, ""));
        
        return updateSubscriptionPlan(plan.id, {
          name: plan.title,
          duration: plan.days,
          price: price
        });
      });
      
      await Promise.all(updatePromises);
      setSaveSuccess(true);
      
      // Show success message briefly before hiding
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
      
    } catch (err) {
      console.error("Error saving subscription plans:", err);
      setSaveError("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-0 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <span className="text-zinc-500 text-xs sm:text-sm font-normal leading-none">
          Promotion Management /
        </span>
        <span className="text-black text-xs sm:text-sm font-normal leading-none">
          {" "}Edit Subscription Plan
        </span>
      </div>

      {/* Main Content */}
      <div className="w-full flex justify-center py-6 sm:py-8 lg:py-10">
        <div className="w-full max-w-[734px] bg-white p-4 sm:p-6 lg:p-8 rounded-2xl flex flex-col gap-6 sm:gap-8 shadow-sm">
          {/* Header */}
          <div className="flex items-center gap-4 pb-3 border-b border-gray-100">
            <Link
              href="/admin/promotion-management"
              className="w-8 h-8 bg-slate-50 rounded-full flex justify-center items-center cursor-pointer hover:bg-slate-100 transition-colors flex-shrink-0"
            >
              <img src="/icon/right-arrow.svg" className="w-4 h-4" alt="Back" />
            </Link>
            <h2 className="text-lg sm:text-xl font-semibold text-neutral-800 font-['Inter'] leading-6 sm:leading-7">
              Edit Subscription Plan
            </h2>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-zinc-800"></div>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <p>{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-2 text-sm font-medium "
              >
                Try Again
              </button>
            </div>
          )}

          {/* Success Message */}
          {saveSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              <p>Subscription plans updated successfully!</p>
            </div>
          )}

          {/* Error Message */}
          {saveError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <p>{saveError}</p>
            </div>
          )}

          {/* Plan Form */}
          {!loading && !error && (
            <div className="flex flex-col gap-6 sm:gap-8">
              {plans.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-zinc-500">No subscription plans found.</p>
                </div>
              ) : (
                plans.map((plan, idx) => (
                  <div key={plan.id || idx} className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <h3 className="text-neutral-800 text-base sm:text-lg font-semibold font-['Inter_Tight'] leading-normal">
                        {plan.title}
                      </h3>
                      <input
                        type="text"
                        value={plan.title}
                        onChange={(e) => handleChange(idx, "title", e.target.value)}
                        className="ml-2 px-2 py-1 bg-white rounded border border-zinc-200 text-neutral-800 text-sm font-normal outline-none focus:border-zinc-400 transition-colors"
                        placeholder="Plan name"
                      />
                    </div>

                    <div className="p-4 sm:p-5 bg-slate-50 rounded-xl border border-gray-100 flex flex-col gap-4 sm:gap-5">
                      <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
                        {/* Days Field */}
                        <div className="flex-1 flex flex-col gap-2">
                          <label className="text-neutral-600 text-sm font-medium font-['Inter_Tight'] leading-tight tracking-tight">
                            Days
                          </label>
                          <input
                            type="number"
                            value={plan.days}
                            onChange={(e) =>
                              handleChange(idx, "days", parseInt(e.target.value) || 0)
                            }
                            className="h-12 px-3.5 py-2 bg-white rounded-lg border border-zinc-200 text-neutral-800 text-sm sm:text-base font-normal font-['Inter_Tight'] leading-tight outline-none focus:border-zinc-400 transition-colors"
                            placeholder="Enter days"
                          />
                        </div>

                        {/* Cost Field */}
                        <div className="flex-1 flex flex-col gap-2">
                          <label className="text-neutral-600 text-sm font-medium font-['Inter_Tight'] leading-tight tracking-tight">
                            Cost
                          </label>
                          <input
                            type="text"
                            value={plan.cost}
                            onChange={(e) =>
                              handleChange(idx, "cost", e.target.value)
                            }
                            className="h-12 px-3.5 py-2 bg-white rounded-lg border border-zinc-200 text-neutral-800 text-sm sm:text-base font-normal font-['Inter_Tight'] leading-tight outline-none focus:border-zinc-400 transition-colors"
                            placeholder="Enter cost (e.g., $50)"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
                <Link
                  href="/admin/promotion-management"
                  className="w-full sm:w-auto px-6 py-3 rounded-lg border border-zinc-200 text-neutral-800 text-sm sm:text-base font-medium hover:bg-zinc-50 transition-colors text-center"
                >
                  Cancel
                </Link>
                <button 
                  onClick={handleSave}
                  disabled={saving || plans.length === 0}
                  className={`w-full sm:w-auto px-6 py-3 rounded-lg text-white text-sm sm:text-base font-semibold font-['Inter'] transition-colors ${saving || plans.length === 0 ? 'bg-zinc-400 cursor-not-allowed' : 'bg-zinc-950 hover:bg-zinc-800'}`}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
