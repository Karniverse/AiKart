# Image Gallery with Lightbox and Slideshow

## Overview
This project is a responsive **image gallery** built with **Svelte** that features:
- A **lightbox** for viewing images in a larger format.
- **Keyboard navigation** (Next/Prev using arrow keys, Close with ESC key).
- A **slideshow mode** that plays images in fullscreen automatically.
<!-- - A **hoverable download button** on thumbnails. -->

## Features
### 1. Image Grid with Thumbnails
- Displays a collection of images.
- Click on any thumbnail to open the lightbox.
<!-- - Each thumbnail has a **download button** that appears on hover. -->

### 2. Lightbox
- Opens images in a larger view.
- **Keyboard Controls**:
  - `←` or `→` to navigate between images.
  - `Esc` to close the lightbox.

### 3. Fullscreen Slideshow
- Clicking the **slideshow button** starts an automatic fullscreen slideshow.
- Images change every **3 seconds**.
- Clicking anywhere or pressing `Esc` closes the slideshow.

## Installation
### 1. Clone the Repository
```sh
git clone https://github.com/yourusername/image-gallery.git
cd image-gallery/sourcecode
```

### 2. Install Dependencies
```sh
npm install
```

### 3. Run the Development Server
```sh
npm run dev
```

### 4. Build Project
```sh
npm run build
```
Project available under `sourcecode/public`

## Usage
- Replace the `hosturl` in `sourcecode/gallery.svelte` with your image hosting url
- Start the dev server and open the browser to view the gallery.

## Future Enhancements
- Add a **pause/play** button in slideshow mode.
- Implement lazy loading for better performance.
- Allow users to select images for a custom slideshow.
- Add a hovering download button to each image

## License
This project is open-source and available under the **MIT License**.

