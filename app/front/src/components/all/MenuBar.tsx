"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import UserProfile from "../../components/all/UserProfile";
import api from "../../services/api";
import {
  Menubar,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";

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
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const userID = localStorage.getItem("id");

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
    <Menubar className="flex justify-between items-center">
      <MenubarMenu>
        <Link href="/main">Hacker News</Link>
        <MenubarTrigger onClick={() => console.log("New")}>New</MenubarTrigger>

        <MenubarTrigger>
          <Link href="/users">Users</Link>
        </MenubarTrigger>
        <MenubarSeparator />

        <MenubarTrigger>
          <Link href="/favorites">My saved stories</Link>
        </MenubarTrigger>
      </MenubarMenu>
      <UserProfile userInfo={userInfo} setUserInfo={setUserInfo} />
      {userInfo ? (
        <h4>Welcome back {userInfo.firstName}</h4>
      ) : (
        <Link href="/login">Login</Link>
      )}
    </Menubar>
  );
}
