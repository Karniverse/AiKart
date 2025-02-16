<script>
    import { fade } from "svelte/transition";
    export let imageUrls = []; // Image URLs passed from App.svelte
    let selectedImage = null;
    let startX = 0; // For swipe gestures

    function openLightbox(image) {
        selectedImage = image;
    }

    function closeLightbox(event) {
        // Close only if clicking the background, not the image or buttons
        if (event.target.classList.contains("lightbox")) {
            selectedImage = null;
        }
    }

    function nextImage(event) {
        event.stopPropagation(); // Prevent closing the lightbox
        let index = imageUrls.indexOf(selectedImage);
        if (index < imageUrls.length - 1) {
            selectedImage = imageUrls[index + 1];
        }
    }

    function prevImage(event) {
        event.stopPropagation(); // Prevent closing the lightbox
        let index = imageUrls.indexOf(selectedImage);
        if (index > 0) {
            selectedImage = imageUrls[index - 1];
        }
    }

    function selectImage(event, image) {
        event.stopPropagation(); // Prevent closing the lightbox
        selectedImage = image;
    }

    function handleTouchStart(event) {
        startX = event.touches[0].clientX;
    }

    function handleTouchEnd(event) {
        let endX = event.changedTouches[0].clientX;
        if (startX - endX > 50) {
            nextImage(event); // Swipe Left
        } else if (endX - startX > 50) {
            prevImage(event); // Swipe Right
        }
    }

    // async function fetchImages() {
    //     try {
    //         const response = await fetch(
    //             "https://karmukil.tunnelagent.com/AiKart/",
    //         );
    //         const html = await response.text();

    //         //console.log("Fetched HTML:", html);

    //         imageUrls =
    //             html
    //                 .match(/href="([^"]+\.(jpg|png|gif|jpeg|webp))"/gi)
    //                 ?.map(
    //                     (link) =>
    //                         `https://karmukil.tunnelagent.com/AiKart/${link.replace(/href="|"/g, "")}`,
    //                 ) || [];

    //         console.log("Updated Image URLs:", imageUrls);
    //     } catch (error) {
    //         console.error("Error fetching images:", error);
    //     }
    // }

    async function fetchImages() {
        try {
            const response = await fetch(
                "https://karmukil.tunnelagent.com/AiKart/",
            );
            const html = await response.text();

            const imageEntries = [];
            const regex =
                /<a href="([^"]+\.(jpg|png|gif|jpeg|webp))">.*?<\/a>\s+(\d{2}-\w{3}-\d{4} \d{2}:\d{2})/gi;

            let match;
            while ((match = regex.exec(html)) !== null) {
                const fileName = match[1];
                const fileDate = match[3]; // Extract the date-time

                // Convert date string to Date object
                const dateObj = new Date(fileDate.replace(/-/g, " "));

                imageEntries.push({
                    url: `https://karmukil.tunnelagent.com/AiKart/${fileName}`,
                    date: dateObj,
                });
            }

            // Sort images by date (newest first)
            imageEntries.sort((a, b) => b.date - a.date);

            // Extract sorted URLs and update the reactive variable
            imageUrls = [...imageEntries.map((entry) => entry.url)]; // Ensure reactivity

            //console.log("Sorted Image URLs:", imageUrls);
        } catch (error) {
            console.error("Error fetching images:", error);
        }
    }

    fetchImages();
</script>

<!-- Image Grid -->
<div class="gallery">
    {#each imageUrls as image}
        <img
            src={image}
            alt="Gallery Image"
            loading="lazy"
            on:click={() => openLightbox(image)}
        />
    {/each}
</div>

<!-- Lightbox -->
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
            {#each imageUrls as thumb}
                <img
                    src={thumb}
                    on:click={(event) => selectImage(event, thumb)}
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
        max-width: calc(20% - 10px); /* Adjust based on how many per row */
        height: auto;
        object-fit: cover;
        border-radius: 8px;
        transition: transform 0.2s ease-in-out;
        /* will-change: transform; */
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
        overflow-x: auto; /* Enables horizontal scrolling */
        white-space: nowrap;
        max-width: 90%; /* Adjust as needed */
        padding-bottom: 10px;
    }

    /* Ensure smooth scrolling */
    .thumbnails::-webkit-scrollbar {
        height: 8px; /* Scrollbar height */
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

    /* Tablet View (3 images per row) */
    @media (max-width: 1024px) {
        .gallery img {
            max-width: calc(33.333% - 10px); /* 3 images per row */
        }
    }

    /* Mobile View (2 images per row) */
    @media (max-width: 768px) {
        .gallery img {
            max-width: calc(50% - 10px); /* 2 images per row */
        }
    }
</style>
