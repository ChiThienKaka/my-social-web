import { TrendingUp, Eye, Heart, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface TopPost {
  id: string;
  title: string;
  author: string;
  views: number;
  likes: number;
  comments: number;
  createdAt: string;
}

interface TopPostsListProps {
  posts: TopPost[];
}

export function TopPostsList({ posts }: TopPostsListProps) {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp size={20} />
            Top Posts
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => navigate('/admin/community/posts')}>
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {posts.length === 0 ? (
          <div className="py-8 text-center text-gray-500">No posts available</div>
        ) : (
          <div className="space-y-4">
            {posts.map((post, index) => (
              <div
                key={post.id}
                className="flex items-start gap-3 rounded-lg border border-gray-200 p-3 hover:bg-gray-50"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 line-clamp-2">{post.title}</h4>
                  <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className="text-xs">{post.author[0]}</AvatarFallback>
                      </Avatar>
                      <span>{post.author}</span>
                    </div>
                    <span>•</span>
                    <span>{post.createdAt}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Eye size={14} />
                      {post.views}
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart size={14} />
                      {post.likes}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare size={14} />
                      {post.comments}
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/admin/community/posts/${post.id}`)}
                >
                  View
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
