const chat = document.querySelector("#chat");
const chatForm = document.querySelector("#chat-input");
const submitForm = document.querySelector("form");

async function getPosts() {
    try {
        const response = await fetch("/cbbs");
        const posts = await response.json();
        chat.innerHTML = "";
        posts.forEach((post) => {
            const p = document.createElement("p");
            const serverTimestamp = new Date(post.created_at);
            const formattedTimestamp = serverTimestamp.toLocaleString("en-US");
            p.textContent = `${formattedTimestamp} | ${post.username} >> ${post.message}`;
            chat.appendChild(p);
        });
    } catch (err) {
        console.error(err);
    }
}
getPosts();

/* submitForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (chatForm.value.trim() !== "") {
        postSubmission();
    }
}); */

chatForm.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && chatForm.value.trim() !== "") {
        e.preventDefault();
        postSubmission();
    }
});

const response = await fetch("https://randomuser.me/api/");
const data = await response.json();
const user = data.results[0].login.username;

chatForm.placeholder = `say something, ${user}...`;

async function postSubmission() {
    const message = chatForm.value.trim();
    try {
        await fetch("/cbbs", {
            method: "POST",
            body: JSON.stringify({
                user,
                message,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (err) {
        console.error(err);
    }
    chatForm.value = "";
    getPosts();
}
