export function convertDuration(duration: number){
    const hours=Math.floor(duration/3600)
    const minutes=Math.floor((duration%36000)/60)
    const seconds=duration%60

    const timeString=[hours,minutes,seconds]
    .map(unitt =>String(unitt).padStart(2,'0'))
    .join(':')

    return timeString;
}