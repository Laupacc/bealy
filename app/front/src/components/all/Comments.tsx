"use client";
import React, { useState, useEffect } from "react";
import api from "../../services/api";
import OtherUsersProfilesModal from "../all/OtherUsersProfilesModal";
import moment from "moment";
import DOMPurify from "dompurify";
import he from "he";
import { Comment as LoadingComment } from "react-loader-spinner";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface CommentsProps {
  storyId: number | null;
  open: boolean;
  onClose: () => void; // Parent control for closing the sheet
}

export default function Comments({ storyId, open, onClose }: CommentsProps) {
  const [comments, setComments] = useState<any[]>([]);
  const [loadingComments, setLoadingComments] = useState<boolean>(false);
  const [collapsedComments, setCollapsedComments] = useState<{
    [key: number]: boolean;
  }>({});

  // Fetch comments for the story
  useEffect(() => {
    if (!storyId || !open || loadingComments) return;
    const fetchComments = async () => {
      setLoadingComments(true);
      try {
        const response = await api.get(`/hackernews/comments/${storyId}`);
        const comments = response.data;

        // Fetch kids recursively for each comment
        const commentsWithKids = await Promise.all(
          comments.map(async (comment: any) => {
            if (comment.kids && comment.kids.length > 0) {
              const kidsResponse = await api.get(
                `/hackernews/kids/${comment.id}`
              );
              comment.kids = kidsResponse.data.kids;
            }
            return comment;
          })
        );

        setComments(commentsWithKids);
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setLoadingComments(false);
      }
    };

    fetchComments();
  }, [storyId]);

  useEffect(() => {
    if (!open) {
      setComments([]);
    }
  }, [open]);

  // Count the number of comments + kids, don't count deleted comments
  const countComments = (comments: any[]): number => {
    return comments.reduce((acc, comment) => {
      if (comment.deleted) {
        return acc;
      }
      const kidsCount = comment.kids ? countComments(comment.kids) : 0;
      return acc + 1 + kidsCount;
    }, 0);
  };

  // Toggle the collapsed state of a comment
  const toggleCollapse = (commentId: number) => {
    setCollapsedComments((prevState) => ({
      ...prevState,
      [commentId]: !prevState[commentId],
    }));
  };

  // Rendering the comments
  const renderComments = (comment: any) => {
    if (comment.deleted) return null;

    const isCollapsed = collapsedComments[comment.id];

    return (
      <Card key={comment.id} className="mb-4">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="overflow-hidden text-ellipsis">
              <OtherUsersProfilesModal username={comment.by} />
            </CardTitle>
          </div>
          <CardDescription className="break-words overflow-hidden text-ellipsis text-justify">
            {he.decode(
              DOMPurify.sanitize(comment.text || "", {
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

        {/* Render kids with collapsibility */}
        {comment.kids?.length > 0 && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleCollapse(comment.id)}
              className="ml-4"
            >
              {isCollapsed ? (
                <>
                  <ChevronRight className="mr-1" /> Show replies
                </>
              ) : (
                <>
                  <ChevronDown className="mr-1" /> Hide replies
                </>
              )}
            </Button>
            {!isCollapsed && (
              <div className="ml-4">
                {comment.kids.map((kid: any) => renderComments(kid))}
              </div>
            )}
          </>
        )}
      </Card>
    );
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        className="flex flex-col h-full overflow-y-auto"
        side="bottom"
      >
        <SheetHeader>
          <SheetTitle>Comments</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>

        {loadingComments ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <LoadingComment
              height={100}
              width={100}
              color="#f97316"
              backgroundColor="blue"
              ariaLabel="Loading comments..."
            />
          </div>
        ) : (
          <SheetDescription>
            {countComments(comments)} comments
          </SheetDescription>
        )}
        {comments.map((comment) => renderComments(comment))}
      </SheetContent>
    </Sheet>
  );
}
