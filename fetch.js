fetch(url, {
        method: 'POST',
        headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: "name=" + groupName
    })
    .then(function(response) {
        console.log("response", response);
        response.json().then(function(data) {
            var res = _regPostOnCallback(null, response, data);
            callback(res);
        });
    })
    .then(function(data) {
        console.log(data)
    })
    .catch(function(err) {
        console.log(err)
        callback(res);
    });
