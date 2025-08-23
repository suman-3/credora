"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Separator } from "@workspace/ui/components/separator";
import { Breadcrumbs } from "../breadcrumbs";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input"; // assuming exists
import { Label } from "@workspace/ui/components/label"; // assuming exists
import { Textarea } from "@workspace/ui/components/textarea"; // assuming exists
import { ApiInstance } from "@/lib/apis";
import { toast } from "sonner";

export default function Header() {
  const [open, setOpen] = React.useState(false);
  const [website, setWebsite] = React.useState("");
  const [description, setDescription] = React.useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await ApiInstance.post("/blockchain/register", {
      website,
      description,
    });

    toast.success("Blockchain registration successful!");

    setWebsite("");
    setDescription("");

    setOpen(false);
  };
8
  return (
    <header
      suppressHydrationWarning
      className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
    >
      <div className="flex items-center gap-2 px-4">
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumbs />
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="mr-6">Register on Blockchain</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Register on Blockchain</DialogTitle>
            <DialogDescription>
              Enter the website and a short description. On submit, we will log
              the values.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                placeholder="https://example.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* <div className="flex items-center gap-2 px-4">
        <ModeToggle />
      </div> */}
    </header>
  );
}
