<script>
    import { fade } from "svelte/transition";
    export let imageEntries = []; // Array of objects: { thumb, full, date }

    let selectedImage = null;
    let startX = 0; // For swipe gestures

    // Open lightbox with the full-size image.
    function openLightbox(fullImage) {
        selectedImage = fullImage;
    }

    // Close lightbox only if clicking on the background.
    function closeLightbox(event) {
        if (event.target.classList.contains("lightbox")) {
            selectedImage = null;
        }
    }

    // Go to next image. If called from a keyboard event, event may be undefined.
    function nextImage(event) {
        if (event) event.stopPropagation();
        let index = imageEntries.findIndex((img) => img.full === selectedImage);
        if (index < imageEntries.length - 1) {
            selectedImage = imageEntries[index + 1].full;
        }
    }

    // Go to previous image.
    function prevImage(event) {
        if (event) event.stopPropagation();
        let index = imageEntries.findIndex((img) => img.full === selectedImage);
        if (index > 0) {
            selectedImage = imageEntries[index - 1].full;
        }
    }

    // Select a specific image (from thumbnail navigation).
    function selectImage(event, fullImage) {
        event.stopPropagation();
        selectedImage = fullImage;
    }

    // For swipe gestures.
    function handleTouchStart(event) {
        startX = event.touches[0].clientX;
    }

    function handleTouchEnd(event) {
        let endX = event.changedTouches[0].clientX;
        if (startX - endX > 50) {
            nextImage(event);
        } else if (endX - startX > 50) {
            prevImage(event);
        }
    }

    // Handle arrow keys and Esc key.
    function handleKeyDown(event) {
        if (!selectedImage) return; // Only act if lightbox is open.
        if (event.key === "ArrowRight") {
            nextImage();
        } else if (event.key === "ArrowLeft") {
            prevImage();
        } else if (event.key === "Escape") {
            selectedImage = null;
        }
    }

    // Fetch images from the server.
    async function fetchImages() {
        try {
            const response = await fetch(
                "https://karmukil.tunnelagent.com/AiKart/",
            );
            const html = await response.text();

            const imageEntriesData = [];
            const regex =
                /<a href="([^"]+\.(jpg|png|gif|jpeg|webp))">.*?<\/a>\s+(\d{2}-\w{3}-\d{4} \d{2}:\d{2})/gi;
            let match;
            while ((match = regex.exec(html)) !== null) {
                const fileName = match[1];
                const fileDate = match[3];
                const dateObj = new Date(fileDate.replace(/-/g, " "));
                imageEntriesData.push({
                    thumb: `https://karmukil.tunnelagent.com/AiKart/th/${fileName}`,
                    full: `https://karmukil.tunnelagent.com/AiKart/${fileName}`,
                    date: dateObj,
                });
            }

            // Sort images by date (newest first).
            imageEntriesData.sort((a, b) => b.date - a.date);
            imageEntries = [...imageEntriesData]; // Update the reactive variable.
        } catch (error) {
            // console.error("Error fetching images:", error);
            // let errormessage;
            // if errormessage = "TypeError: NetworkError when attempting to fetch resource."{
            imageEntries = [];
            imageEntries.push({
                thumb: "error.jpg",
                full: "error.jpg",
                //date: dateObj,
            });
            //}
        }
    }

    fetchImages();
</script>

<!-- Listen for keydown events on the window -->
<svelte:window on:keydown={handleKeyDown} />

<!-- Image Grid with Thumbnails -->
<div class="gallery">
    {#each imageEntries as image}
        <img
            src={image.thumb}
            alt="Gallery Image"
            loading="lazy"
            on:click={() => openLightbox(image.full)}
        />
    {/each}
</div>

<!-- Lightbox for Full Images -->
{#if selectedImage}
    <div
        class="lightbox"
        on:click={closeLightbox}
        transition:fade
        on:touchstart={handleTouchStart}
        on:touchend={handleTouchEnd}
    >
        <button class="prev" on:click={prevImage}>&#10094;</button>
        <img src={selectedImage} alt="Full Image" />
        <button class="next" on:click={nextImage}>&#10095;</button>

        <!-- Thumbnail Navigation -->
        <div class="thumbnails">
            {#each imageEntries as thumb}
                <img
                    src={thumb.thumb}
                    on:click={(event) => selectImage(event, thumb.full)}
                />
            {/each}
        </div>
    </div>
{/if}

<style>
    .gallery {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 6px;
    }
    .gallery img {
        flex-grow: 1;
        max-width: calc(20% - 10px);
        height: auto;
        object-fit: cover;
        border-radius: 8px;
        transition: transform 0.2s ease-in-out;
    }
    .gallery img:hover {
        transform: scale(1.15);
    }
    .lightbox {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        z-index: 1000;
    }
    .lightbox img {
        max-width: 90%;
        max-height: 80vh;
        border-radius: 10px;
        box-shadow: 0px 0px 20px rgba(255, 255, 255, 0.5);
    }
    .thumbnails {
        display: flex;
        justify-content: center;
        margin-top: 10px;
        overflow-x: auto;
        white-space: nowrap;
        max-width: 90%;
        padding-bottom: 10px;
    }
    .thumbnails::-webkit-scrollbar {
        height: 8px;
    }
    .thumbnails::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.5);
        border-radius: 4px;
    }
    .thumbnails img {
        width: 40px;
        height: 60px;
        margin: 5px;
        cursor: pointer;
        border: 1px solid transparent;
        transition: transform 0.2s;
        object-fit: cover;
    }
    .thumbnails img:hover {
        transform: scale(1.1);
        border-color: white;
    }
    .lightbox button {
        position: absolute;
        top: 50%;
        background: rgba(255, 255, 255, 0.3);
        border: none;
        font-size: 30px;
        padding: 10px;
        cursor: pointer;
    }
    .prev {
        left: 20px;
    }
    .next {
        right: 20px;
    }

    /* Responsive adjustments */
    @media (max-width: 1024px) {
        .gallery img {
            max-width: calc(33.333% - 10px);
        }
    }
    @media (max-width: 768px) {
        .gallery img {
            max-width: calc(50% - 10px);
        }
    }
</style>
