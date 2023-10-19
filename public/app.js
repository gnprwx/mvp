fetch("/cbbs")
    .then((response) => {
        return response.json();
    })
    .then((posts) => {
        posts.forEach((post) => {
            const p = document.createElement("p");
            const timezoneOffset = new Date().getTimezoneOffset();
            const serverTimestamp = new Date(post.created_at);
            const visitorTimezoneOffsetMs = timezoneOffset * 60 * 1000;
            const visitorTimestamp = new Date(
                serverTimestamp.getTime() - visitorTimezoneOffsetMs
            );
            const formattedTimestamp = visitorTimestamp.toLocaleString("en-US");

            p.textContent = `${formattedTimestamp} ${post.username} >> ${post.message}`;
            document.body.appendChild(p);
        });
    })
    .catch((err) => {
        console.error(err);
    });
