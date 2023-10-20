const chatForm = document.querySelector("#chat-input");
const submitForm = document.querySelector("form");

fetch("/cbbs")
    .then((response) => {
        return response.json();
    })
    .then((posts) => {
        posts.forEach((post) => {
            const p = document.createElement("p");
            const serverTimestamp = new Date(post.created_at);
            const visitorTimestamp = new Date(serverTimestamp);
            const formattedTimestamp = visitorTimestamp.toLocaleString("en-US");

            p.textContent = `${formattedTimestamp} | ${post.username} >> ${post.message}`;
            document.body.appendChild(p);
        });
    })
    .catch((err) => {
        console.error(err);
    });

submitForm.addEventListener("submit", (e) => {
    e.preventDefault();
    postSubmission();
});

chatForm.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        postSubmission();
    }
});

async function postSubmission() {
    const message = chatForm.value.trim();
    try {
        await fetch("/cbbs", {
            method: "POST",
            body: JSON.stringify({ message }),
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (err) {
        console.error(err);
    }
}
