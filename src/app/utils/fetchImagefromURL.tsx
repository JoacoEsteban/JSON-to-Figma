export default async function fetchImagefromURL(url, targetID) {
    const proxyServer = 'https://cors-anywhere.herokuapp.com';
    await fetch(`${proxyServer}/${url}`)
        .then(r => {
            try {
                return r.arrayBuffer();
            } catch (error) {
                console.error(error);
            }
        })
        .then(a =>
            parent.postMessage({pluginMessage: {type: 'imgData', data: new Uint8Array(a), targetID: targetID}}, '*')
        );
}
