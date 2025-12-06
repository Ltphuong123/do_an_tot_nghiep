# React Query Implementation - Tối ưu Like/Comment State Management

## 🎯 Vấn đề đã được giải quyết

Trước đây, khi like bài viết ở màn hình chi tiết và quay lại danh sách bài viết, số lượng like **KHÔNG** được cập nhật tự động mà cần phải reload toàn bộ danh sách.

## ✅ Giải pháp với React Query

Giờ đây, với React Query:

- ✨ **Optimistic Updates**: UI phản hồi ngay lập tức khi like/unlike
- 🔄 **Auto Sync**: Tất cả màn hình tự động đồng bộ state
- 💾 **Smart Caching**: Không cần reload danh sách khi quay lại
- ⚡ **Better Performance**: Giảm số lượng API calls

## 📦 Các file đã thay đổi

### 1. **app/\_layout.tsx**

- Thêm `QueryClientProvider` wrap toàn bộ app
- Cấu hình cache: staleTime 5 phút, gcTime 10 phút

```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Cache 5 phút
      gcTime: 1000 * 60 * 10, // Giữ trong memory 10 phút
    },
  },
});
```

### 2. **hooks/usePost.ts** (File mới)

Custom hooks quản lý toàn bộ logic posts:

#### `usePostList(topic, page, limit)`

Fetch danh sách bài viết với pagination

#### `useLikePost()`

Mutation để like/unlike bài viết với:

- **Optimistic updates**: Cập nhật UI ngay lập tức
- **Auto rollback**: Tự động rollback khi lỗi
- **Cache sync**: Cập nhật tất cả post list queries

#### `usePostComments(postId)`

Fetch comments của bài viết

#### `useUpdateCommentCount()`

Helper function để cập nhật comment count trong cache

### 3. **app/(tabs)/community/index.tsx**

Refactor Community screen:

- ❌ Xóa: Local state `posts`, `isLoadingMore`, `isRefreshing`
- ❌ Xóa: Manual fetch logic với `handleFetchPosts`
- ❌ Xóa: DeviceEventEmitter listeners
- ✅ Thêm: `usePostList` hook
- ✅ Thêm: Auto-accumulate posts khi pagination

```tsx
const {
  data: postsData,
  isLoading,
  isRefetching,
  refetch,
} = usePostList(activeFilter, page, LIMIT);
```

### 4. **app/(tabs)/community/components/postCard.tsx**

Refactor PostCard component:

- ❌ Xóa: Local state `isLiked`, `likesCount`
- ❌ Xóa: Manual optimistic updates
- ❌ Xóa: DeviceEventEmitter listeners
- ✅ Thêm: `useLikePost` mutation
- ✅ Derive state từ `post` prop (synced by React Query)

```tsx
const likeMutation = useLikePost();
const handleLike = () => likeMutation.mutate(post.id);
```

### 5. **app/postDetail/index.tsx**

Refactor PostDetail screen:

- ❌ Xóa: Local state `isLiked`, `likesCount`, `comments`
- ❌ Xóa: Manual fetch `handleFetchComments`
- ✅ Thêm: `useLikePost`, `usePostComments`, `useUpdateCommentCount`
- ✅ Comments tự động fetch và refetch khi cần

```tsx
const likeMutation = useLikePost();
const { data: comments, refetch: refetchComments } = usePostComments(postId);
const updateCommentCount = useUpdateCommentCount();
```

## 🔄 Workflow hoạt động

### Khi Like bài viết:

1. **User clicks Like** (PostCard hoặc PostDetail)
2. **Optimistic Update**: UI cập nhật ngay lập tức
   - `isLiked` toggle
   - `likesCount` +1 hoặc -1
3. **API Call**: Gửi request đến server
4. **Success**:
   - Cập nhật cache với data từ server
   - Tất cả màn hình hiển thị bài viết này **tự động sync**
5. **Error**:
   - Rollback về state cũ
   - Hiển thị error message

### Khi Comment:

1. **User gửi comment**
2. **API Call**: Create comment
3. **Success**:
   - Refetch danh sách comments
   - Gọi `updateCommentCount()` để cập nhật count trong cache
   - **Tất cả màn hình tự động cập nhật comment count**

### Khi quay lại Community:

- ✨ **Không cần reload**: Data đã được sync từ PostDetail
- ⚡ **Instant update**: Like count, comment count đều đã đúng
- 💾 **From cache**: Load instant từ cache (5 phút)

## 🎨 Cache Strategy

React Query quản lý cache thông minh:

```typescript
// Query keys organization
postKeys = {
  all: ["posts"],
  lists: ["posts", "list"],
  list: ["posts", "list", { topic, page, limit }],
  detail: ["posts", "detail", postId],
  comments: ["posts", "comments", postId],
};
```

Khi update một post:

- ✅ Update trong `detail` cache
- ✅ Update trong **TẤT CẢ** `list` queries có chứa post đó
- ✅ Tất cả component đang subscribe sẽ tự động re-render

## 🚀 Performance Benefits

### Trước (Without React Query):

- 🐌 Fetch lại toàn bộ danh sách mỗi lần quay về
- 🐌 Multiple DeviceEventEmitter listeners
- 🐌 Manual state synchronization
- ❌ Có thể bị race condition

### Sau (With React Query):

- ⚡ Load instant từ cache
- ⚡ Chỉ fetch khi cần (stale data)
- ⚡ Optimistic updates cho UX tốt hơn
- ✅ Tự động dedupe requests
- ✅ Background refetch khi focus
- ✅ Retry tự động khi lỗi

## 📝 Migration Notes

### DeviceEventEmitter

- Không còn cần dùng `DeviceEventEmitter.emit("postLiked")`
- React Query tự động sync state qua cache
- Giữ lại emit trong `useLikePost` để backward compatibility (nếu có component cũ)

### Loading States

- Không cần `startLoading()`, `stopLoading()` cho post operations
- Dùng `isLoading`, `isRefetching` từ hooks
- Có thể giữ loading overlay cho các operation khác

### Error Handling

- React Query có retry mechanism tự động
- Rollback optimistic updates khi lỗi
- Hiển thị snackbar trong `onError` callback

## 🔧 Debugging Tips

### React Query Devtools (Optional)

Có thể thêm React Query Devtools để debug:

```tsx
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// In _layout.tsx
<QueryClientProvider client={queryClient}>
  {/* ... */}
  {__DEV__ && <ReactQueryDevtools initialIsOpen={false} />}
</QueryClientProvider>;
```

### Log cache state

```typescript
import { useQueryClient } from "@tanstack/react-query";

const queryClient = useQueryClient();
console.log(queryClient.getQueryData(postKeys.detail(postId)));
```

## 🎯 Kết quả

✅ Like bài viết ở PostDetail → Quay lại Community → **Like count đã cập nhật**  
✅ Comment ở PostDetail → Quay lại Community → **Comment count đã cập nhật**  
✅ **KHÔNG CẦN** reload danh sách  
✅ UI phản hồi ngay lập tức (optimistic)  
✅ Code sạch hơn, ít bug hơn

---

**Tác giả**: GitHub Copilot  
**Ngày**: November 20, 2025
