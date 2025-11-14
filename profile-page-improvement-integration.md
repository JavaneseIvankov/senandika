# Requirements
1. Saya ingin kamu membantu saya untuk melakukan improvement terhadap ui pada src/app/dashboard/profile/page.tsx, Analitik yang akan ditampilkan sesuai dengan tipe data sesuai pada analyticsActions.ts
2. Mengintegrasikan ui yang dibuat dengan server actions yang ada (terutama pada analyticscActions.ts) melalui custom hook.
3. Integrasikan bagian profile section dengan menggunakan better auth client untuk mendapatkan session data dan menampilkan data user yang saat ini.

Jangan ragu untuk melakukan dekomposisi komponen menjadi komponen-komponen yang lebih kecil agar lebih mudah dipahami. Gunakan shadcn (src/shared/components/ui/**) dan tailwindcss.

# Plan

## 1. Analisis File yang Ada
- [x] Menganalisis `src/actions/analyticsActions.ts` untuk memahami struktur data `SerializedAnalytics`
- [x] Memeriksa komponen profile page saat ini di `src/app/dashboard/profile/page.tsx`
- [x] Melihat ProfileContainer dan ProfileSection yang sudah ada
- [x] Memeriksa komponen analytics card yang ada (`analitycs-card.tsx`)
- [x] Memeriksa Better Auth client setup di `src/lib/auth-client.ts` (useSession hook tersedia)
- [x] Memeriksa komponen ProfileCard yang menggunakan mock data

## 2. Membuat Custom Hooks

### 2.1. Hook untuk Analytics
**File:** `src/hooks/use-analytics.ts`

Hook ini akan:
- Mengelola state untuk analytics data
- Mengelola loading dan error state
- Menyediakan fungsi untuk fetch analytics dengan time range (7, 30, 90 hari)
- Menggunakan `getAnalytics` dari `analyticsActions.ts`
- Mendukung refresh data
- Type-safe dengan `SerializedAnalytics` type

### 2.2. Hook untuk User Profile
**File:** `src/hooks/use-user-profile.ts`

Hook ini akan:
- Menggunakan `useSession` dari Better Auth client (`src/lib/auth-client.ts`)
- Mengelola state untuk user data (name, email, image)
- Menyediakan loading state dari session
- Type-safe dengan Better Auth session types
- Return formatted user data untuk display

## 3. Dekomposisi Komponen Analytics

### 3.1. Komponen Profile Card (Komponen untuk User Info)
**Folder:** `src/features/dashboard/profile-section/component/profile/`

Membuat komponen-komponen untuk profile:
- **`profile-header.tsx`** - Header dengan greeting dan user name
- **`user-info-card.tsx`** - Card untuk menampilkan user info (avatar, name, email)
- **`profile-skeleton.tsx`** - Skeleton loading untuk profile section

### 3.2. Komponen Analytics Cards (Komponen Kecil & Reusable)
**Folder:** `src/features/dashboard/profile-section/component/analytics/`

Membuat komponen-komponen kecil:
- **`stat-card.tsx`** - Komponen card generik untuk menampilkan single stat
- **`session-stats-grid.tsx`** - Grid untuk menampilkan session statistics
- **`mood-chart.tsx`** - Chart untuk mood trends (menggunakan recharts jika tersedia atau shadcn chart)
- **`emotion-list.tsx`** - List top emotions dengan percentage bars
- **`mood-distribution-card.tsx`** - Pie/donut chart untuk mood distribution
- **`gamification-progress.tsx`** - Progress bar untuk level/XP
- **`badge-grid.tsx`** - Grid untuk menampilkan recent badges
- **`insights-card.tsx`** - Card untuk summary insights dengan bullet points

### 3.3. Komponen Container
- **`analytics-dashboard.tsx`** - Main container yang menggunakan use-analytics hook
- **`time-range-selector.tsx`** - Selector untuk 7/30/90 days
- **`profile-dashboard.tsx`** - Container untuk profile info yang menggunakan use-user-profile hook

## 4. Improve UI dengan Shadcn + Tailwind

Menggunakan shadcn components:
- **Card** - untuk container sections
- **Progress** - untuk progress bars (streak, level)
- **Badge** - untuk badges dan tags
- **Skeleton** - untuk loading states
- **Separator** - untuk visual separation
- **Chart** - untuk data visualization (jika tersedia)
- **Tooltip** - untuk additional information
- **Button** - untuk time range selector

Design improvements:
- Responsive grid layout (1 col mobile, 2-3 col desktop)
- Consistent spacing dan padding
- Color coding untuk trends (green=improving, red=worsening, gray=stable)
- Smooth loading states dengan skeleton
- Error handling dengan informative messages
- Empty states untuk data yang tidak ada

## 5. Integrasi dengan Server Actions dan Better Auth

### Update ProfileCard
**File:** `src/features/dashboard/profile-section/component/profile-card.tsx`

- Menghapus mock data dari `dataProfile`
- Menggunakan `use-user-profile` hook
- Menggunakan `useSession` dari Better Auth untuk mendapatkan user data
- Handle loading state dengan profile-skeleton
- Display real user data (name, email, image dari session)

### Update ProfileSection
**File:** `src/features/dashboard/profile-section/component/profile-section.tsx`

- Menghapus mock analytics data
- Menggunakan `use-analytics` hook
- Handle loading state
- Handle error state
- Pass real data ke analytics-dashboard
- Tetap menggunakan ProfileCard yang sudah diupdate

### Update ProfileContainer
**File:** `src/features/dashboard/profile-section/container/profile-container.tsx`

- Memastikan client component wrapping jika diperlukan
- Koordinasi layout

## 6. File Structure yang Akan Dibuat/Dimodifikasi

```
src/
  hooks/
    use-analytics.ts (NEW)
    use-user-profile.ts (NEW)
  
  features/dashboard/profile-section/
    component/
      profile-card.tsx (MODIFY - remove mock data, use Better Auth)
      profile-section.tsx (MODIFY - use real hooks)
      profile/
        profile-header.tsx (NEW)
        user-info-card.tsx (NEW)
        profile-skeleton.tsx (NEW)
      analytics/
        analytics-dashboard.tsx (NEW)
        time-range-selector.tsx (NEW)
        stat-card.tsx (NEW)
        session-stats-grid.tsx (NEW)
        mood-chart.tsx (NEW)
        emotion-list.tsx (NEW)
        mood-distribution-card.tsx (NEW)
        gamification-progress.tsx (NEW)
        badge-grid.tsx (NEW)
        insights-card.tsx (NEW)
        loading-state.tsx (NEW)
        error-state.tsx (NEW)
```

## 7. Implementation Order

1. **Phase 1: Hooks Creation**
   - Buat `use-user-profile.ts` hook (Better Auth integration)
   - Buat `use-analytics.ts` hook (Server Actions integration)
   
2. **Phase 2: Profile Components**
   - Buat profile-skeleton untuk loading state
   - Buat profile-header component
   - Buat user-info-card component
   - Update profile-card untuk menggunakan use-user-profile hook
   
3. **Phase 3: Basic Analytics Components**
   - Buat komponen-komponen dasar (stat-card, loading-state, error-state)
   - Buat time-range-selector
   
4. **Phase 4: Data Display Components**
   - session-stats-grid
   - emotion-list
   - gamification-progress
   - badge-grid
   - insights-card
   
5. **Phase 5: Chart Components**
   - mood-chart
   - mood-distribution-card
   
6. **Phase 6: Main Integration**
   - Buat analytics-dashboard yang meng-compose semua analytics komponen
   - Update profile-section untuk menggunakan kedua hooks (use-user-profile & use-analytics)
   - Koordinasi antara profile display dan analytics display
   
7. **Phase 7: Testing & Refinement**
   - Test Better Auth session integration
   - Test analytics data fetching
   - Test loading states (profile & analytics)
   - Refine UI/UX
   - Handle edge cases (no session, no analytics data)

## 8. Key Considerations

- **Type Safety:** Semua komponen menggunakan TypeScript dengan proper types dari `SerializedAnalytics`
- **Performance:** Lazy loading untuk charts, memoization jika diperlukan
- **Accessibility:** Proper semantic HTML, ARIA labels, keyboard navigation
- **Responsive:** Mobile-first approach
- **Error Handling:** Graceful degradation saat data tidak tersedia
- **Loading States:** Skeleton screens untuk better UX