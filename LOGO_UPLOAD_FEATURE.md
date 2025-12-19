# Logo Upload Feature - Admin Guide

## 🎨 Overview

Admins can now upload and manage the platform logo directly from the admin dashboard. The logo will be displayed in the navbar across the entire platform.

---

## 📍 How to Access

1. Login as admin
2. Navigate to **Admin → Settings**
3. Find the "Platform Logo" section at the top
4. Upload your logo image

---

## 🚀 Features

### **Logo Upload:**
- ✅ Drag & drop or click to select
- ✅ Supports: PNG, JPG, JPEG, GIF, SVG
- ✅ Max file size: 2MB
- ✅ Live preview before upload
- ✅ File size and name display

### **Logo Display:**
- ✅ Automatically shown in navbar
- ✅ Replaces default "FYNEX" text logo
- ✅ Responsive sizing (max height: 32px)
- ✅ Updates immediately for all users

---

## 🔧 Technical Implementation

### Backend

#### Database Schema:
```prisma
model Settings {
  id             Int     @id @default(1)
  depositAddress String?
  qrCodeUrl      String?
  logoUrl        String?  // NEW FIELD
}
```

#### New Endpoints:

| Method | Endpoint | Access | Purpose |
|--------|----------|--------|---------|
| POST | `/settings/admin/upload-logo` | Admin only | Upload logo file |
| GET | `/settings/logo` | Public | Get current logo URL |

#### File Storage:
- Location: `backend/uploads/logo/`
- Naming: `logo-{timestamp}-{random}.{ext}`
- Served at: `http://localhost:4000/uploads/logo/{filename}`

---

### Frontend

#### Admin Settings Page Updates:

**New Section: "Platform Logo"**
- Current logo display
- File upload interface
- Preview before upload
- Upload/Cancel buttons
- Success/error messages

#### Navbar Updates:

**Dynamic Logo Display:**
```typescript
{logoData?.logoUrl ? (
  <img src={`http://localhost:4000${logoData.logoUrl}`} alt="Fynex Logo" />
) : (
  <div>FYNEX (gradient text + arrow)</div>
)}
```

---

## 📋 How to Use

### Step 1: Prepare Your Logo

**Recommended Specifications:**
- Format: PNG with transparency (best) or SVG
- Dimensions: 200px height (width auto)
- File size: Under 500KB
- Background: Transparent
- Colors: Match your brand (turquoise/cyan)

### Step 2: Upload

1. Go to **Admin → Settings**
2. Find "Platform Logo" section
3. Click the upload area or drag & drop your logo
4. Preview appears automatically
5. Click **"Upload Logo"**
6. Success message appears

### Step 3: Verify

1. Check the navbar - logo should appear immediately
2. Test on different pages
3. Verify on mobile view
4. Check with other users

---

## 🎨 Logo Guidelines

### Your Fynex Logo:
- **Text:** "FYNEX" in bold sans-serif
- **Color:** Dark blue/teal letters
- **Accent:** Bright turquoise/cyan upward arrow
- **Style:** Modern, geometric
- **Arrow:** Originates from "Y", points upward through "N"

### Upload Tips:
- Use PNG with transparent background
- Ensure arrow is clearly visible
- Test on dark backgrounds
- Keep it under 200px height for navbar
- Maintain aspect ratio

---

## 🔄 Fallback Behavior

**If no logo uploaded:**
- Shows CSS-styled "FYNEX" text with gradient
- Includes upward arrow icon
- Matches brand colors (cyan/blue)

**If logo fails to load:**
- Automatically falls back to text logo
- No broken images
- Seamless user experience

---

## 🔒 Security

✅ **Admin-only access** with JWT + role guards  
✅ **File type validation** (images only)  
✅ **File size limit** (2MB max)  
✅ **Secure file storage** in uploads directory  
✅ **Unique filenames** to prevent conflicts  

---

## 📁 File Structure

```
backend/
├── uploads/
│   └── logo/
│       └── logo-1234567890-123456789.png  (your uploaded logos)
├── src/
│   └── settings/
│       ├── settings.service.ts  (logo upload logic)
│       └── settings.controller.ts  (upload endpoint)
└── prisma/
    └── schema.prisma  (Settings model with logoUrl)

frontend/
├── app/
│   └── admin/
│       └── settings/
│           └── page.tsx  (logo upload UI)
└── components/
    └── MainNavbar.tsx  (displays logo)
```

---

## ⚠️ Important Notes

### For Production:

1. **CDN Recommended:**
   - Upload logos to AWS S3, Cloudinary, or similar
   - Update `logoUrl` to use CDN URLs
   - Better performance and reliability

2. **Image Optimization:**
   - Compress images before upload
   - Use WebP format for better compression
   - Consider lazy loading

3. **Backup:**
   - Keep original logo files
   - Document logo specifications
   - Version control for logo changes

### File Size Considerations:

- **Current limit:** 2MB
- **Recommended:** Under 500KB
- **Optimal:** 100-200KB
- Smaller files = faster page loads

---

## 🎯 Next Steps

### To Use Your Fynex Logo:

1. **Save your Fynex logo** as a PNG file (with transparent background)
2. **Go to Admin → Settings**
3. **Upload the logo**
4. **Verify** it appears in the navbar
5. **Test** across different pages and devices

### Alternative: Direct File Placement

If you prefer, you can also:
1. Save logo to: `frontend/public/fynex-logo.png`
2. Update navbar to use: `/fynex-logo.png`
3. No database needed

---

## ✅ Status

- Database schema: ✅ Updated (logoUrl field added)
- Backend endpoints: ✅ Created
- File upload: ✅ Configured (multer)
- Admin UI: ✅ Upload interface created
- Navbar: ✅ Dynamic logo display
- Static file serving: ✅ Enabled
- Uploads directory: ✅ Created
- .gitignore: ✅ Updated (uploads/ excluded)

**Ready to upload your Fynex logo!** 🎨

---

## 🆘 Troubleshooting

**Logo not showing?**
- Check if file uploaded successfully
- Verify URL in database
- Check browser console for errors
- Ensure backend server is running

**Upload fails?**
- Check file size (< 2MB)
- Verify file type (image only)
- Check uploads/ directory permissions
- Review backend logs

**Logo too large/small?**
- Navbar height is 32px
- Logo auto-scales to fit
- Maintain aspect ratio
- Use transparent background

---

**Last Updated:** December 4, 2025


















