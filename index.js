const placeFileContent = (target, file) => {
    readFileContent(file).then(async function(content) {
        const response = await invokeTextGear(content);
        console.log("Response: ", response);
        target.value = response;
    }).catch(error => console.log(error));
};

async function invokeTextGear(content) {
    const req = {
        text: content,
        language: 'en-GB',
        key: 'i3UBjOY5jnomVOmB'
    }
    const response = await fetch("https://api.textgears.com/spelling", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(req)
    });
    const result = await response.json();
    console.log("Result: ", result);
    let finalResponse = "";
    let current = 0;
    if(result.status) {
        result.response.errors.forEach(element => {
            console.log("Element: ", element);
            finalResponse += content.substr(current, element.offset);
            finalResponse += "<i>";
            current = element.offset + element.length;
            finalResponse += content.substr(element.offset, element.offset + element.length-1);
            finalResponse += "</i>";
        });
        finalResponse += content.substr(current, content.length-1);
        return finalResponse;
    } else {
        return "Something went wrong";
    }
};


const readFileContent = (file) => {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
        reader.onload = event => resolve(event.target.result);
        reader.onerror = error => reject(error);
        reader.readAsText(file);
    });
};

const getFile = (event) => {
    const input = event.target;
    if('files' in input && input.files.length > 0) {
        placeFileContent(document.getElementById("target-textarea"), input.files[0]);
    }  
};


document.getElementById("input-file").addEventListener('change', getFile);

