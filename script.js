fetch("https://bqardi-osteapi.herokuapp.com/api/v1/cheeses")
    .then(response => response.json())
    .then(data => {
        console.log(data);
    });