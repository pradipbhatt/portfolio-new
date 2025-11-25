# EmailJS Contact Form - Setup Complete! ✅

Your contact form is working with the test template! Now create a custom template for better emails.

## ✅ Current Status

- **Service**: Gmail_API (Connected)
- **Service ID**: `service_q6mey2b`
- **Public Key**: `FWwwe2jCb33Md84nB`
- **Current Template**: `__ejs-test-mail-service__` (Test template)

## 🎯 Create Your Custom Template

### Step 1: Go to EmailJS Dashboard
Visit: https://dashboard.emailjs.com/admin/templates

### Step 2: Create New Template
Click **"Create New Template"** button

### Step 3: Configure Template

#### Template Name
```
Portfolio Contact Form
```

#### Subject Line
```
New Contact: {{subject}} - from {{user_name}}
```

#### Email Body (HTML)
```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #E06031; color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #E06031; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>New Contact Form Submission</h2>
        </div>
        <div class="content">
            <div class="field">
                <span class="label">From:</span> {{user_name}}
            </div>
            <div class="field">
                <span class="label">Email:</span> {{user_email}}
            </div>
            <div class="field">
                <span class="label">Subject:</span> {{subject}}
            </div>
            <div class="field">
                <span class="label">Message:</span>
                <p>{{message}}</p>
            </div>
        </div>
        <div class="footer">
            <p>This email was sent from your portfolio website at pradipbhatt.com.np</p>
        </div>
    </div>
</body>
</html>
```

#### To Email
```
bhattsammar04@gmail.com
```

#### From Name
```
Portfolio Contact Form
```

### Step 4: Save and Get Template ID

1. Click **"Save"**
2. Copy the **Template ID** (looks like `template_xxxxxxx`)
3. Update `/home/pradip/Desktop/portfolio/src/components/Contact.tsx` line 25:

```typescript
'__ejs-test-mail-service__',  // Replace this
'template_xxxxxxx',            // With your new template ID
```

## 🧪 Test Your Form

1. Run `npm run dev`
2. Navigate to Contact section
3. Fill out the form
4. Submit and check `bhattsammar04@gmail.com`

## 📊 Template Variables

Make sure your template uses these exact variable names:
- `{{user_name}}` - Sender's name
- `{{user_email}}` - Sender's email address
- `{{subject}}` - Message subject
- `{{message}}` - Message content

## 🎨 Customize Further

You can customize:
- Email colors (currently using your portfolio's orange `#E06031`)
- Layout and styling
- Add your logo
- Include auto-reply functionality

## ✅ Your Form Features

- ✓ Real-time validation
- ✓ Loading states
- ✓ Success/error messages
- ✓ Form reset after submission
- ✓ Disabled state during sending
- ✓ Professional email formatting
