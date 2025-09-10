"use client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface JobApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  jobId: string;
  onSubmit: (applicationData: any) => void;
}

export const JobApplicationModal = ({
  isOpen,
  onClose,
  jobTitle,
  jobId,
  onSubmit,
}: JobApplicationModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    position: jobTitle,
    resume: "",
    coverLetter: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.resume) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    onSubmit({
      ...formData,
      jobPostId: jobId,
      status: "PENDING",
      createdAt: new Date(),
    });

    setFormData({
      name: "",
      email: "",
      position: jobTitle,
      resume: "",
      coverLetter: "",
    });

    onClose();

    toast({
      title: "Application Submitted",
      description: "Your job application has been submitted successfully",
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload to a file storage service
      setFormData((prev) => ({ ...prev, resume: file.name }));
      toast({
        title: "Resume Uploaded",
        description: `${file.name} has been uploaded successfully`,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Apply for {jobTitle}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Your full name"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="your.email@example.com"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="position">Position Applied For</Label>
            <Input
              id="position"
              value={formData.position}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, position: e.target.value }))
              }
              placeholder="Position title"
            />
          </div>

          <div>
            <Label htmlFor="resume">Resume/CV *</Label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Input
                  id="resume"
                  type="text"
                  value={formData.position}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      resume: e.target.value,
                    }))
                  }
                  placeholder="Resume URL Provide"
                />
              </div>
            </div>
          </div>

          {/* <div>
            <Label htmlFor="coverLetter">Cover Letter</Label>
            <Textarea
              id="coverLetter"
              value={formData.coverLetter}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  coverLetter: e.target.value,
                }))
              }
              placeholder="Write a brief cover letter explaining why you're interested in this position..."
              rows={4}
            />
          </div> */}

          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">Application Guidelines:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Ensure your resume is up to date and relevant</li>
              {/* <li>• Write a personalized cover letter for this position</li> */}
              <li>• Double-check all contact information</li>
              <li>• Applications are reviewed within 2-3 business days</li>
            </ul>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Submit Application
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
