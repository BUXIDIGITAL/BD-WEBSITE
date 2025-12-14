# 📧 Contact Form Setup Instructions

## ✅ What's Been Completed

Your contact page is now live at `contact.html` with:
- ✅ Professional contact form with all fields
- ✅ Phone number (306-874-7017) prominently displayed
- ✅ Business hours and location info
- ✅ Character counter for message field
- ✅ Success/error message handling
- ✅ All "Get Started" and "Contact" buttons throughout the site now link to `contact.html`
- ✅ Fully responsive mobile design
- ✅ Custom cursor and noise overlay integrated

---

## 🚀 FORM ACTIVATION STEPS (REQUIRED)

Your form is set up but needs to be connected to a backend service to actually send emails. Here are your options:

### **Option 1: Formspree (Recommended - FREE & Easy)**

1. **Go to**: https://formspree.io/
2. **Sign up** for a free account
3. **Create a new form**
4. **Copy your Form ID** (looks like `xxxxx123`)
5. **Update contact.html** line 168:

```html
<!-- FIND THIS LINE: -->
<form id="contact-form" class="contact-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">

<!-- CHANGE TO: -->
<form id="contact-form" class="contact-form" action="https://formspree.io/f/YOUR_ACTUAL_ID" method="POST">
```

6. **Test it!** Submit a form and it will go to your email

**Benefits:**
- ✅ 50 submissions/month FREE
- ✅ No coding required
- ✅ Spam protection included
- ✅ Email goes to richard@buxidigital.com

---

### **Option 2: Netlify Forms (If hosting on Netlify)**

1. **Add `netlify` attribute** to the form tag in contact.html line 168:

```html
<form id="contact-form" class="contact-form" netlify netlify-honeypot="bot-field" method="POST">
```

2. **Add hidden field** right after the opening `<form>` tag:

```html
<input type="hidden" name="form-name" value="contact-form" />
```

3. **Deploy to Netlify** - forms will automatically work!

**Benefits:**
- ✅ 100 submissions/month FREE
- ✅ Built into Netlify
- ✅ Dashboard to view submissions

---

### **Option 3: EmailJS (Frontend Only)**

1. **Go to**: https://www.emailjs.com/
2. **Sign up** and get your credentials
3. **Add EmailJS script** to contact.html before `</body>`:

```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
<script>
  emailjs.init("YOUR_PUBLIC_KEY");
</script>
```

4. **Update the form submission** in script.js (replace the fetch call)

**Benefits:**
- ✅ 200 emails/month FREE
- ✅ Direct from browser
- ✅ Custom email templates

---

### **Option 4: Custom Backend (Advanced)**

If you want full control:
- Set up a Node.js/PHP backend
- Use services like SendGrid, AWS SES, or Mailgun
- Point the form action to your API endpoint

---

## 📝 Form Fields Included

The contact form collects:
- ✅ Full Name (required)
- ✅ Email Address (required)
- ✅ Phone Number (optional)
- ✅ Company Name (optional)
- ✅ Service Interest (required dropdown)
- ✅ Budget Range (optional)
- ✅ Project Description (required, max 1000 chars)
- ✅ Newsletter Subscription (optional checkbox)

---

## 🎨 Form Features

1. **Character Counter**: Shows 0/1000 for the message field
2. **Real-time Validation**: Required fields validated on submit
3. **Loading State**: Button shows "Sending..." during submission
4. **Success Message**: Green confirmation when form submits successfully
5. **Error Message**: Red error with fallback email link if something fails
6. **Responsive**: Looks great on mobile, tablet, and desktop

---

## 🔗 Updated Links Throughout Site

All buttons and links now point to the contact page:

| Page | Link Text | Points To |
|------|-----------|-----------|
| Homepage | "Get Started" button | contact.html |
| Homepage | "Schedule a Call" | contact.html |
| About | "Work With Us" | contact.html |
| Services | "Get Started" button | contact.html |
| Blog | "Get Started" button | contact.html |
| All Navbars | "Contact" link | contact.html |

---

## 📱 Testing Checklist

Before going live, test:
- [ ] Fill out and submit form
- [ ] Check if email arrives at richard@buxidigital.com
- [ ] Test on mobile device
- [ ] Test required field validation
- [ ] Test character counter
- [ ] Test phone number link (should open phone dialer on mobile)
- [ ] Test email link (should open email client)
- [ ] Check all navigation links work

---

## 🆘 Need Help?

If you have issues:
1. Check browser console for errors (F12)
2. Verify your Formspree/service ID is correct
3. Make sure the form action URL is properly formatted
4. Test with a simple test submission

---

## 🎯 Next Steps (Optional Enhancements)

1. **Add Google reCAPTCHA** for spam protection
2. **Set up email autoresponder** to thank submitters
3. **Add Google Analytics** to track form submissions
4. **Create a custom thank you page** after submission
5. **Add file upload** for project files/briefs

Your contact page is ready to go live once you connect it to a form service! 🚀
