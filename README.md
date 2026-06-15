# NOVA Clothing Website

Static NOVA Clothing storefront built from the original theme assets. This project is ready to upload to GitHub and deploy on Netlify or Vercel.

## Deploy On Netlify

### Easiest: Drag And Drop

1. Go to [Netlify Drop](https://app.netlify.com/drop).
2. Drag the `netlify-drop-ready` folder into Netlify if you are using the prepared upload folder, or drag this whole project folder.
3. Netlify will publish the site and give you a live link.

### Best: GitHub To Netlify

1. Create a new GitHub repository.
2. Upload everything in this folder to the repository.
3. In Netlify, choose **Add new site**.
4. Choose **Import an existing project**.
5. Connect GitHub and select your NOVA repository.
6. Netlify should read `netlify.toml` automatically.
7. Confirm:
   - Build command: `npm run build`
   - Publish directory: `dist`
8. Click **Deploy site**.

## Deploy On Vercel

1. Create a new GitHub repository.
2. Upload everything in this folder to the repository.
3. In Vercel, choose **Add New Project**.
4. Import the GitHub repository.
5. Leave the framework preset as **Other** or **Static**.
6. Leave build settings blank. Vercel will serve `index.html`.
7. Click **Deploy**.

## Local Preview

Open `index.html` in a browser, or run:

```sh
npm run dev
```

Then open the local URL shown in the terminal.

## Project Files

- `index.html` is the live homepage.
- `square-theme.css` is the NOVA styling.
- `square-theme.js` powers the mobile menu.
- `assets/` contains the logo, mark, and mountain hero image.
- `netlify.toml` tells Netlify how to build and publish the site.
- `vercel.json` tells Vercel this is a static site.

## Optional Square Files

These files are still included in case you also want to reuse parts of the design inside Square Online:

- `square-homepage-custom-section.html`
- `square-global-header-code.html`
- `square-global-footer-code.html`

## Brand Colors

- Black: `#050505`
- Text: `#111111`
- Line gray: `#dddddd`
- Light gray: `#f3f3f3`
- White: `#ffffff`

## Notes

The `Keep Climbing Mountain Graphic Tee` product has been added to the homepage and has its own product page at `keep-climbing-mountain-tee.html`.

Collection pages have also been added:

- `nova-trekking-collection.html`
- `defind.html`

Storefront behavior has been added to make the static site work more like the Square store:

- Cart drawer
- Cart item count
- Quick add from product grids
- Product size picker
- Quantity and remove controls
- Checkout handoff to `https://shop-nova-clothing.square.site/`

The current product image is a temporary SVG mockup at `assets/keep-climbing-mountain-tee.svg`. Before launch, replace it or add your exported Printify mockups, then update the image paths in `index.html` and `keep-climbing-mountain-tee.html`.

---

## Square Online Notes

This converts the supplied Shopify NOVA theme into a Square Online recreation kit. Square Online does not accept Shopify Liquid theme uploads, so this package gives you the theme as Square-friendly snippets and editable assets.

## Files

- `index.html` is a local preview of the Square version.
- `square-theme.css` is the global NOVA styling.
- `square-theme.js` is the small mobile menu script.
- `square-homepage-custom-section.html` is the homepage block for Square's Embed Code section.
- `square-global-header-code.html` and `square-global-footer-code.html` show where the CSS and JS go in Square.
- `assets/` contains the original NOVA logo, mark, and mountain hero image.

## Square Setup

1. In Square Online, add the NOVA colors in your site styles where possible:
   - Black: `#050505`
   - Text: `#111111`
   - Line gray: `#dddddd`
   - Light gray: `#f3f3f3`
   - White: `#ffffff`
2. Upload or host the three image assets from `assets/`.
3. Open `square-homepage-custom-section.html` and replace:
   - `REPLACE_WITH_NOVA_MOUNTAIN_HERO_URL`
   - `REPLACE_WITH_NOVA_MARK_URL`
   - `REPLACE_WITH_NOVA_LOGO_FULL_URL`
4. Paste the contents of `square-theme.css` inside the `<style>` tag in `square-global-header-code.html`, then add that to Square's global header code area.
5. Add `square-global-footer-code.html` to Square's global footer code area.
6. Add a Square Embed Code section to the homepage and paste the edited `square-homepage-custom-section.html`.
7. For real products, use Square's native featured item/category sections directly under the custom NOVA heading, or edit the placeholder product card links and prices.

## Notes

Square's checkout and some native product/card markup cannot be fully replaced by custom theme files. This kit recreates the storefront look: sticky minimal header, grayscale mountain hero, bold uppercase typography, monochrome buttons, product-grid rhythm, dark campaign banner, and footer.
