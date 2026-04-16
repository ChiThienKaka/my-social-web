import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Eye,
  MessageSquare,
  Flag,
  EyeOff,
  Trash2,
  User,
  EyeClosed,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  postsService,
  commentsService,
  reportsService,
} from "../services/crudService";
import type { Post, Comment, Report } from "../data/mockData";

export function PostDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showHideDialog, setShowHideDialog] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");

  // Load post data
  useEffect(() => {
    const loadData = async () => {
      if (!id) return;

      setIsLoading(true);
      try {
        const [postData, commentsData, reportsData] = await Promise.all([
          postsService.getById(id),
          commentsService.getByPostId(id),
          reportsService.getByPostId(id),
        ]);

        setPost(postData);
        setComments(commentsData);
        setReports(reportsData);
      } catch (error) {
        console.error("Failed to load post:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  // Handle hide post
  const handleHidePost = async () => {
    if (!post) return;

    try {
      await postsService.hide(post.id);
      setPost({ ...post, status: "hidden" });
      setShowHideDialog(false);
    } catch (error) {
      console.error("Failed to hide post:", error);
    }
  };

  // Handle unhide post
  const handleUnhidePost = async () => {
    if (!post) return;

    try {
      await postsService.unhide(post.id);
      setPost({ ...post, status: "active" });
    } catch (error) {
      console.error("Failed to unhide post:", error);
    }
  };

  // Handle delete post
  const handleDeletePost = async () => {
    if (!post) return;

    try {
      await postsService.delete(post.id);
      navigate("/admin/community/posts");
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  // Handle save admin notes
  const handleSaveNotes = () => {
    // In a real app, this would save to backend
    console.log("Admin notes saved:", adminNotes);
    // You could show a toast notification here
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500">Loading post...</div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900">Post not found</h2>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate("/admin/community/posts")}
          >
            Back to Posts
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Post Detail"
        backButton={{
          label: "Back to Posts",
          onClick: () => navigate("/admin/community/posts"),
        }}
      />

      <div className="grid grid-cols-3 gap-6">
        {/* Main Content - Left Column (2/3) */}
        <div className="col-span-2 space-y-6">
          {/* Post Content Card */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={post.author.avatar} />
                    <AvatarFallback>
                      {(post.author.full_name || post.author.name || "U")[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">
                      {post.author.full_name || post.author.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {post.author.studentId} • {post.createdAt}
                    </div>
                  </div>
                </div>
                <StatusBadge status={post.status} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {post.content}
                </p>
              </div>

              <Separator className="my-4" />

              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MessageSquare size={16} />
                  {post.commentCount} comments
                </div>
                <div className="flex items-center gap-1">
                  <Eye size={16} />
                  {post.viewCount} views
                </div>
                <div className="flex items-center gap-1">
                  <Flag size={16} />
                  {post.reportCount} reports
                </div>
                <div className="text-gray-500">
                  Topic: <span className="font-medium">{post.topic.name}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare size={20} />
                Comments ({comments.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {comments.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No comments yet
                </p>
              ) : (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.author.avatar} />
                        <AvatarFallback>
                          {(comment.author.full_name ||
                            comment.author.name ||
                            "C")[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="rounded-lg bg-gray-100 p-3">
                          <div className="font-medium text-sm">
                            {comment.author.full_name || comment.author.name}
                          </div>
                          <p className="text-gray-700 text-sm mt-1 whitespace-pre-wrap">
                            {comment.content}
                          </p>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {comment.createdAt}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Reports Section */}
          {reports.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <Flag size={20} />
                  Reports ({reports.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reports.map((report) => (
                    <div
                      key={report.id}
                      className="rounded-lg border border-red-200 bg-red-50 p-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-sm">
                            {report.reporter.full_name || report.reporter.name}
                            <span className="ml-2 text-xs font-normal text-gray-600">
                              ({report.category})
                            </span>
                          </div>
                          <p className="text-gray-700 text-sm mt-1">
                            {report.reason}
                          </p>
                          <div className="mt-2">
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                report.status === "pending"
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              {report.status === "pending"
                                ? "Pending"
                                : "Resolved"}
                            </span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {report.createdAt}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar - Right Column (1/3) */}
        <div className="col-span-1 space-y-6">
          {/* Moderation Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Moderation Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {post.status === "hidden" ? (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleUnhidePost}
                >
                  <EyeClosed size={16} className="mr-2" />
                  Unhide Post
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setShowHideDialog(true)}
                >
                  <EyeOff size={16} className="mr-2" />
                  Hide Post
                </Button>
              )}

              <Button
                variant="destructive"
                className="w-full justify-start"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 size={16} className="mr-2" />
                Delete Post
              </Button>

              <Separator />

              <Button variant="outline" className="w-full justify-start">
                <User size={16} className="mr-2" />
                View Author Profile
              </Button>
            </CardContent>
          </Card>

          {/* Post Metadata Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Post Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <div className="text-gray-600">Topic</div>
                <div className="font-medium">{post.topic.name}</div>
              </div>
              <Separator />
              <div>
                <div className="text-gray-600">Created At</div>
                <div className="font-medium">{post.createdAt}</div>
              </div>
              <Separator />
              <div>
                <div className="text-gray-600">Updated At</div>
                <div className="font-medium">{post.updatedAt}</div>
              </div>
              <Separator />
              <div>
                <div className="text-gray-600">Status</div>
                <div className="font-medium">
                  <StatusBadge status={post.status} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Admin Notes Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Admin Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="notes">Internal Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add notes about this post (visible to admins only)..."
                  className="mt-2"
                  rows={4}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                />
              </div>
              <Button size="sm" className="w-full" onClick={handleSaveNotes}>
                Save Notes
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The post and all its comments will
              be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePost}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Hide Confirmation Dialog */}
      <AlertDialog open={showHideDialog} onOpenChange={setShowHideDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hide Post?</AlertDialogTitle>
            <AlertDialogDescription>
              This post will be hidden from public view but can be restored
              later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleHidePost}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
