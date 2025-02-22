<script>
    export let title = "AiKart";
    export let description =
        "I'm KarMukil, this page exclusively showcases my AI art.<br>All wallpapers are free to download";
    // export let imageUrl = "https://via.placeholder.com/300";

    let imagecount = 0;

    window.addEventListener("load", () => {
        setTimeout(() => {
            const gallery = document.querySelector(".gallery"); // Select the gallery component
            if (gallery) {
                imagecount = gallery.getElementsByTagName("img").length;
            }
        }, 1000); // Short delay to ensure external images are counted
    });
    export function homepage() {
        window.location = "https://www.karmukil.in";
    }
    //imagecount = [...imagecount];
</script>

<div class="card">
    <!-- <img class="image" src={imageUrl} alt={title} /> -->
    <!-- <div class="content">
        <div class="title">{title}</div>
        <div class="description">{@html description}</div>
    </div> -->
    <div class="homebtn">
        <button on:click={() => homepage()}>
            <img class="homeimage" src="/home.png" alt="buttonpng" border="0" />
        </button>
    </div>
    <!-- <div class="introimage" style="background-image: url('/header.gif');"> -->
    <div class="introimage">
        <img class="headerimg" src="/header.gif" />
    </div>
    <div class="count">Total Images<br />{imagecount}</div>
</div>

<style>
    .count .introimage {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .count {
        width: 100%;
        font-family: "Lucida Sans", Geneva, Verdana, sans-serif;
        font-size: 1.2rem;
        font-weight: bold;
        padding: 10px;
        text-align: center;
    }

    .introimage {
        max-width: 100%;
        height: auto;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        padding: 1px;
        transition: transform 0.2s ease-in-out;
    }
    .introimage:hover {
        transform: scale(1.05);
    }

    .headerimg {
        width: 100%;
        max-width: 100%;
        height: auto;
        object-fit: cover;
    }

    .card {
        display: grid;
        grid-template-columns: 1fr 2fr 1fr; /* Ensuring exactly 3 columns */
        justify-content: center;
        align-items: center;
        gap: 20px;
    }

    .homeimage {
        width: 50px; /* Adjust size */
        height: 50px;
        margin: auto;
        justify-content: center;
        border-radius: 12px;
        background-color: white;
    }
    button {
        height: auto;
        border: none;
        background-color: transparent;
        transition: transform 0.2s ease-in-out;
        box-shadow: 10px;
    }

    button:hover {
        transform: scale(1.25);
    }
    .homebtn {
        width: 4.5vw;
        margin-left: auto;
        margin-right: auto;
    }
    /* Responsive adjustments */

    @media (max-width: 768px) {
        .card {
            display: grid;
            grid-template-columns: 1fr 1fr;
            justify-content: center;
            align-items: center;
            gap: 20px;
        }

        div:nth-child(1) {
            order: 2;
        }

        div:nth-child(2) {
            order: 1;
            grid-column: span 2; /* Make it full width */
            min-height: fit-content;
        }

        div:nth-child(3) {
            order: 3;
        }
        button {
            height: auto;
            border: none;
            background-color: transparent;
            transition: transform 0.2s ease-in-out;
        }

        .count,
        button {
            border: 1px solid rgba(0, 0, 0, 0.459);
            border-radius: 5px;
            box-shadow: 2px 2px 1px rgba(0, 0, 0, 0.3);
        }

        .count {
            width: 60%;
            font-family: "Lucida Sans", Geneva, Verdana, sans-serif;
            font-size: 1.2rem;
            font-weight: bold;
            padding: 10px;
            text-align: center;
        }
        .button:hover,
        .introimage:hover {
            transform: scale(1.05);
        }
    }

    /* .card {
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease-in-out;
        background: linear-gradient(135deg, #db7fff, #f5d2ed);
        background-image: linear-gradient(
            125deg,
            #ce9ffc,
            #7367f0,
            #ff6aa8,
            #d67676,
            #ffd26f,
            #3677ff,
            #fec163,
            #de4313,
            #eece13,
            #b210ff
        );
        background-size: 400% 400%;
        animation: bganimation 150s infinite;
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
        font-size: 2rem;
        font-weight: bold;
    }
    .description {
        font-size: 1.2rem;
        color: gray;
    }

    @keyframes bganimation {
        0% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 1000% 50%;
        }
        100% {
            background-position: 0% 50%;
        }
    } */
</style>
