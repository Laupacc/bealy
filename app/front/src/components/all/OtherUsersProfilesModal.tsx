import React, { useState, useEffect } from "react";
import api from "../../services/api";
import moment from "moment";
import DOMPurify from "dompurify";
import he from "he";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface UserProfileDialogProps {
  username: string;
}

export default function OtherUsersProfilesModal({
  username,
}: UserProfileDialogProps) {
  const [publicUserProfile, setPublicUserProfile] = useState<any>(null);

  // Fetch public user info by ID
  useEffect(() => {
    const fetchPublicUsersInfo = async () => {
      try {
        const response = await api.get(`/hackernews/users/${username}`);
        setPublicUserProfile(response.data);
      } catch (error) {
        console.error("Error fetching public user info:", error);
      }
    };

    if (username) {
      fetchPublicUsersInfo();
    }
  }, [username]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button>by {username}</button>
      </DialogTrigger>
      <DialogContent aria-describedby="dialog-description">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold leading-none text-gray-900">
            {username}
          </DialogTitle>
        </DialogHeader>
        {publicUserProfile && (
          <DialogDescription
            id="dialog-description"
            className="flex flex-col items-start justify-start space-y-4"
          >
            <div className="flex flex-row items-center justify-start space-x-2 flex-wrap">
              <span className="text-left font-semibold">Member since:</span>
              <span>
                {moment.unix(publicUserProfile.created).format("MMMM Do YYYY")}
              </span>
            </div>
            <div className="flex flex-row items-center justify-start space-x-2 flex-wrap">
              <span className="font-semibold">Karma:</span>
              <span>{publicUserProfile.karma}</span>
            </div>
            <div className="flex flex-row items-center justify-start space-x-2 flex-wrap">
              <span className="font-semibold">
                {publicUserProfile.submitted.length}
              </span>
              <span>total stories, polls and/or comments submitted</span>
            </div>
            <div className="flex flex-row items-center justify-start space-x-2 flex-wrap">
              <span className="font-semibold">Description:</span>
              <span className="text-justify">
                {he.decode(
                  DOMPurify.sanitize(publicUserProfile.about, {
                    ALLOWED_TAGS: [],
                    ALLOWED_ATTR: [],
                  })
                ) || "No description available"}
              </span>
            </div>
          </DialogDescription>
        )}
      </DialogContent>
    </Dialog>
  );
}
