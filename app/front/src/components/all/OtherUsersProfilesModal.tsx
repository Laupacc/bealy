import React, { useState, useEffect } from "react";
import api from "../../services/api";
import moment from "moment";
import DOMPurify from "dompurify";
import he from "he";
import { toast } from "react-toastify";
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
    if (!username) {
      console.log("No username provided.");
      return;
    }
    const fetchPublicUsersInfo = async () => {
      try {
        const response = await api.get(`/hackernews/users/${username}`);
        setPublicUserProfile(response.data);
      } catch (error) {
        console.error("Error fetching public user info:", error);
        toast.error("Connection error while fetching public user info");
      }
    };

    if (username) {
      fetchPublicUsersInfo();
    }
  }, [username]);

  {
    /* Still need to address error message : 
    Warning: In HTML, <div> cannot be a descendant of <p>This will cause a hydration error. 
    Comes from Dialog UI component. */
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button>by {username}</button>
      </DialogTrigger>
      <DialogContent aria-describedby="dialog-description">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold leading-none text-gray-900">
            {username}
            <DialogDescription /> {/* To avoid warning message */}
          </DialogTitle>
        </DialogHeader>
        {publicUserProfile && (
          <DialogDescription
            id="dialog-description"
            className="flex flex-col items-start justify-start space-y-4"
          >
            <div className="flex flex-row items-center justify-start space-x-2 flex-wrap">
              <div className="text-left font-semibold">Member since:</div>
              <div>
                {moment.unix(publicUserProfile.created).format("MMMM Do YYYY")}
              </div>
            </div>
            <div className="flex flex-row items-center justify-start space-x-2 flex-wrap">
              <div className="font-semibold">Karma:</div>
              <div>{publicUserProfile.karma}</div>
            </div>
            <div className="flex flex-row items-center justify-start space-x-2 flex-wrap">
              <div className="font-semibold">
                {publicUserProfile.submitted?.length}
              </div>
              <div>total stories, polls and/or comments submitted</div>
            </div>
            <div className="flex flex-row items-center justify-start space-x-2 flex-wrap break-all">
              <div className="font-semibold">Description:</div>
              <div className="text-justify">
                {he.decode(
                  DOMPurify.sanitize(publicUserProfile.about, {
                    ALLOWED_TAGS: [],
                    ALLOWED_ATTR: [],
                  })
                ) || "No description available"}
              </div>
            </div>
          </DialogDescription>
        )}
      </DialogContent>
    </Dialog>
  );
}
