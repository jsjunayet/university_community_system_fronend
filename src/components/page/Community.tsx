"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import {
  Eye,
  Heart,
  Image as ImageIcon,
  LocationEdit,
  MessageCircle,
  MoreHorizontal,
  Send,
  Share2,
} from "lucide-react";
import { useState } from "react";

interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorRole: string;
  content: string;
  image?: string;
  timestamp: Date;
  likes: string[];
  comments: Comment[];
  shares: number;
  type: "post" | "story";
}

interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  timestamp: Date;
  likes: string[];
  replies: Reply[];
}

interface Reply {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  timestamp: Date;
  likes: string[];
}

interface Story {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  image?: string;
  timestamp: Date;
  views: string[];
  expiresAt: Date;
}

const Community = () => {
  const { user } = useAuth();
  const [newPostContent, setNewPostContent] = useState("");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [newComment, setNewComment] = useState("");

  // Mock data
  const mockPosts: Post[] = [
    {
      id: "1",
      authorId: "1",
      authorName: "John Doe",
      authorRole: "Student",
      content:
        "Just finished my final project! Excited to graduate next semester. Thanks to all the amazing professors and classmates who helped me along the way! 🎓",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      likes: ["2", "3"],
      comments: [
        {
          id: "c1",
          authorId: "2",
          authorName: "Sarah Wilson",
          content: "Congratulations! What was your project about?",
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
          likes: ["1"],
          replies: [
            {
              id: "r1",
              authorId: "1",
              authorName: "John Doe",
              content:
                "It was a web application for university event management!",
              timestamp: new Date(Date.now() - 30 * 60 * 1000),
              likes: [],
            },
          ],
        },
      ],
      shares: 3,
      type: "post",
    },
    {
      id: "2",
      authorId: "2",
      authorName: "Sarah Wilson",
      authorRole: "Alumni",
      content:
        "Great networking event today! Met so many talented students. The future looks bright! 💼✨",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      likes: ["1", "3"],
      comments: [],
      shares: 1,
      type: "post",
    },
  ];

  const mockStories: Story[] = [
    {
      id: "s1",
      authorId: "1",
      authorName: "John Doe",
      content: "Studying at the library",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      views: ["2", "3"],
      expiresAt: new Date(Date.now() + 23 * 60 * 60 * 1000),
    },
    {
      id: "s2",
      authorId: "2",
      authorName: "Sarah Wilson",
      content: "Alumni meetup vibes!",
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      views: ["1"],
      expiresAt: new Date(Date.now() + 22 * 60 * 60 * 1000),
    },
  ];

  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [stories] = useState<Story[]>(mockStories);

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;

    const newPost: Post = {
      id: Date.now().toString(),
      authorId: user?.id || "",
      authorName: user?.name || "",
      authorRole: user?.role || "",
      content: newPostContent,
      timestamp: new Date(),
      likes: [],
      comments: [],
      shares: 0,
      type: "post",
    };

    setPosts([newPost, ...posts]);
    setNewPostContent("");
  };

  const handleLikePost = (postId: string) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          const isLiked = post.likes.includes(user?.id || "");
          return {
            ...post,
            likes: isLiked
              ? post.likes.filter((id) => id !== user?.id)
              : [...post.likes, user?.id || ""],
          };
        }
        return post;
      })
    );
  };

  const handleAddComment = (postId: string) => {
    if (!newComment.trim()) return;

    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          const newCommentObj: Comment = {
            id: Date.now().toString(),
            authorId: user?.id || "",
            authorName: user?.name || "",
            content: newComment,
            timestamp: new Date(),
            likes: [],
            replies: [],
          };
          return {
            ...post,
            comments: [...post.comments, newCommentObj],
          };
        }
        return post;
      })
    );
    setNewComment("");
  };

  const PostCard = ({ post }: { post: Post }) => (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={post.authorAvatar} />
              <AvatarFallback>{post.authorName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold">{post.authorName}</h4>
              <p className="text-sm text-muted-foreground">
                {post.authorRole} • {post.timestamp.toLocaleString()}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="mb-4">{post.content}</p>
        {post.image && (
          <img
            src={post.image}
            alt="Post content"
            className="w-full rounded-lg mb-4"
          />
        )}

        <div className="flex items-center justify-between border-t pt-3">
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleLikePost(post.id)}
              className={
                post.likes.includes(user?.id || "") ? "text-red-500" : ""
              }
            >
              <Heart className="w-4 h-4 mr-1" />
              {post.likes.length}
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
              {post.shares}
            </Button>
          </div>
        </div>

        {post.comments.length > 0 && (
          <div className="mt-4 space-y-3">
            {post.comments.slice(0, 2).map((comment) => (
              <div key={comment.id} className="flex gap-2">
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
                      {comment.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                </div>
              </div>
            ))}
            {post.comments.length > 2 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedPost(post)}
              >
                View all {post.comments.length} comments
              </Button>
            )}
          </div>
        )}

        <div className="flex gap-2 mt-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 flex gap-2">
            <Input
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddComment(post.id)}
            />
            <Button size="sm" onClick={() => handleAddComment(post.id)}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

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
                  <AvatarImage src={user?.avatar} />
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
                      <Button variant="ghost" size="sm">
                        <ImageIcon className="w-4 h-4 mr-1" />
                        Photo
                      </Button>
                      <Button variant="ghost" size="sm">
                        <LocationEdit className="w-4 h-4 mr-1" />
                        Location
                      </Button>
                    </div>
                    <Button
                      onClick={handleCreatePost}
                      disabled={!newPostContent.trim()}
                    >
                      Post
                    </Button>
                  </div>
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

        <TabsContent value="stories" className="space-y-4">
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
        </TabsContent>
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
    </div>
  );
};

export default Community;
