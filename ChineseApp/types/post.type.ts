export interface IPost {
  id: string;
  title: string;
  content: {
    text: string;
    html: string;
    images: string[];
  };
  topic: string;
  likes: number;
  views: number;
  comments: number;
  created_at: string;
  is_approved: boolean;
  is_pinned: boolean;
  user: {
    id: string;
    name: string;
    level: string;
    avatar_url: string;
    badge_level: number;
    community_points: number;
  };
  badge: {
    icon: string;
    name: string;
    level: number;
  };
  comment_count: number;
  isLiked: boolean;
  isCommented: boolean;
  isViewed: boolean;
}

export interface IComment {
  id: string;
  post_id: string;
  user_id: string;
  user: {
    id: string;
    name: string;
    avatar_url: string;
  };
  content: {
    text: string;
  };
  parent_comment_id: string | null;
  created_at: string;
  deleted_at: string | null;
  deleted_reason: string | null;
  deleted_by: string | null;
  badge: {
    level: number;
    name: string;
    icon: string;
  };
  replies: IComment[];
}

export interface IPostLike {
  id: string;
  post_id: string;
  user: {
    id: string;
    username: string;
    avatar_url: string;
    badge: {
      id: string;
      level: number;
      name: string;
      icon: string;
      min_points: number;
      rule_description: string;
      is_active: boolean;
    };
    level: number;
  };
  created_at: string;
}

export interface IPostView {
  id: string;
  post_id: string;
  user: {
    id: string;
    username: string;
    avatar_url: string;
    badge: {
      id: string;
      level: number;
      name: string;
      icon: string;
      min_points: number;
      rule_description: string;
      is_active: boolean;
    };
    level: number;
  };
  viewed_at: string;
}

export interface ICommunityLeaderboard {
  user_id: string;
  user_name: string;
  user_avatar: string | null;
  user_level: string;
  community_points: number;
  badge_level: number;
  badge_name: string;
  badge_icon: string;
  badge_min_points: number;
}

export interface ICommentRequest {
  post_id: string;
  content: string;
  parent_comment_id?: string;
}

export interface IListUserLikeOrView {
  user_id: string;
  name: string;
  avatar_url: string;
  level: string;
  badge_level_id: number;
  badge_name: string;
  badge_icon: string;
}
