import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { createComment, createVote, getAllPost } from "@/services/postService";
import { formatDistanceToNow } from "date-fns";
import {
  Heart,
  MapPin,
  MessageSquare,
  Navigation,
  Send,
  Share,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const FoodPostCard = ({ post }) => {
  const [showComments, setShowComments] = useState(false);
  const { user } = useAuth();
  const [newComment, setNewComment] = useState("");
  const [Posts, setPosts] = useState([]);

  const handleLikePost = async (postId: string) => {
    if (!user) {
      toast.error("Please login to like posts");
      return;
    }

    try {
      // Optimistic UI update
      const currentVote = hasUpvoted ? "DOWN" : "UP";
      const newVotes = [...post.votes];

      // Remove existing user vote if any
      const existingVoteIndex = newVotes.findIndex((v) => v.userId === user.id);
      if (existingVoteIndex !== -1) {
        newVotes.splice(existingVoteIndex, 1);
      }

      // Add new vote
      if (currentVote === "UP" || !hasUpvoted) {
        newVotes.push({
          userId: user.id,
          vote: currentVote,
          postId: postId,
        });
      }

      // Update local post state
      const updatedPost = { ...post, votes: newVotes };
      setPosts((prevPosts) => {
        return prevPosts.map((p) => (p.id === postId ? updatedPost : p));
      });

      // Send API request in background
      const voteData = {
        postId,
        vote: currentVote,
      };

      await createVote(voteData);
      // No fetchPost() call to prevent reload
    } catch (error) {
      console.error("Error voting on post:", error);
      toast.error("Failed to vote. Please try again.");
      // Revert optimistic update on error
      fetchPost();
    }
  };
  const upVotes = post?.votes?.filter((vote) => vote.vote === "UP").length;
  const userVote = post.votes?.find((vote) => vote.userId === user?.id);
  const hasUpvoted = userVote?.vote === "UP";
  const handleAddComment = async (postId: string) => {
    if (!newComment.trim()) return;

    // Create a temporary comment for optimistic UI update
    const tempComment = {
      id: `temp-${Date.now()}`,
      commentText: newComment,
      createdAt: new Date().toISOString(),
      user: user,
      userId: user?.id,
    };

    // Optimistic UI update
    const updatedPost = {
      ...post,
      comments: [...(post.comments || []), tempComment],
      totalComments: (post.totalComments || 0) + 1,
    };

    // Update local state
    setPosts((prevPosts) => {
      return prevPosts.map((p) => (p.id === postId ? updatedPost : p));
    });

    // Clear input field immediately
    setNewComment("");

    try {
      // Send API request in background
      const payload = {
        postId,
        commentText: tempComment.commentText,
      };
      const res = await createComment(payload);

      if (!res.success) {
        throw new Error("Failed to add comment");
      }

      // Optional: Update with the real comment from server if needed
      // This is only necessary if the server adds additional data to the comment
      // that we need to display
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment. Please try again.");
      // Revert optimistic update on error
      fetchPost();
    }
  };

  const handleShareClick = () => {
    // Create a shareable URL with the post ID
    const shareUrl = `${window.location.origin}/allpost?postId=${post.id}`;

    // Try to use the Web Share API if available
    if (navigator.share) {
      navigator
        .share({
          title: `Food Discovery by ${post?.user?.name || "JUNAYET"}`,
          text: post?.description?.substring(0, 100) + "...",
          url: shareUrl,
        })
        .then(() => toast.success("Post shared successfully"))
        .catch((error) => {
          console.error("Error sharing:", error);
          copyToClipboard(shareUrl);
        });
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast.success("Share link copied to clipboard!");
      },
      () => {
        toast.error("Failed to copy link");
      }
    );
  };

  const handleLocationClick = (location: string) => {
    const query = encodeURIComponent(location);
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${query}`,
      "_blank"
    );
  };
  const fetchPost = async () => {
    const res = await getAllPost();
    console.log(res);
    if (res.success) {
      setPosts(res.data);
    }
  };
  useEffect(() => {
    // Only fetch posts on initial mount, not when post changes
    fetchPost();
  }, []); // Empty dependency array to run only once
  return (
    <Card className="overflow-hidden mt-4">
      <CardHeader className="pb-3">
        <div className="md:flex justify-between items-start">
          <div className="flex items-center justify-center md:justify-normal gap-4">
            <Avatar className=" h-12 w-12">
              <AvatarImage
                src={post?.user?.image ?? ""}
                alt={post.user?.email}
              />
              <AvatarFallback>{post.user?.email.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">{post?.user?.name}</div>
              <div className=" text-sm text-gray-500">
                <span>
                  {" "}
                  {formatDistanceToNow(new Date(post?.createdAt), {
                    addSuffix: true,
                  })}
                </span>

                <button
                  onClick={() => handleLocationClick(post.location)}
                  className="flex items-center text-blue-600 hover:underline cursor-pointer"
                >
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>{post.location}</span>
                  <Navigation className="h-3 w-3 ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-4 whitespace-pre-line">
          {post.description}
        </p>

        {/* {post.images.length > 0 && (
          <div className="mb-4">
            {post.images.length === 1 ? (
              <Image
                height={500}
                width={500}
                src={post.images[0]}
                alt={`Food image`}
                className="rounded-lg w-full object-cover max-h-96"
              />
            ) : (
              <div
                className={`grid grid-cols-${Math.min(
                  post.images.length,
                  2
                )} gap-2`}
              >
                {post.images.map((image, index) => (
                  <Image
                    height={500}
                    width={500}
                    key={index}
                    src={image}
                    alt={`Food image ${index + 1}`}
                    className="rounded-lg w-full object-cover h-48"
                  />
                ))}
              </div>
            )}
          </div>
        )} */}

        {post?.image && (
          <Image
            height={500}
            width={500}
            src={post?.image}
            alt={`Food image`}
            className="rounded-lg w-full object-cover max-h-96 "
          />
        )}
      </CardContent>
      <CardFooter className="border-t pt-3 flex flex-col">
        <div className="w-full overflow-x-auto md:overflow-visible">
          <div className="flex justify-between w-full pb-3">
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLikePost(post.id)}
                className={hasUpvoted ? "text-red-500" : ""}
              >
                <Heart className="w-4 h-4 mr-1" />
                {upVotes}
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              {`Comments ${post.totalComments}`}
            </Button>

            <Button variant="ghost" size="sm" onClick={handleShareClick}>
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {showComments && (
          <div className="w-full">
            {(post.comments || []).map((comment: any) => (
              <div key={comment.id} className="py-3 border-t">
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment?.user?.image} />
                    <AvatarFallback>
                      {comment?.user?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-gray-100 rounded-xl p-3">
                      <div className="font-semibold text-sm">
                        {comment?.user?.name}
                      </div>
                      <p className="text-sm">{comment?.commentText}</p>
                    </div>
                    <div className="flex gap-4 mt-1 text-xs text-gray-500">
                      <button>
                        {formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true,
                        })}
                      </button>
                      {/* <button>Like ({comment.likes})</button> */}
                      <button>Reply</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex items-center gap-2 mt-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.image ?? ""} />
                <AvatarFallback>You</AvatarFallback>
              </Avatar>
              <div className="flex-1 relative">
                <Input
                  placeholder="Write a comment..."
                  className="pr-10 bg-gray-100 border-none"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute right-0 top-0 h-full text-blue-600"
                  onClick={() => handleAddComment(post.id)}
                  disabled={!newComment.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default FoodPostCard;
