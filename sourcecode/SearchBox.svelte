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

<div>
    <input
        type="text"
        id="searchBox"
        placeholder="Search images..."
        onkeyup="filterImages()"
    />
</div>

<style>
    #searchBox {
        width: 95%;
        padding: 10px;
        margin-bottom: 10px;
        font-size: 16px;
    }
</style>
