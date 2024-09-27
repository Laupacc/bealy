"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import api from "../../services/api";
import { FaSave } from "react-icons/fa";
import Image from "next/image";
import moment from "moment";
import DOMPurify from "dompurify";
import he from "he";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface CommentsProps {
  storyId: number | null;
  open: boolean;
  onClose: () => void; // Parent control for closing the sheet
}

export default function Comments({ storyId, open, onClose }: CommentsProps) {
  const [comments, setComments] = useState<any[]>([]);

  useEffect(() => {
    const fetchComments = async () => {
      if (storyId) {
        try {
          const response = await api.get(`/hackernews/comments/${storyId}`);
          setComments(response.data);
          console.log("Comments:", response.data);
        } catch (error) {
          console.error("Error fetching comments:", error);
        }
      }
    };

    fetchComments();
  }, [storyId]);

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        className="flex flex-col h-full overflow-y-auto"
        side="bottom"
      >
        <SheetHeader>
          <SheetTitle>Comments</SheetTitle>
          <SheetDescription>{comments.length} comments</SheetDescription>
        </SheetHeader>

        {comments.map((comment: any) => (
          <Card key={comment.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="overflow-hidden text-ellipsis">
                  {comment.by}
                </CardTitle>
              </div>
              <CardDescription className="break-words overflow-hidden text-ellipsis">
                {he.decode(
                  DOMPurify.sanitize(comment.text, {
                    ALLOWED_TAGS: [],
                    ALLOWED_ATTR: [],
                  })
                )}
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <CardDescription className="text-xs text-muted-foreground ml-auto">
                {moment.unix(comment.time).fromNow()}
              </CardDescription>
            </CardFooter>
          </Card>
        ))}
      </SheetContent>
    </Sheet>
  );
}
