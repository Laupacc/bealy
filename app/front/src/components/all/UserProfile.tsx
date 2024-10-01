"use client";
import React, { useState, useEffect } from "react";
import api from "../../services/api";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface UserInfo {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  description: string;
  profilePicture: string;
  showProfile: boolean;
}

interface UserProfileProps {
  userInfo: UserInfo | null;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo | null>>;
  children?: React.ReactNode;
}

export default function UserProfile({
  userInfo,
  setUserInfo,
  children,
}: UserProfileProps) {
  const router = useRouter();
  const [userID, setUserID] = useState<string | null>(null);
  const [editProfile, setEditProfile] = useState(false);
  const [formData, setFormData] = useState({
    firstName: userInfo?.firstName,
    lastName: userInfo?.lastName,
    email: userInfo?.email,
    age: userInfo?.age,
    description: userInfo?.description,
    profilePicture: userInfo?.profilePicture,
  });

  // Get userID from localStorage on component mount
  useEffect(() => {
    const id =
      typeof window !== "undefined" ? localStorage.getItem("id") : null;
    setUserID(id);
  }, []);

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Change profile visibility
  const toggleProfileVisibility = async () => {
    if (!userID) return;

    try {
      const updatedVisibility = !userInfo?.showProfile;
      if (userInfo) {
        setUserInfo({ ...userInfo, showProfile: updatedVisibility });
      }
      console.log("Profile visibility updated:", updatedVisibility);

      await api.put(`/auth/${userID}/userInfo`, {
        showProfile: updatedVisibility,
      });
    } catch (error) {
      console.error("Error updating profile visibility:", error);
    }
  };

  // Update user profile
  const updateUserProfile = async () => {
    if (!userID) return;

    // Object with the updated fields
    const updatedFields = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      age: formData.age,
      description: formData.description,
      profilePicture: formData.profilePicture,
    };

    // Filter out fields that are undefined or null (unchanged)
    const filteredFields = Object.fromEntries(
      Object.entries(updatedFields).filter(([_, value]) => value != null)
    );

    try {
      // Update user profile
      await api.put(`/auth/${userID}/userInfo`, filteredFields);

      // Update local state
      if (userInfo) {
        setUserInfo({ ...userInfo, ...filteredFields });
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  // Randomize profile picture and save to database
  const randomizeProfilePicture = async () => {
    if (!userID) return;

    // Generate random picture
    const randomIndex = Math.floor(Math.random() * 1000) + 1;
    const newProfilePictureUrl = `https://picsum.photos/id/${randomIndex}/200/200`;

    try {
      await api.put(`/auth/${userID}/userInfo`, {
        profilePicture: newProfilePictureUrl,
      });

      // Update local state
      setFormData({
        ...formData,
        profilePicture: newProfilePictureUrl,
      });

      if (userInfo) {
        setUserInfo({ ...userInfo, profilePicture: newProfilePictureUrl });
      }

      console.log(
        "Profile picture randomized and saved:",
        newProfilePictureUrl
      );
    } catch (error) {
      console.error("Error saving randomized profile picture:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post(`/auth/logout`);
      localStorage.removeItem("id");
      localStorage.removeItem("randomColor");
      Cookies.remove("token");
      setUserInfo(null);
      router.refresh();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <Sheet>
      <SheetTrigger>{children}</SheetTrigger>
      <SheetContent className="flex flex-col h-full">
        <SheetHeader>
          <SheetTitle>My Profile</SheetTitle>
          <SheetDescription>
            View and edit your profile information
          </SheetDescription>
        </SheetHeader>

        <div className="flex justify-center my-3 relative">
          <Image
            src={formData.profilePicture || "/images/hackernewslogo2.png"}
            alt="Profile"
            className="rounded-full"
            width={130}
            height={130}
          />
          <button
            onClick={randomizeProfilePicture}
            className="absolute bottom-0 right-6 w-6 h-6 sm:w-8 sm:h-8"
          >
            <Image
              src={"/images/random.png"}
              alt="Randomize Profile Picture"
              className="w-full h-full hover:scale-110"
              priority
              width={100}
              height={100}
            />
          </button>
        </div>

        <div className="grid gap-6 md:mx-6 overflow-auto">
          <div className="flex justify-between">
            <span className="font-bold">First Name:</span>
            {editProfile ? (
              <input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                value={formData.firstName || ""}
                onChange={handleChange}
                className="border rounded px-2 py-1 w-1/2"
              />
            ) : (
              <span>{userInfo?.firstName}</span>
            )}
          </div>
          <div className="flex justify-between">
            <span className="font-bold">Last Name:</span>
            {editProfile ? (
              <input
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                value={formData.lastName || ""}
                onChange={handleChange}
                className="border rounded px-2 py-1 w-1/2"
              />
            ) : (
              <span>{userInfo?.lastName}</span>
            )}
          </div>

          <div className="flex justify-between">
            <span className="font-bold">Email:</span>
            {editProfile ? (
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email || ""}
                onChange={handleChange}
                className="border rounded px-2 py-1 w-1/2"
              />
            ) : (
              <span>{userInfo?.email}</span>
            )}
          </div>

          <div className="flex justify-between">
            <span className="font-bold">Age:</span>
            {editProfile ? (
              <select
                id="age"
                name="age"
                value={formData.age || ""}
                onChange={handleChange}
                className="border rounded px-2 py-1 w-1/2"
              >
                <option value="">Select Age</option>
                {[...Array(101)].map((_, index) => (
                  <option key={index} value={index}>
                    {index}
                  </option>
                ))}
              </select>
            ) : (
              <span>{userInfo?.age}</span>
            )}
          </div>

          <div className="flex flex-col justify-center items-center">
            <div className="font-bold text-center mb-2">Description:</div>
            {editProfile ? (
              <textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                className="border rounded px-2 py-1 w-full min-h-28 resize-none text-justify"
              />
            ) : (
              <div className="w-full min-h-20 max-h-32 overflow-y-auto text-justify">
                {userInfo?.description}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-4 justify-center items-center my-8">
          <p>Show my profile</p>
          <Switch
            defaultChecked={userInfo?.showProfile}
            onCheckedChange={toggleProfileVisibility}
          />
        </div>

        <div className="flex justify-center gap-4">
          {editProfile ? (
            <>
              <button
                onClick={() => {
                  updateUserProfile();
                  setEditProfile(false);
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Save
              </button>
              <button
                onClick={() => setEditProfile(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditProfile(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Edit
            </button>
          )}
        </div>

        {/* Logout button at the bottom */}
        <div className="mt-auto flex justify-center text-xl hover:text-blue-500">
          <button onClick={handleLogout}>Logout</button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
