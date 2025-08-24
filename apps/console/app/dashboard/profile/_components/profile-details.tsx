"use client";

import React from "react";
import LoaderPage from "@/components/shared/loader-page";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { ApiInstance } from "@/lib/apis";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@workspace/ui/components/input";

import { toast } from "sonner"; // or your toast library
import { Textarea } from "@workspace/ui/components/textarea";
import { Loader } from "lucide-react";
import { IUser } from "@/types/objects";
import { ImageUploader } from "@/components/shared/image-uploader";
import { useAuth } from "@/hooks/auth/use-auth";

interface ApiResponse {
  success: boolean;
  user: IUser;
}

const formSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  image: z.string().optional(),
  email: z.string().email("Please enter a valid email address"),
});

type FormData = z.infer<typeof formSchema>;

const ProfileDetails = () => {
  const queryClient = useQueryClient();

  const { setUser } = useAuth();

  const {
    data: user,
    isLoading,
    error,
  } = useQuery<ApiResponse>({
    queryKey: ["get-user-profile"],
    queryFn: async () => {
      const response = await ApiInstance.get("/auth/profile");
      return response.data;
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await ApiInstance.put("/auth/profile", data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Profile updated successfully!");
      console.log(data);

      queryClient.invalidateQueries({ queryKey: ["get-user-profile"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    },
  });

  const userData = user?.user;

  if (userData) {
    setUser(userData);
  }

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      image: "",
    },
  });

  // Update form values when userData is available
  React.useEffect(() => {
    if (userData) {
      const defaultImage = `https://avatar.vercel.sh/${userData.name || "User"}.svg?text=${(
        userData.name || "U"
      )
        .slice(0, 2)
        .toUpperCase()}`;

      form.reset({
        name: userData.name || "",
        email: userData.email || "",
        image: defaultImage,
      });
    }
  }, [userData, form]);

  const onSubmit = async (data: FormData) => {
    try {
      await updateProfileMutation.mutateAsync(data);
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  if (isLoading) {
    return <LoaderPage />;
  }

  if (error) {
    return (
      <Card className="mx-auto w-full">
        <CardContent className="pt-6">
          <div className="text-center text-red-500">
            Error loading profile data. Please try again.
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!userData) {
    return (
      <Card className="mx-auto w-full">
        <CardContent className="pt-6">
          <div className="text-center text-gray-500">
            No profile data available.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-left text-2xl font-bold capitalize">
          {userData.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Profile Picture</FormLabel>
                  <FormControl>
                    <ImageUploader
                      uploaderType="single"
                      value={field.value ? [field.value] : []}
                      disabled={updateProfileMutation.isPending}
                      onChange={(imageUrls) => {
                        const newValue = imageUrls[0] || "";
                        field.onChange(newValue);

                        setTimeout(() => {
                          form.trigger("image");
                        }, 100);
                      }}
                      onRemove={() => {
                        field.onChange("");
                        form.trigger("image");
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter name"
                        {...field}
                        disabled={updateProfileMutation.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter email"
                        type="email"
                        {...field}
                        disabled={updateProfileMutation.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="submit"
                className="cursor-pointer"
                disabled={
                  updateProfileMutation.isPending || !form.formState.isDirty
                }
              >
                {updateProfileMutation.isPending
                  ? "Updating"
                  : "Update Profile"}
                {updateProfileMutation.isPending && (
                  <Loader className="ml-2 h-4 w-4 animate-spin" />
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ProfileDetails;
