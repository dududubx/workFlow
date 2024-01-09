

export const getImgUrl = (imgPath: string) => {
    return new URL(`../assets/image/${imgPath}`, import.meta.url).href
}