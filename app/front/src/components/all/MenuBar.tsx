"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import UserProfile from "../../components/all/UserProfile";
import api from "../../services/api";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { StoryTypeContext } from "../../../src/context/StoryTypeContext";
import { useSelectedButton } from "../../../src/context/SelectedButtonContextType";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Menubar,
  MenubarMenu,
  MenubarSeparator,
} from "@/components/ui/menubar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";

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

export default function MenuBar() {
  const userID = localStorage.getItem("id");
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [logoSrc, setLogoSrc] = useState("/images/hackernewslogo2.png");

  const { selectedButton, setSelectedButton } = useSelectedButton();
  const storyTypeContext = useContext(StoryTypeContext);
  if (!storyTypeContext) {
    return null;
  }
  const { setStoryType } = storyTypeContext;

  const storyButtons = [
    { name: "New", type: "new" },
    { name: "Ask", type: "ask" },
    { name: "Show", type: "show" },
    { name: "Jobs", type: "job" },
  ];

  const otherButtons = [
    { name: "My favorites", type: "favorites" },
    { name: "Users", type: "users" },
  ];

  const handleMouseEnter = () => {
    if (selectedButton !== "top") {
      setLogoSrc("/images/hackernewslogo2inverted.png");
    }
  };

  const handleMouseLeave = () => {
    if (selectedButton !== "top") {
      setLogoSrc("/images/hackernewslogo2.png");
    }
  };

  const handleClick = (type: string) => {
    setSelectedButton(type);

    if (type === "users") {
      router.push(`/users`);
    } else if (type === "favorites") {
      router.push(`/favorites`);
    } else {
      setStoryType(type);
      router.push(`/main`);
    }
  };

  // Update logo when `selectedButton` is 'top'
  useEffect(() => {
    if (selectedButton === "top") {
      setLogoSrc("/images/hackernewslogo2inverted.png");
    } else {
      setLogoSrc("/images/hackernewslogo2.png");
    }
  }, [selectedButton]);

  // If user is signed in, display user profile
  useEffect(() => {
    const fetchUserInfo = async () => {
      console.log("User ID:", userID);
      if (!userID) {
        console.log("User ID or token not found in local storage.");
        return;
      }

      try {
        const response = await api.get(`/auth/${userID}/userInfo`);

        setUserInfo(response.data);
        console.log("User info:", response.data);
      } catch (error) {
        console.error("Error fetching user info:", error);
        setUserInfo(null);
      }
    };

    fetchUserInfo();
  }, [userID]);

  return (
    <>
      <Menubar className="flex justify-between items-center bg-orange-500 p-4 shadow-md text-slate-800 h-16 sticky top-0 z-50">
        <MenubarMenu>
          {/* Logo button to top stories*/}
          <button
            onClick={() => handleClick("top")}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Image src={logoSrc} priority alt="logo" width={50} height={50} />
          </button>

          {/* If small screen (phone) display dropdown menu */}
          <div className="flex items-center md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-lg text-white border border-white rounded-md px-3 py-1">
                  Menu
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                <DropdownMenuLabel className="text-lg">
                  Stories
                </DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={selectedButton || undefined}
                  onValueChange={(value) => setSelectedButton(value)}
                >
                  {storyButtons.map((button, index) => (
                    <DropdownMenuRadioItem
                      key={index}
                      onClick={() => handleClick(button.type)}
                      className="text-lg"
                      value={button.type}
                    >
                      {button.name}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>

                <DropdownMenuSeparator />

                <DropdownMenuLabel className="text-lg">More</DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={selectedButton || undefined}
                  onValueChange={(value) => setSelectedButton(value)}
                >
                  {otherButtons.map((button, index) => (
                    <DropdownMenuRadioItem
                      key={index}
                      onClick={() => handleClick(button.type)}
                      className="text-lg"
                      value={button.type}
                    >
                      {button.name}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* If not large screen (desktop) display normal menu */}
          {storyButtons.map((button, index) => (
            <button
              key={index}
              className={`hidden md:block text-lg ${
                selectedButton === button.type
                  ? "text-white"
                  : "text-slate-800 hover:text-white font-medium"
              }`}
              onClick={() => handleClick(button.type)}
            >
              {button.name}
            </button>
          ))}
          <MenubarSeparator />
          {otherButtons.map((button, index) => (
            <button
              key={index}
              className={`hidden md:block text-lg ${
                selectedButton === button.type
                  ? "text-white"
                  : "text-slate-800 hover:text-white font-medium"
              }`}
              onClick={() => handleClick(button.type)}
            >
              {button.name}
            </button>
          ))}

          {userInfo ? (
            <UserProfile userInfo={userInfo} setUserInfo={setUserInfo}>
              <div className="flex items-center gap-2 cursor-pointer">
                <h4 className="text-slate-800 hover:text-white font-medium">
                  {userInfo.firstName}
                </h4>
                <Avatar>
                  <AvatarImage src={userInfo.profilePicture} />
                  <AvatarFallback
                    style={{ backgroundColor: "#64748b", color: "white" }}
                  >
                    {userInfo?.firstName.slice(0, 1).toUpperCase()}{" "}
                    {userInfo?.lastName.slice(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            </UserProfile>
          ) : (
            <Link
              href="/login"
              className="text-slate-800 hover:text-white font-medium"
            >
              Login
            </Link>
          )}
        </MenubarMenu>
      </Menubar>
    </>
  );
}
