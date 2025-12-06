# Layout Architecture

## Cấu trúc Layout

### 1. Root Layout (`app/_layout.tsx`)

- **Mục đích**: Layout gốc chứa tất cả providers và navigation cơ bản
- **Providers**: QueryClient, Loading, Theme, Language, SpeechRecognition, Notification
- **Navigation**: Stack navigation cho auth và main tabs
- **Features**:
  - Font loading
  - Notification setup
  - User query invalidation

### 2. Tabs Layout (`app/(tabs)/_layout.tsx`)

- **Mục đích**: Bottom tab navigation cho 5 tabs chính
- **Tabs**:
  - `home`: Trang chủ
  - `translate`: Dịch thuật
  - `mockTest`: Thi thử
  - `noteOrAi`: Notebook/AI
  - `community`: Cộng đồng
- **Features**:
  - Auto-hide tabs khi ở sub-screens
  - Lazy loading và detach inactive screens
  - Haptic feedback

### 3. Sub-layouts

Mỗi tab có layout riêng để quản lý stack navigation:

#### `mockTest/_layout.tsx`

- Quản lý các màn hình: index, leaderboard, history, downloaded, takeTest, result, seeAllExam
- Sử dụng slide animation chuẩn

#### `translate/_layout.tsx`

- Quản lý: index, translateHistory
- Sử dụng slide animation chuẩn

#### `noteOrAi/_layout.tsx`

- Quản lý: index, seeAllNotebook, aiLessonResult, aiLessonRevision
- Header ẩn hoàn toàn

#### `community/_layout.tsx`

- Quản lý: index, leaderboard, myProfileScreen, createPost
- Header ẩn hoàn toàn

#### `notebookDetail/_layout.tsx`

- Quản lý chi tiết notebook: [id], vocab, createVocab, revision, wordFill, flashcard, pronunciation

## Centralized Configuration

### `constants/navigation.ts`

- **NavigationConfig**: Centralized tất cả navigation options
- **Ưu điểm**:
  - Tránh duplicate code
  - Dễ maintain consistency
  - Theme-aware configurations
  - Type-safe

### `constants/animation.ts`

- **AnimationConfig**: Tất cả animation parameters
- **Types**: instant, fast, normal, slow, verySlow
- **Curves**: iOS-like, Material Design, smooth easing

## Best Practices

### ✅ Đang làm tốt:

- File-based routing với Expo Router
- Proper provider hierarchy
- Theme-aware styling
- Lazy loading cho tabs
- Centralized animation configs

### 🔄 Cần cải thiện:

- Có thể group routes để tổ chức tốt hơn
- Thêm error boundaries
- Optimize re-renders với React.memo cho layouts
- Add loading states cho navigation

### 📝 Recommendations:

1. **Group Routes**: Sử dụng `(auth)`, `(main)`, `(modal)` groups
2. **Error Boundaries**: Wrap layouts với error boundaries
3. **Navigation Guards**: Thêm auth guards cho protected routes
4. **Deep Linking**: Cấu hình deep linking cho notifications
5. **Performance**: Memoize navigation options nếu cần

## Navigation Flow

```
Root Layout
├── Auth Stack (register, login)
├── Main Tabs
│   ├── Home Tab
│   ├── Translate Tab
│   │   ├── Index
│   │   └── History
│   ├── MockTest Tab
│   │   ├── Index
│   │   ├── Take Test (complex flow)
│   │   └── Result
│   ├── NoteOrAi Tab
│   │   ├── Index
│   │   └── AI Lesson flow
│   └── Community Tab
│       ├── Index
│       └── Profile/Post management
└── Modal Stacks (notebookDetail, postDetail, tips, notification)
```
