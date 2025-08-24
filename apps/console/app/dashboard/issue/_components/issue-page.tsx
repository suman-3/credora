"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Textarea } from "@workspace/ui/components/textarea";

// ✅ Define schema
const credentialFormSchema = z.object({
  recipientAddress: z.string().min(1, "Recipient Address is required"),
  recipientName: z.string().optional(),
  credentialData: z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    credentialType: z.enum([
      "Degree",
      "Certificate",
      "Course",
      "Workshop",
      "License",
    ]),
    subject: z.string().optional(),
    grade: z.string().optional(),
    gpa: z.coerce.number().optional(),
    credits: z.coerce.number().optional(),
    skills: z.array(z.string()).optional(),
    imageUrl: z.string().url().optional(),
  }),
  expiryDate: z.coerce.number().optional(), // Unix timestamp
});

type CredentialFormValues = z.infer<typeof credentialFormSchema>;

const IssuePage = () => {
  const form = useForm<CredentialFormValues>({
    resolver: zodResolver(credentialFormSchema),
    defaultValues: {
      recipientAddress: "",
      recipientName: "",
      credentialData: {
        title: "",
        description: "",
        credentialType: "Degree",
        subject: "",
        grade: "",
        gpa: undefined,
        credits: undefined,
        skills: [],
        imageUrl: "",
      },
      expiryDate: undefined,
    },
  });

  function onSubmit(values: CredentialFormValues) {
    console.log("FORM SUBMITTED ✅:", values);
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Issue Credential</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

          {/* Recipient Address */}
          <FormField
            control={form.control}
            name="recipientAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recipient Address</FormLabel>
                <FormControl>
                  <Input placeholder="0x123..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Recipient Name */}
          <FormField
            control={form.control}
            name="recipientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recipient Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Title */}
          <FormField
            control={form.control}
            name="credentialData.title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Credential Title</FormLabel>
                <FormControl>
                  <Input placeholder="Bachelor of Science" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="credentialData.description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Details of the credential" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Credential Type */}
          <FormField
            control={form.control}
            name="credentialData.credentialType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Credential Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Degree">Degree</SelectItem>
                    <SelectItem value="Certificate">Certificate</SelectItem>
                    <SelectItem value="Course">Course</SelectItem>
                    <SelectItem value="Workshop">Workshop</SelectItem>
                    <SelectItem value="License">License</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Subject */}
          <FormField
            control={form.control}
            name="credentialData.subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <FormControl>
                  <Input placeholder="Computer Science" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Grade */}
          <FormField
            control={form.control}
            name="credentialData.grade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grade</FormLabel>
                <FormControl>
                  <Input placeholder="A+" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* GPA */}
          <FormField
            control={form.control}
            name="credentialData.gpa"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GPA</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Credits */}
          <FormField
            control={form.control}
            name="credentialData.credits"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Credits</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Image URL */}
          <FormField
            control={form.control}
            name="credentialData.imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/cert.png" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Expiry Date */}
          <FormField
            control={form.control}
            name="expiryDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expiry Date (Unix timestamp)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="1692892800" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit */}
          <Button type="submit" className="w-full">
            Issue Credential
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default IssuePage;
