const formatTimeAgo = (dateString: string, language: "vi" | "en" = "vi") => {
  const now = new Date();
  const notificationDate = new Date(dateString);
  const diffInMinutes = Math.floor(
    (now.getTime() - notificationDate.getTime()) / (1000 * 60)
  );

  if (language === "vi") {
    if (diffInMinutes < 1) return "Vừa xong";
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} giờ trước`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} ngày trước`;

    return notificationDate.toLocaleDateString("vi-VN");
  } else {
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;

    return notificationDate.toLocaleDateString("en-US");
  }
};

export default formatTimeAgo;
