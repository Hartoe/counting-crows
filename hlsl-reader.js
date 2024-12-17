// Reads in the text from a .hlsl file
async function importHLSL(path)
{
    return fetch(path)
        .then((res)  => res.text())
        .then((text) => {
            return text;
        })
        .catch((e) => console.error(e));
}

export { importHLSL };