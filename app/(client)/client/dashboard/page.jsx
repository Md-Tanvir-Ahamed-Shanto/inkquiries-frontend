"use client";

import ReviewCard from "@/components/cards/ReviewCard";
import NotificationPage from "@/components/client/NotificationPage";
import SettingPage from "@/components/client/SettingPage";
import CreateReviewPostPopup from "@/components/models/CreateReviewPostPopup";
import { getClientProfile, getClientReviews } from "@/service/clientApi";
import backendUrl from "@/utils/baseUrl";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

// Dashboard content component that uses useSearchParams
const DashboardContent = () => {
  // Get URL query parameters
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get("tab");
  
  // Set active tab based on URL query parameter or default to "reviews"
  const [active, setActive] = useState(tabParam || "reviews");
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const baseUrl = backendUrl
  const onClose = () => setIsOpen(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, []);

  const fetchData = async () => {
    try {
      if (userData.id) {
        const profileData = await getClientProfile(userData.id);
        setProfile(profileData);
      }
    } catch (error) {
      console.error(error.message || "Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      if (userData.id) {
        const reviewsData = await getClientReviews(userData.id);
        setReviews(reviewsData?.reviews);
      }
    } catch (error) {
      console.error(error.message || "Failed to fetch reviews data");
    }
  };
  useEffect(() => {
    fetchReviews();
    fetchData();
  }, [userData]);

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center p-4 md:px-28">
       <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-zinc-800"></div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col p-4 md:px-28">
      <div className="w-full p-4 md:p-8 bg-slate-50 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
        <div className="w-full md:w-96 flex flex-col sm:flex-row justify-start items-center sm:items-center gap-4 sm:gap-6 text-center sm:text-left">
          <img
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full outline outline-gray-100"
            src={
             profile?.profilePhoto ? `${baseUrl}${profile?.profilePhoto}` : "https://cdn-icons-png.flaticon.com/512/0/93.png"
            }
            alt="Profile Picture"
          />
          <div className="inline-flex flex-col justify-start items-center sm:items-start gap-1">
            <div className="self-stretch text-zinc-950 text-xl sm:text-2xl font-semibold font-['Inter'] capitalize leading-8 sm:leading-9">
              {profile?.name || "Anonymous"}
            </div>
            <div className="self-stretch flex flex-col justify-start items-center sm:items-start gap-0.5">
              <div className="self-stretch text-neutral-600 text-sm sm:text-base font-normal capitalize leading-normal">
                {profile?.location || "No location set"}
              </div>
            </div>
          </div>
        </div>
        <div className="w-full md:w-auto inline-flex flex-col justify-center items-center md:items-start gap-4">
          <button
            onClick={() => setIsOpen(true)}
            className="w-full sm:w-auto px-5 py-3 bg-zinc-950 rounded-lg inline-flex justify-center items-center gap-2.5 cursor-pointer"
          >
            <div className="w-5 h-5 relative">
              <div className="w-4 h-4 left-[1.66px] top-[1.67px] absolute outline-[1.25px] outline-offset-[-0.62px] outline-white" />
              <div className="w-1.5 h-1.5 left-[10.84px] top-[3.33px] absolute outline-[1.25px] outline-offset-[-0.62px] outline-white" />
              <div className="w-1.5 h-0 left-[11.66px] top-[18.33px] absolute outline-[1.25px] outline-offset-[-0.62px] outline-white" />
            </div>
            <div className="text-white text-base font-medium capitalize leading-normal">
              Create Review Post
            </div>
          </button>
        </div>
      </div>

      <div className="w-full py-1 md:py-5 border-zinc-200 inline-flex flex-col justify-start items-start">
        <div className="inline-flex justify-start items-center gap-12">
          <div
            className={`pt-1.5 pb-3 ${
              active === "reviews" ? "border-b-2 border-zinc-950" : ""
            } flex justify-center items-center gap-2.5`}
          >
            <div
              onClick={() => {
                setActive("reviews");
                router.push("/client/dashboard?tab=reviews");
              }}
              className="justify-start cursor-pointer text-zinc-950 text-base font-semibold capitalize leading-normal"
            >
              Reviews
            </div>
          </div>
          <div
            className={`pt-1.5 pb-3 ${
              active === "notification" ? "border-b-2 border-zinc-950" : ""
            } flex justify-center items-center gap-2.5`}
          >
            <div
              onClick={() => {
                setActive("notification");
                router.push("/client/dashboard?tab=notification");
              }}
              className="justify-start cursor-pointer text-neutral-600 text-base font-normal capitalize leading-normal"
            >
              Notification
            </div>
          </div>
          <div
            className={`pt-1.5 pb-3 ${
              active === "settings" ? "border-b-2 border-zinc-950" : ""
            } flex justify-center items-center gap-2.5`}
          >
            <div
              onClick={() => {
                setActive("settings");
                router.push("/client/dashboard?tab=settings");
              }}
              className="justify-start cursor-pointer text-neutral-600 text-base font-normal capitalize leading-normal"
            >
              Settings
            </div>
          </div>
        </div>
      </div>

      <div className="">
        {active === "reviews" && (
          <>
            {reviews?.length > 0 ? (
              <div className="columns-1 md:columns-2 xl:columns-3 gap-6 space-y-6">
                {reviews?.map((review, index) => (
                  <div
                    key={review.id || index}
                    className="break-inside-avoid mb-6"
                  >
                    <ReviewCard item={review} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full flex justify-center items-center p-4 md:px-28">
                No reviews found
              </div>
            )}
          </>
        )}
        {active === "notification" && <NotificationPage />}
        {active === "settings" && <SettingPage onSubmit={fetchData} />}
      </div>

      {isOpen && (
        <CreateReviewPostPopup
          onClose={onClose}
          onSuccess={() => {
            fetchReviews();
            onClose();
          }}
        />
      )}
    </div>
  );
};

// Main ClientDashboard component with Suspense boundary
const ClientDashboard = () => {
  return (
    <Suspense fallback={<div className="w-full flex justify-center items-center p-4 md:px-28">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-zinc-800"></div>
    </div>}>
      <DashboardContent />
    </Suspense>
  );
};

export default ClientDashboard;
