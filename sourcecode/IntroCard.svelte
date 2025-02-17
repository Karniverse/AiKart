<script>
    export let title = "AiKart";
    export let description =
        "I'm KarMukil, this page exclusively showcases my AI art.<br>All wallpapers are free to download";
    // export let imageUrl = "https://via.placeholder.com/300";
</script>

<div class="card">
    <!-- <img class="image" src={imageUrl} alt={title} /> -->
    <div class="content">
        <div class="title">{title}</div>
        <div class="description">{@html description}</div>
    </div>
</div>

<style>
    .card {
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease-in-out;
        background: linear-gradient(135deg, #db7fff, #f5d2ed);
    }
    .card:hover {
        transform: scale(1.05);
    }
    .image {
        width: 100%;
        height: 200px;
        object-fit: cover;
    }
    .content {
        padding: 16px;
        background: rgba(255, 255, 255, 0.8);
        text-align: center;
        border-radius: 0 0 12px 12px;
    }
    .title {
        font-size: 1.2rem;
        font-weight: bold;
    }
    .description {
        font-size: 0.9rem;
        color: gray;
    }
</style>
