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

            p.textContent = `${formattedTimestamp} ${post.username} >> ${post.message}`;
            document.body.appendChild(p);
        });
    })
    .catch((err) => {
        console.error(err);
    });
