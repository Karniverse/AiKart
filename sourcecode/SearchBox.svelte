<script>
    document.addEventListener("DOMContentLoaded", function () {
        function filterImages() {
            let input = document
                .getElementById("searchBox")
                .value.toLowerCase();
            let images = document.querySelectorAll(".gallery img");

            images.forEach((img) => {
                let filename = img.src.toLowerCase();
                img.style.display = filename.includes(input) ? "block" : "none";
            });
        }

        document
            .getElementById("searchBox")
            .addEventListener("keyup", filterImages);
    });
</script>

<div class="search">
    <input
        type="text"
        id="searchBox"
        placeholder="Search images..."
        onkeyup="filterImages()"
    />
</div>

<style>
    #searchBox {
        width: 30%;
        padding: 8px;
        margin: 6px;
        font-size: 19px;
        border: 1px solid #492d2d;
        border-radius: 5px;
    }
    .search {
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
