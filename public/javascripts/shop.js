
// Update the searchinputfocus function to handle responsiveness
function searchinputfocus(data) {
    const searchDiv = document.getElementById("searchDiv");
    const searchResults = document.getElementById("searchResults");
    const searchInput = document.getElementById("searchinput");

    if (data) {
        searchDiv.style.width = "100%"; // Use full width
        searchInput.style.width = "100%"; // Use full width for the input
        searchResults.style.width = "100%"; // Use full width for the results
        searchResults.style.maxWidth = "100%"; // Ensure responsiveness

        if (window.innerWidth >= 768) {
            // Adjust as needed for larger screens
            searchDiv.style.maxWidth = "680px"; // Limit the maximum width
        } else {
            searchDiv.style.maxWidth = "none"; // Remove max-width on smaller screens
        }

        searchResults.style.height = "auto"; // Set a default height

    }
}


// sorting by price  
function sortbyprice(data) {
    window.location.href = `/shop/?sort=${data}`;
}


// search implementation  

let debounceTimeout; // Variable to hold the timeout ID

function Search(e) {
    // Clear any previously scheduled debounce
    clearTimeout(debounceTimeout);

    // Schedule a new debounce with a delay of 300 milliseconds
    debounceTimeout = setTimeout(() => {
        let match = e.value.match(/^[a-zA-z ]*/);
        let match2 = e.value.match(/\s*/);

        if (match2[0] === e.value) {
            searchResults.innerHTML = "";
            return;
        }

        if (match[0] === e.value) {
            const searchResults = document.getElementById("searchResults");
            fetch('/search', {
                method: 'post',
                headers: { 'content-Type': 'application/json' },
                body: JSON.stringify({ payload: e.value })
            })
                .then(res => res.json())
                .then((data) => {
                    let Categorys = data.Categorys;
                    let Products = data.Products;
                    console.log(data)

                    let htmlContent = '';
                    if (Categorys.length >= 1) {
                        Categorys.forEach((item, index) => {
                            if (index > 0) htmlContent += '';
                            htmlContent += `<div class="bg-white p-1 searchResultDiv"><a href="/shop?category=${item._id}"
                            class="d-flex align-items-center bg-white gap-3 text-decoration-none p-2"><img
                                src="${item.path}" class="" height="35" width="35" />${item.title}</a></div>`;

                        });
                    }
                    if (Products.length >= 1) {
                        Products.forEach((item, index) => {
                            if (index > 0) htmlContent += '';
                            htmlContent += `<div class="bg-white p-1  searchResultDiv"><a href="/product/${item._id}"
                            class="d-flex align-items-center gap-3 text-decoration-none p-2"><img
                                src="${item.images[0].path}" class="img-fluid searchResult" width="40" />${item.name}</a></div>`;

                        });
                    }

                    searchResults.innerHTML = htmlContent;

                });

            return;
        }
        searchResults.innerHTML = '';
    }, 300); // Adjust the delay as needed (e.g., 300 milliseconds)
}
