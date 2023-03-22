class Logger {
    static _log(...args) {
        console.log(`[${this.getDate()}]`,...args);
    }

    static getDate() {
        let date = new Date();

        let hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        let seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

        return `${hours}:${minutes}:${seconds}`;
    }

    constructor(name) {
        this.name = name;
    }

    log(...args) {
        Logger._log(this.name+":", ...args);
    }
}

export default Logger;