export function formatToWIB(utcString: string): string {
    const date = new Date(utcString)

    // Geser ke +7 jam (WIB)
    const wibDate = new Date(date.getTime())

    const day = String(wibDate.getDate()).padStart(2, "0")
    const month = String(wibDate.getMonth() + 1).padStart(2, "0")
    const year = wibDate.getFullYear()

    const hours = String(wibDate.getHours()).padStart(2, "0")
    const minutes = String(wibDate.getMinutes()).padStart(2, "0")

    return `${day}/${month}/${year} ${hours}:${minutes} WIB`
}
