import Phaser from 'phaser';

export default class ProgressManager extends Phaser.Scene {
    public level_to_play = 'lvl2';
    public progress = {
        current: 1,
        zones: {
            zone1: {
                current: 'lvl1',
                lvl1: true,
                lvl2: false,
                lvl3: false,
                lvl4: false,
                lvl5: false
            },
            zone2: {
                current: 'lvl1',
                lvl1: false,
                lvl2: false,
                lvl3: false,
                lvl4: false,
                lvl5: false
            },
            zone3: {
                current: 'lvl1',
                lvl1: false,
                lvl2: false,
                lvl3: false,
                lvl4: false,
                lvl5: false
            }
        }
    };

    constructor() {
        super({key:'ProgressManager', active: true});
    }

    create() {
        const style = 'font-family: Helvetica, sans-serif;background-color: black;padding: 10px;color: greenyellow;text-shadow: 0px 0px 10px greenyellow;border-radius: 20px;box-shadow: 0px 0px 10px greenyellow;font-weight: bolder;text-align: center;letter-spacing: 5px;';
        console.log('%c ProgressManager iniciado correctamente! ', style);
        if (localStorage.getItem('progress') !== null) {
            this.progress = JSON.parse(localStorage.getItem('progress'));
        }else {
            localStorage.setItem('progress', JSON.stringify(this.progress));
        }
    }

    update() {
        
    }

    getLevelToPlay() {
        return this.level_to_play;
    }

    getLevelToPlayInt() {
        return parseInt(this.level_to_play.replace('lvl', '').replace('zone', ' ').split(' ')[0]);
    }

    getLevelToPlayZoneInt() {
        return parseInt(this.level_to_play.replace('lvl', '').replace('zone', ' ').split(' ')[1]);
    }

    getProgressOfLevel(zone: string, level: number) {
        let ret = this.progress.zones[zone][`lvl${level}`];
        localStorage.setItem('progress', JSON.stringify(this.progress));
        return ret;
    }

    setProgressOfLevel(zone: string, level: number, value: boolean) {
        let ret = this.progress.zones[zone][`lvl${level}`] = value;
        localStorage.setItem('progress', JSON.stringify(this.progress));
        return ret;
    }

    getCurrentOfZone(zone: string) {
        let ret = this.progress.zones[zone].current;
        localStorage.setItem('progress', JSON.stringify(this.progress));
        return ret;
    }

    getCurrentZone() {
        return `zone${this.progress.current}`;
    }

    getNextLevel() {
        if (this.level_to_play.replace('lvl', '').split('zone')[0] === '5') {
            //nada xd
        }else {
            return `lvl${parseInt(this.level_to_play.replace('lvl', '').split('zone')[0]) + 1}zone${this.level_to_play.replace('lvl', '').split('zone')[1]}`;
        }
    }

    winLevel(zone: string, level: number) {
        if (this.progress.zones[zone].current === `lvl5`) {
            
        }else {
            if (this.progress.zones[zone].current === `lvl${level}`) {
                this.progress.zones[zone].current = `lvl${level + 1}`;
                this.progress.zones[zone][`lvl${level + 1}`] = true;
                localStorage.setItem('progress', JSON.stringify(this.progress));
            }
        }
    }

    playLevelString(level: string) {
        this.level_to_play = level;	
    }

    playLevel(level: number) {
        this.level_to_play = `lvl${level}`;	
    }

    playLevelOfZone(level: number, zone: number) {
        this.progress.current = zone;
        this.level_to_play = `lvl${level}zone${zone}`;	
    }
}