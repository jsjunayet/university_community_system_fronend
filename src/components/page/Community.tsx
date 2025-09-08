"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import {
  createComment,
  createPost,
  createVote,
  getAllPost,
} from "@/services/postService";
import {
  Heart,
  Image as ImageIcon,
  MessageCircle,
  MoreHorizontal,
  Send,
  Share2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  role: string;
  image: string | null;
  name: string;
  bloodGroup: string;
  studentId: string;
  createdAt: string;
  updatedAt: string;
}

interface Vote {
  id: string;
  userId: string;
  postId: string;
  vote: "UP" | "DOWN";
  createdAt: string;
  updatedAt: string;
}

interface Comment {
  id: string;
  userId: string;
  postId: string;
  commentText: string;
  createdAt: string;
  updatedAt: string;
  user: User;
}

interface Post {
  id: string;
  description: string;
  location: string;
  image: string;
  approved: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  votes: Vote[];
  comments: Comment[];
  user: User;
  upVotes: number;
  downVotes: number;
  totalComments: number;
}

const Community = () => {
  const { user } = useAuth();
  const [newPostContent, setNewPostContent] = useState("");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [newComment, setNewComment] = useState("");
  const [newPostLocation, setNewPostLocation] = useState("");
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPostLoading, setIsPostLoading] = useState(false);
  const [isCommentLoading, setIsCommentLoading] = useState(false);
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Fix for hydration error - ensure component is only rendered on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const response = await getAllPost();

      if (response.success) {
        // Sort posts by createdAt date (newest first)
        const sortedPosts = response.data.sort(
          (a: Post, b: Post) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        // Filter posts based on status if user is not admin
        const filteredPosts =
          user?.role === "admin" || user?.role === "superAdmin"
            ? sortedPosts
            : sortedPosts.filter((post: Post) => post.status === "approved");

        setPosts(filteredPosts);

        // Set my posts (posts created by the current user)
        if (user) {
          const userPosts = sortedPosts.filter(
            (post: Post) => post.userId === user.id
          );
          setMyPosts(userPosts);
        }
      } else {
        toast.error(response.message || "Failed to fetch posts");
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to fetch posts. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch posts on component mount and when user changes
  useEffect(() => {
    if (isClient) {
      fetchPosts();
    }
  }, [user, isClient]);

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;

    try {
      setIsPostLoading(true);
      const postData = {
        description: newPostContent,
        location: newPostLocation || "University Campus",
        image:
          selectedFiles.length > 0
            ? "https://example.com/uploads/image.jpg"
            : "", // In a real app, you'd upload the image first
      };

      const response = await createPost(postData);

      if (response.success) {
        toast.success("Post created successfully!");
        setNewPostContent("");
        setNewPostLocation("");
        setSelectedFiles([]);
        setImagePreviewUrls([]);
        // Refresh posts
        fetchPosts();
      } else {
        toast.error(response.message || "Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post. Please try again.");
    } finally {
      setIsPostLoading(false);
    }
  };

  const handleLikePost = async (postId: string) => {
    if (!user) {
      toast.error("Please login to like posts");
      return;
    }

    try {
      // Find if user already voted on this post
      const post = posts.find((p) => p.id === postId);
      if (!post) return;

      const userVote = post.votes.find((v) => v.userId === user.id);
      const voteType = userVote?.vote === "UP" ? "DOWN" : "UP"; // Toggle vote

      const voteData = {
        postId,
        vote: voteType,
      };

      const response = await createVote(voteData);

      if (response.success) {
        // Refresh posts to get updated vote counts
        fetchPosts();
      } else {
        toast.error(response.message || "Failed to vote");
      }
    } catch (error) {
      console.error("Error voting on post:", error);
      toast.error("Failed to vote. Please try again.");
    }
  };

  const handleAddComment = async (postId: string) => {
    if (!newComment.trim() || !user) {
      toast.error("Please login to comment");
      return;
    }

    try {
      setIsCommentLoading(true);
      const commentData = {
        postId,
        commentText: newComment,
      };

      const response = await createComment(commentData);

      if (response.success) {
        toast.success("Comment added successfully!");
        setNewComment("");
        // Refresh posts to get updated comments
        fetchPosts();
      } else {
        toast.error(response.message || "Failed to add comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment. Please try again.");
    } finally {
      setIsCommentLoading(false);
    }
  };

  const PostCard = ({ post }: { post: Post }) => {
    const [showAllComments, setShowAllComments] = useState(false);

    // Calculate vote counts
    const upVotes = post.votes.filter((vote) => vote.vote === "UP").length;
    const downVotes = post.votes.filter((vote) => vote.vote === "DOWN").length;

    // Check if current user has voted
    const userVote = post.votes.find((vote) => vote.userId === user?.id);
    const hasUpvoted = userVote?.vote === "UP";

    return (
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={post.user.image || "/placeholder.jpg"} />
                <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-semibold">{post.user.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {post.user.role} • {new Date(post.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="mb-4">{post.description}</p>
          {post.image && (
            <img
              src={post.image}
              alt="Post content"
              className="w-full rounded-lg mb-4"
            />
          )}
          {post.location && (
            <div className="mb-3 text-sm text-muted-foreground">
              📍 {post.location}
            </div>
          )}

          <div className="flex items-center justify-between border-t pt-3">
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLikePost(post.id)}
                className={hasUpvoted ? "text-red-500" : ""}
              >
                <Heart className="w-4 h-4 mr-1" />
                {upVotes}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedPost(post)}
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                {post.comments.length}
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </Button>
              {post.status && post.status !== "approved" && (
                <Badge variant="outline" className="ml-2">
                  {post.status}
                </Badge>
              )}
            </div>
          </div>

          {post.comments.length > 0 && (
            <div className="mt-4 space-y-3">
              {post.comments
                .slice(0, showAllComments ? undefined : 2)
                .map((comment) => (
                  <div key={comment.id} className="flex gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src={comment.user.image || "/placeholder.jpg"}
                      />
                      <AvatarFallback>
                        {comment.user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 bg-muted rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">
                          {comment.user.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm">{comment.commentText}</p>
                    </div>
                  </div>
                ))}
              {post.comments.length > 2 && !showAllComments && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAllComments(true)}
                >
                  View all {post.comments.length} comments
                </Button>
              )}
            </div>
          )}

          <div className="flex gap-2 mt-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={user?.image} />
              <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 flex gap-2">
              <Input
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && handleAddComment(post.id)
                }
              />
              <Button
                size="sm"
                onClick={() => handleAddComment(post.id)}
                disabled={isCommentLoading}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
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
  // Wrap the entire component render with isClient check
  if (!isClient) {
    return null; // Return null on server-side to prevent hydration mismatch
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Community Hub</h1>
          <p className="text-muted-foreground">
            Connect with your university community
          </p>
        </div>
      </div>

      <Tabs defaultValue="feed" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="feed">Feed</TabsTrigger>
          <TabsTrigger value="stories">My Post</TabsTrigger>
          {/* <TabsTrigger value="discover">Discover</TabsTrigger> */}
        </TabsList>

        <TabsContent value="feed" className="space-y-6">
          {/* Stories Section */}
          {/* <Card>
            <CardContent className="p-4">
              <div className="flex gap-4 overflow-x-auto">
                <div className="flex flex-col items-center gap-2 min-w-[80px]">
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-muted-foreground flex items-center justify-center cursor-pointer hover:border-primary">
                    <Plus className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <span className="text-xs text-center">Your Story</span>
                </div>
                {stories.map((story) => (
                  <div
                    key={story.id}
                    className="flex flex-col items-center gap-2 min-w-[80px]"
                  >
                    <div className="w-16 h-16 rounded-full border-2 border-primary p-0.5">
                      <Avatar className="w-full h-full">
                        <AvatarImage src={story.authorAvatar} />
                        <AvatarFallback>
                          {story.authorName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <span className="text-xs text-center">
                      {story.authorName}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card> */}

          {/* Create Post */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Avatar>
                  <AvatarImage src={user?.image || "/placeholder.jpg"} />
                  <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                  <Textarea
                    placeholder="What's on your mind?"
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    className="min-h-[80px] resize-none"
                  />
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const input = document.createElement("input");
                          input.type = "file";
                          input.accept = "image/*";
                          input.onchange = (e) => {
                            const files = Array.from(e.target.files || []);
                            setSelectedFiles(files);

                            // Create preview URLs
                            const previews = files.map((file) =>
                              URL.createObjectURL(file)
                            );
                            setImagePreviewUrls(previews);
                          };
                          input.click();
                        }}
                      >
                        <ImageIcon className="w-4 h-4 mr-1" />
                        Photo
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
                    <Button
                      onClick={handleCreatePost}
                      disabled={!newPostContent.trim() || isPostLoading}
                    >
                      {isPostLoading ? "Posting..." : "Post"}
                    </Button>
                  </div>

                  {imagePreviewUrls.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {imagePreviewUrls.map((url, index) => (
                        <div key={index} className="relative">
                          <img
                            src={url}
                            alt={`Preview ${index}`}
                            className="h-20 w-20 object-cover rounded-md"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                            onClick={() => {
                              const newFiles = [...selectedFiles];
                              newFiles.splice(index, 1);
                              setSelectedFiles(newFiles);

                              const newUrls = [...imagePreviewUrls];
                              URL.revokeObjectURL(newUrls[index]);
                              newUrls.splice(index, 1);
                              setImagePreviewUrls(newUrls);
                            }}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {newPostLocation && (
                    <div className="mt-2 text-sm text-muted-foreground flex items-center gap-1">
                      <span>📍</span> {newPostLocation}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Posts Feed */}
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </TabsContent>

        {/* <TabsContent value="stories" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stories.map((story) => (
              <Card
                key={story.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
              >
                <CardContent className="p-0">
                  <div className="relative h-64 bg-gradient-to-br from-primary to-secondary rounded-t-lg">
                    <div className="absolute top-3 left-3">
                      <Avatar className="w-8 h-8 border-2 border-white">
                        <AvatarImage src={story.authorAvatar} />
                        <AvatarFallback>
                          {story.authorName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-white font-medium">{story.content}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Eye className="w-3 h-3 text-white/80" />
                        <span className="text-xs text-white/80">
                          {story.views.length} views
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium">{story.authorName}</p>
                    <p className="text-xs text-muted-foreground">
                      {story.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="discover" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Trending Topics</CardTitle>
                <CardDescription>
                  Popular discussions in your community
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    "#Graduation2024",
                    "#AlumniMeetup",
                    "#StudyGroup",
                    "#CampusLife",
                    "#CareerTips",
                  ].map((tag) => (
                    <div
                      key={tag}
                      className="flex justify-between items-center"
                    >
                      <span className="text-primary font-medium">{tag}</span>
                      <Badge variant="outline">Trending</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Suggested Connections</CardTitle>
                <CardDescription>People you might know</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    "Alex Johnson",
                    "Emma Davis",
                    "Michael Chen",
                    "Lisa Rodriguez",
                  ].map((name) => (
                    <div
                      key={name}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{name}</span>
                      </div>
                      <Button variant="outline" size="sm">
                        Connect
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent> */}
      </Tabs>

      {/* Post Detail Modal */}
      {selectedPost && (
        <Dialog
          open={!!selectedPost}
          onOpenChange={() => setSelectedPost(null)}
        >
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Post Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={selectedPost.authorAvatar} />
                  <AvatarFallback>
                    {selectedPost.authorName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold">{selectedPost.authorName}</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedPost.authorRole} •{" "}
                    {selectedPost.timestamp.toLocaleString()}
                  </p>
                </div>
              </div>
              <p>{selectedPost.content}</p>

              <div className="space-y-3">
                <h5 className="font-medium">
                  Comments ({selectedPost.comments.length})
                </h5>
                {selectedPost.comments.map((comment) => (
                  <div key={comment.id} className="space-y-2">
                    <div className="flex gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={comment.authorAvatar} />
                        <AvatarFallback>
                          {comment.authorName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 bg-muted rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">
                            {comment.authorName}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {comment.timestamp.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                    </div>
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex gap-2 ml-10">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={reply.authorAvatar} />
                          <AvatarFallback>
                            {reply.authorName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 bg-muted rounded-lg p-2">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-xs">
                              {reply.authorName}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {reply.timestamp.toLocaleString()}
                            </span>
                          </div>
                          <p className="text-xs">{reply.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      <Dialog open={locationDialogOpen} onOpenChange={setLocationDialogOpen}>
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
            <Button onClick={() => setLocationDialogOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Community;
