export const getDownloadButtons = async (filename: string) => {
    const Plotly = (await import("plotly.js-basic-dist")).default;

    return [
        {
            name: `${filename}_svg`,
            title: "Download (.svg)",
            icon: Plotly.Icons.camera,
            click: (im: any) => {
                Plotly.downloadImage(im, {
                    format: "svg",
                    width: 800,
                    height: 600,
                    filename,
                });
            },
        },
        {
            name: `${filename}_png`,
            title: "Download (.png)",
            icon: Plotly.Icons.camera,
            click: (im: any) => {
                Plotly.downloadImage(im, {
                    format: "png",
                    width: 800,
                    height: 600,
                    filename,
                });
            },
        }
    ];
};
