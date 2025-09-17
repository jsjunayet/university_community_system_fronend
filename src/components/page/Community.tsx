"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { uploadImagesToCloudinary } from "@/lib/cloudinary";
import { messaging } from "@/lib/firebase";
import { createPost, getAllPost, getMyPost } from "@/services/postService";
import { onMessage } from "firebase/messaging";
import { MapPin, Upload } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import FoodPostCard from "../PostDetilas/FoodPostCard";
import { Badge } from "../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

const AllPostPage = () => {
  const { user } = useAuth();
  const [Posts, setPosts] = useState([]);
  const [MyPost, setMyPost] = useState([]);

  const [newPostContent, setNewPostContent] = useState("");
  const [newPostLocation, setNewPostLocation] = useState("");
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setloading] = useState(false);

  const handleFileSelect = (e: any) => {
    const filesArray = Array.from(e.target.files) as File[];
    if (filesArray.length > 4) {
      toast.error("You can only upload up to 4 images");
      return;
    }
    setSelectedFiles(filesArray);
    const newImageUrls = filesArray.map((file) => URL.createObjectURL(file));
    setImagePreviewUrls(newImageUrls);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ lat: latitude, lng: longitude });

          fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          )
            .then((res) => res.json())
            .then((data) => {
              const locationName =
                data.address.city ||
                data.address.town ||
                data.address.suburb ||
                "Current location";
              setNewPostLocation(locationName);
              toast.success(`Location detected: ${locationName}`);
            })
            .catch(() => {
              setNewPostLocation(
                `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`
              );
              toast.success("Coordinates detected");
            });
        },
        () => {
          toast.error("Couldn't access your location");
          setLocationDialogOpen(true);
        }
      );
    } else {
      toast.error("Geolocation is not supported");
      setLocationDialogOpen(true);
    }
  };
  useEffect(() => {
    onMessage(messaging, (payload) => {
      console.log("Foreground Message:", payload);
      alert(`${payload.notification?.title}: ${payload.notification?.body}`);
    });
  }, []);

  const handleCreatePost = async () => {
    setloading(true);
    const uploadedUrls = await uploadImagesToCloudinary(selectedFiles);

    const payload = {
      description: newPostContent,
      location: newPostLocation,
      image:
        uploadedUrls[0] ||
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300",
    };
    console.log(payload);
    const res = await createPost(payload); // এখন কোন error থাকবে না
    console.log(res);
    if (res.success) {
      toast.success("Post created!");
      setloading(false);
      fetchMyPost();
      setNewPostContent("");

      setNewPostLocation("");

      setSelectedFiles([]);
      setImagePreviewUrls([]);
    } else {
      setloading(false);
    }
  };
  const fetchPost = async () => {
    const res = await getAllPost();
    console.log(res);
    if (res.success) {
      setPosts(res.data);
    }
  };
  const fetchMyPost = async () => {
    const res = await getMyPost();
    console.log(res);
    if (res.success) {
      setMyPost(res.data);
    }
  };
  useEffect(() => {
    fetchPost();
    fetchMyPost();
  }, []);
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 md:px-4 px-2">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Community Hub
            </h1>
            <p className="text-muted-foreground">
              Connect with your university community
            </p>
          </div>
        </div>
        {/* Create Post Card */}
        <Tabs defaultValue="feed" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="feed">Feed</TabsTrigger>
            <TabsTrigger value="mypost">My Post</TabsTrigger>
            {/* <TabsTrigger value="discover">Discover</TabsTrigger> */}
          </TabsList>

          <TabsContent value="feed" className="space-y-6">
            <Card className="mb-8">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={user?.image ?? ""} />
                    <AvatarFallback>You</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">
                      What’s cooking on campus? 🍽️
                    </h3>
                    {newPostLocation && (
                      <div className="text-sm text-gray-500 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {newPostLocation}
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  className="mb-4"
                  placeholder="Share your food story with the community..."
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                />

                {imagePreviewUrls.length > 0 && (
                  <div className="mb-4 grid grid-cols-2 gap-2">
                    {imagePreviewUrls.map((url, index) => (
                      <div
                        key={index}
                        className="relative h-32 rounded overflow-hidden"
                      >
                        <Image
                          height={500}
                          width={500}
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                          onClick={() => {
                            setImagePreviewUrls(
                              imagePreviewUrls.filter((_, i) => i !== index)
                            );
                            setSelectedFiles(
                              selectedFiles.filter((_, i) => i !== index)
                            );
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                  <div className="flex flex-wrap gap-2">
                    <Input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      multiple
                      accept="image/*"
                      onChange={handleFileSelect}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" /> Photo
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={getCurrentLocation}
                    >
                      📍 Use Current Location
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setLocationDialogOpen(true)}
                    >
                      ✍️ Enter Manually
                    </Button>
                  </div>

                  <div className="self-end sm:self-auto">
                    <Button
                      className=" bg-secondary"
                      onClick={handleCreatePost}
                      disabled={loading}
                    >
                      {loading ? "Posting...." : "Post"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Posts Feed */}
            {Posts?.length > 0 ? (
              <div className="space-y-6">
                {Posts.map((post) => (
                  <FoodPostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900">
                  No food spots found
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            )}

            {/* Manual Location Dialog */}
            <Dialog
              open={locationDialogOpen}
              onOpenChange={setLocationDialogOpen}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Enter Your Location</DialogTitle>
                  <DialogDescription>
                    Couldn&apos;t detect location. Please enter manually.
                  </DialogDescription>
                </DialogHeader>
                <Input
                  value={newPostLocation}
                  onChange={(e) => setNewPostLocation(e.target.value)}
                  placeholder="e.g. New Market, Dhaka"
                />
                <DialogFooter>
                  <Button onClick={() => setLocationDialogOpen(false)}>
                    Done
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="mypost" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Community Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MyPost?.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell>{post.description}</TableCell>
                        <TableCell>{post.location}</TableCell>
                        <TableCell>{post.user?.name || user?.name}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              post?.status === "approved"
                                ? "success"
                                : post?.status === "rejected"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {post?.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AllPostPage;
