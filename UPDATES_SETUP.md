# Updates System Setup Guide

This guide will help you complete the setup of your new in-app Updates/Changelog system.

## 🚀 Quick Setup

1. **Update the database schema:**
   ```bash
   npx prisma db push
   ```

2. **Create an admin user (if you don't have one):**
   - Go to your database and set `isAdmin: true` in the `userMetadata` collection for your user
   - Or run: `db.userMetadata.updateOne({userId: "YOUR_USER_ID"}, {$set: {isAdmin: true}})`

3. **Seed demo data (optional):**
   ```bash
   npx tsx scripts/seed-updates.ts
   ```

4. **Start your development server:**
   ```bash
   npm run dev
   ```

## 📁 What Was Created

### Database Models
- `Update` - Main update/announcement entity
- `Placement` - Where and how updates are displayed
- `Audience` - User targeting configuration  
- `UpdateMetric` - Analytics and user interactions
- `UpdateTag` - Categorization and filtering

### API Routes

#### Admin Routes (require admin role)
- `POST /api//updates` - Create update
- `GET /api//updates` - List updates with filtering
- `GET /api//updates/[id]` - Get single update
- `PUT /api//updates/[id]` - Update update
- `DELETE /api//updates/[id]` - Delete update (draft only)
- `POST /api//updates/[id]/publish` - Publish update
- `POST /api//updates/[id]/schedule` - Schedule update
- `POST /api//updates/[id]/archive` - Archive update
- `POST /api//updates/[id]/duplicate` - Duplicate update
- `POST /api//uploads` - Upload media files

#### Public Routes
- `GET /api/updates/eligible` - Get eligible updates for user
- `POST /api/updates/events` - Record user interactions

### Admin UI Pages
- `/updates` - Dashboard overview
- `/updates` - Updates list with filters and stats
- `/updates/new` - Create new update form
- `/updates/[id]` - Edit update form (not implemented yet)

### Components
- `UpdateModal` - Modal overlay display
- `UpdateSlideIn` - Slide-in notification
- `UpdateBanner` - Top/bottom banner
- `UpdateFeedCard` - Feed/list item display
- `UpdatePreview` - Live preview for admin

### Hooks & Utilities
- `useUpdates()` - Fetch eligible updates
- `useModalUpdate()` - Get modal update
- `useBannerUpdate()` - Get banner update
- `useSlideInUpdates()` - Get slide-in updates
- `useFeedUpdates()` - Get feed updates

## 🎯 Key Features

### Placement Types
- **Modal**: Full-screen overlay for important announcements
- **Slide-in**: Non-intrusive corner notifications  
- **Banner**: Top/bottom page banners
- **Feed Card**: Content feed items

### Targeting Options
- User plans (FREE, PRO, etc.)
- Geographic regions
- Feature flags
- Page/route scoping
- Email inclusion lists
- Organization size

### Content Features
- Markdown support for rich text
- Image and video media
- Primary and secondary CTAs
- Tags for categorization
- Scheduled publishing
- One-time or repeated display

### Analytics
- View tracking
- Dismissal rates
- Click-through rates
- User interaction history

## 🔧 Customization

### Adding New Placement Types
1. Add to `PlacementKind` enum in schema
2. Update validation schemas
3. Create new component
4. Add to preview system

### Extending Audience Targeting
1. Add fields to `Audience` model
2. Update `matchesAudience` function
3. Add UI controls in admin forms

### Custom Styling
- Components use Tailwind CSS
- Dark mode support included
- Responsive design for all screen sizes

## 🚀 Usage Examples

### Admin: Create Update
```typescript
// Visit /updates/new
// Fill out form with:
// - Title, subtitle, content
// - Placement settings
// - Audience targeting
// - CTAs and media
// - Save draft or publish
```

### Client: Display Updates
```typescript
import { useModalUpdate } from '@/components/updates/useUpdates';
import { UpdateModal } from '@/components/updates/UpdateModal';

function MyApp() {
  const { update, recordEvent } = useModalUpdate();

  return (
    <>
      {/* Your app content */}
      
      {update && (
        <UpdateModal
          update={update}
          isOpen={true}
          onClose={() => recordEvent(update.id, 'DISMISSED')}
          onEvent={recordEvent}
        />
      )}
    </>
  );
}
```

### API: Get Eligible Updates
```typescript
// GET /api/updates/eligible?path=/dashboard
// Returns:
{
  "modal": [/* highest priority modal update */],
  "banner": [/* highest priority banner update */],
  "slidein": [/* slide-in updates by priority */],
  "feed": [/* feed updates, pinned first */]
}
```

## 🔐 Security Features

- Admin role verification
- Rate limiting on events API
- File upload validation
- Input sanitization
- CSRF protection

## 📊 Analytics Integration

The system tracks:
- `SEEN` - Update viewed by user
- `DISMISSED` - User closed/dismissed
- `CTA_CLICK` - Primary CTA clicked
- `SECONDARY_CTA_CLICK` - Secondary CTA clicked

Events include metadata like user path, timestamp, and custom data.

## 🔄 Scheduled Publishing

Set up a cron job to check for scheduled updates:

```bash
# Every minute
* * * * * curl -X POST https://yourapp.com/api//updates/check-scheduled
```

Or implement in your app using a background job processor.

## 📱 Mobile Considerations

- All components are responsive
- Touch-friendly interactions
- Optimized for mobile viewports
- Swipe gestures supported

## 🎨 Theming

Components support:
- Light/dark mode toggle
- Custom color schemes
- Brand-specific styling
- CSS custom properties

## ⚡ Performance

- Lazy loading of components
- Efficient API caching
- Optimized database queries
- Image optimization support

## 🚨 Troubleshooting

### Common Issues

1. **Admin access denied**
   - Ensure user has `isAdmin: true` in userMetadata

2. **Updates not showing**
   - Check audience targeting criteria
   - Verify update is published
   - Check placement scope matches current path

3. **File uploads failing**
   - Ensure `public/uploads` directory exists
   - Check file size limits
   - Verify file type restrictions

4. **Database errors**
   - Run `npx prisma db push` to sync schema
   - Check MongoDB connection

### Debug API Calls
```bash
# Test eligible updates
curl "http://localhost:3000/api/updates/eligible?path=/dashboard"

# Test admin access  
curl -X GET "http://localhost:3000/api//updates"
```

## 🎉 You're All Set!

Your updates system is ready to use! Visit `/updates` to start creating your first announcements.

For additional help or feature requests, refer to the code documentation or contact your development team.
