"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Loader2, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios-instance";

interface Tag {
  id: string;
  name: string;
  created_at?: string;
}

interface TagsManagerProps {
  className?: string;
}

export const TagsManager = ({ className }: TagsManagerProps) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [freeSubscriberTagIds, setFreeSubscriberTagIds] = useState<string[]>(
    []
  );
  const [paidSubscriberTagIds, setPaidSubscriberTagIds] = useState<string[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fetchingTags, setFetchingTags] = useState(false);
  const [showTagPicker, setShowTagPicker] = useState<"free" | "paid" | null>(
    null
  );

  // Fetch tags and current configuration on mount
  useEffect(() => {
    debugger;
    handleFetchTags();
  }, []);

  const handleFetchTags = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/api/kit/tags");
      setTags(response.data.tags || []);
      setFreeSubscriberTagIds(
        response.data.currentConfig.freeSubscriberTagIds || []
      );
      setPaidSubscriberTagIds(
        response.data.currentConfig.paidSubscriberTagIds || []
      );
    } catch (error) {
      console.error("Failed to fetch tags:", error);
      toast.error("Failed to fetch tags from ConvertKit");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfiguration = async () => {
    try {
      setSaving(true);
      await axiosInstance.put("/api/kit/tags", {
        freeSubscriberTagIds,
        paidSubscriberTagIds,
      });
      toast.success("Tag configuration saved successfully");
    } catch (error) {
      console.error("Failed to save tag configuration:", error);
      toast.error("Failed to save tag configuration");
    } finally {
      setSaving(false);
    }
  };

  const handleAddTag = (tagId: string, type: "free" | "paid") => {
    if (type === "free") {
      if (!freeSubscriberTagIds.includes(tagId)) {
        setFreeSubscriberTagIds([...freeSubscriberTagIds, tagId]);
      }
    } else {
      if (!paidSubscriberTagIds.includes(tagId)) {
        setPaidSubscriberTagIds([...paidSubscriberTagIds, tagId]);
      }
    }
    setShowTagPicker(null);
  };

  const handleRemoveTag = (tagId: string, type: "free" | "paid") => {
    if (type === "free") {
      setFreeSubscriberTagIds(
        freeSubscriberTagIds.filter((id) => id !== tagId)
      );
    } else {
      setPaidSubscriberTagIds(
        paidSubscriberTagIds.filter((id) => id !== tagId)
      );
    }
  };

  const getTagName = (tagId: string) => {
    const tag = tags.find((t) => t.id === tagId);
    return tag?.name || tagId;
  };

  const availableTagsForType = (type: "free" | "paid") => {
    const usedIds =
      type === "free" ? freeSubscriberTagIds : paidSubscriberTagIds;
    return tags.filter((tag) => !usedIds.includes(tag.id));
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>ConvertKit Tag Configuration</CardTitle>
        <CardDescription>
          Configure which tags to add to subscribers based on their subscription
          type
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Paid Subscribers */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-foreground">
            Paid Subscribers
          </h3>
          <div className="flex flex-wrap gap-2">
            {paidSubscriberTagIds.map((tagId) => (
              <Badge
                key={tagId}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {getTagName(tagId)}
                <button
                  onClick={() => handleRemoveTag(tagId, "paid")}
                  className="ml-1 hover:opacity-70"
                  aria-label={`Remove ${getTagName(tagId)} tag`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            <Dialog
              open={showTagPicker === "paid"}
              onOpenChange={(open) => setShowTagPicker(open ? "paid" : null)}
            >
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  <Plus className="h-3 w-3 mr-1" />
                  Add Tag
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Tag for Paid Subscribers</DialogTitle>
                  <DialogDescription>
                    Select a tag to automatically add to paid subscribers
                  </DialogDescription>
                </DialogHeader>
                <div className="max-h-[300px] overflow-y-auto space-y-1">
                  {availableTagsForType("paid").length === 0 ? (
                    <p className="text-center py-4 text-muted-foreground">
                      All tags are already assigned
                    </p>
                  ) : (
                    availableTagsForType("paid").map((tag) => (
                      <button
                        key={tag.id}
                        onClick={() => handleAddTag(tag.id, "paid")}
                        className="w-full text-left p-2 hover:bg-muted rounded-md transition-colors"
                      >
                        {tag.name}
                      </button>
                    ))
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Free Subscribers */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-foreground">
            Free Subscribers
          </h3>
          <div className="flex flex-wrap gap-2">
            {freeSubscriberTagIds.map((tagId) => (
              <Badge
                key={tagId}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {getTagName(tagId)}
                <button
                  onClick={() => handleRemoveTag(tagId, "free")}
                  className="ml-1 hover:opacity-70"
                  aria-label={`Remove ${getTagName(tagId)} tag`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            <Dialog
              open={showTagPicker === "free"}
              onOpenChange={(open) => setShowTagPicker(open ? "free" : null)}
            >
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  <Plus className="h-3 w-3 mr-1" />
                  Add Tag
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Tag for Free Subscribers</DialogTitle>
                  <DialogDescription>
                    Select a tag to automatically add to free subscribers
                  </DialogDescription>
                </DialogHeader>
                <div className="max-h-[300px] overflow-y-auto space-y-1">
                  {availableTagsForType("free").length === 0 ? (
                    <p className="text-center py-4 text-muted-foreground">
                      All tags are already assigned
                    </p>
                  ) : (
                    availableTagsForType("free").map((tag) => (
                      <button
                        key={tag.id}
                        onClick={() => handleAddTag(tag.id, "free")}
                        className="w-full text-left p-2 hover:bg-muted rounded-md transition-colors"
                      >
                        {tag.name}
                      </button>
                    ))
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <Button
            onClick={handleSaveConfiguration}
            disabled={saving}
            className="bg-green-600 hover:bg-green-700"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Save Configuration
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
