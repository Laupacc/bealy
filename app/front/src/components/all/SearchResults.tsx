"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import moment from "moment";
import { TbTriangleFilled } from "react-icons/tb";
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

interface SearchResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchResults: any;
  searchQuery: string;
}

export default function SearchResults({
  isOpen,
  onClose,
  searchResults,
  searchQuery,
}: SearchResultsModalProps) {
  const { hits } = searchResults;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        className="flex flex-col h-full overflow-y-auto"
        side="bottom"
      >
        <SheetHeader>
          <SheetTitle>Search results for "{searchQuery}"</SheetTitle>
          <SheetDescription>
            {(hits && hits.length) || 0} results{" "}
          </SheetDescription>
        </SheetHeader>

        <div className="grid gap-4 py-4">
          {hits && hits.length > 0 ? (
            hits.map((story: any, index: number) => (
              <Card
                key={story.objectID || index}
                className="bg-card text-card-foreground shadow-xl my-2 w-[90%] mx-auto min-h-[8rem] h-auto"
              >
                <div className="flex-row justify-center items-center ml-2">
                  <div className="flex justify-between items-baseline">
                    <CardHeader>
                      {story.url ? (
                        <Link href={story.url} target="_blank">
                          <div className="flex items-start flex-wrap sm:flex-nowrap">
                            <div className="flex items-center">
                              <TbTriangleFilled color="#f59e0b" size={16} />
                              <CardTitle className="text-xl ml-2">
                                {index + 1}&nbsp;•&nbsp;
                              </CardTitle>
                            </div>

                            <CardTitle className="cursor-pointer hover:underline text-xl ml-0 sm:ml-2 break-words">
                              {story.title}
                            </CardTitle>
                          </div>
                          <CardDescription className="break-all">
                            {story.url}
                          </CardDescription>
                        </Link>
                      ) : (
                        <div className="flex items-start flex-wrap sm:flex-nowrap">
                          <div className="flex items-center">
                            <TbTriangleFilled color="#f59e0b" size={16} />
                            <CardTitle className="text-xl ml-2">
                              {index + 1}&nbsp;•&nbsp;
                            </CardTitle>
                          </div>
                          <CardTitle className="cursor-pointer hover:underline text-xl ml-2 break-words">
                            {story.title}
                          </CardTitle>
                        </div>
                      )}
                    </CardHeader>
                  </div>
                </div>

                <CardFooter className="flex flex-col sm:flex-row justify-center items-start ml-2">
                  <CardDescription className="text-xs text-muted-foreground mr-2 break-words flex items-center">
                    {story.points} points <span className="pl-2">▶︎</span>
                  </CardDescription>

                  <CardDescription className="text-xs text-muted-foreground mr-2 break-words flex items-center">
                    by {story.author} <span className="pl-2">▶︎</span>
                  </CardDescription>
                  <CardDescription className="text-xs text-muted-foreground mr-2 break-words flex items-center">
                    {story.num_comments} comments
                  </CardDescription>

                  <CardDescription className="text-xs text-muted-foreground ml-auto break-words">
                    {moment.unix(story.created_at_i).fromNow()}
                  </CardDescription>
                </CardFooter>
              </Card>
            ))
          ) : (
            <Card>
              <CardHeader className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold">
                  No results found
                </CardTitle>
              </CardHeader>
            </Card>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
