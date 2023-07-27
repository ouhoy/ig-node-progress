import * as dotenv from 'dotenv';

dotenv.config()

function calculateProgress(startDate, endDate) {
    const currentTime: Date = new Date();
    const totalDuration = endDate - startDate;
    const elapsedDuration = +currentTime - startDate;
    const progressPercentage = (elapsedDuration / totalDuration) * 100;

    return Math.min(Math.max(progressPercentage, 0), 100);
}

function updateProgress() {
    const startDate = new Date(process.env.START_DATE);
    const endDate = new Date(process.env.END_DATE);
    const progressPercentage: number = calculateProgress(startDate, endDate);
    const numberOfBars = Math.floor((progressPercentage * 10) / 100)


    let progressBar: string[] = []

    for (let i = 1; i <= 10; i++) {
        if (i <= numberOfBars) {

            progressBar.push("⬛")
            continue
        }
        progressBar.push("⬜")

    }


    return {progressBar, progressPercentage}
}


export default updateProgress;
