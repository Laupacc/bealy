"use client";
import React, { useState, useEffect, useContext } from "react";
import api from "../../services/api";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { StoryTypeContext } from "../../../src/context/StoryTypeContext";
import { useSelectedButton } from "../../../src/context/SelectedButtonContextType";
import UserProfile from "../../components/all/UserProfile";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  if (isLoginPage) {
    return null;
  }

  const [userID, setUserID] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [logoSrc, setLogoSrc] = useState("/images/hackernewslogo2.png");
  const [randomColor, setRandomColor] = useState<string>("#0891b2");

  const { selectedButton, setSelectedButton } = useSelectedButton();
  const storyTypeContext = useContext(StoryTypeContext);
  if (!storyTypeContext) {
    return null;
  }
  const { setStoryType } = storyTypeContext;

  // Get userID from localStorage on component mount
  useEffect(() => {
    const id =
      typeof window !== "undefined" ? localStorage.getItem("id") : null;
    setUserID(id);
  }, []);

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

  // Change logo on hover
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

  // Change logo color upon selection
  useEffect(() => {
    if (selectedButton === "top") {
      setLogoSrc("/images/hackernewslogo2inverted.png");
    } else {
      setLogoSrc("/images/hackernewslogo2.png");
    }
  }, [selectedButton]);

  // Handle button selection
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

  // If user is signed in, display user profile
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!userID) {
        console.log("User not found or not logged in");
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

  // Apply a random avatar background color (only dark-ish colors)
  const getRandomColor = () => {
    const letters = "0123456789";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
  };

  // Change avatar background color every 15 minutes
  useEffect(() => {
    const storedColor = localStorage.getItem("randomColor");
    if (storedColor) {
      setRandomColor(storedColor);
    } else {
      const initialColor = getRandomColor();
      setRandomColor(initialColor);
      localStorage.setItem("randomColor", initialColor);
    }
    const intervalId = setInterval(() => {
      const newColor = getRandomColor();
      setRandomColor(newColor);
      localStorage.setItem("randomColor", newColor);
    }, 30 * 60 * 1000); // 30 minutes
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <Menubar
        className="flex justify-between items-center bg-orange-500 p-4 shadow-md text-slate-800 h-16 sticky top-0 z-50"
        role="navigation"
      >
        <MenubarMenu>
          {/* Logo button, goes to top stories*/}
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

          {/* If large screen (desktop) display normal menu */}
          {storyButtons.map((button, index) => (
            <button
              key={index}
              className={`hidden md:block text-lg ${
                selectedButton === button.type
                  ? "text-white font-medium"
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
                  ? "text-white font-medium"
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
                <h4 className="text-white font-medium text-lg hover:text-slate-800">
                  {userInfo.firstName}
                </h4>
                <Avatar>
                  <AvatarFallback
                    className="text-white hover:opacity-80"
                    style={{
                      backgroundColor: randomColor,
                    }}
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
              className="text-lg text-white border border-white rounded-md px-3 py-1 hover:transform hover:scale-105 hover:duration-200 hover:ease-in-out"
            >
              Login
            </Link>
          )}
        </MenubarMenu>
      </Menubar>
    </>
  );
}
