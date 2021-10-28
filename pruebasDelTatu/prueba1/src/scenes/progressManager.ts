import Phaser from 'phaser';

export default class ProgressManager extends Phaser.Scene {
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
                current: 'none',
                lvl1: false,
                lvl2: false,
                lvl3: false,
                lvl4: false,
                lvl5: false
            },
            zone3: {
                current: 'none',
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
        console.log('%c ProgressManager iniciado correctamente! ', 'background: #fffdd0; color: #bada55');
        if (localStorage.getItem('progress') !== null) {
            this.progress = JSON.parse(localStorage.getItem('progress'));
        }else {
            localStorage.setItem('progress', JSON.stringify(this.progress));
        }
    }

    update() {

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

    winLevel(zone: string, level: number) {
        if (this.progress.zones[zone].current === `lvl5`) {
            if (this.progress.current < 4) {
                this.progress.current++;
            }
        }else {
            if (this.progress.zones[zone].current === `lvl${level}`) {
                this.progress.zones[zone].current = `lvl${level + 1}`;
                localStorage.setItem('progress', JSON.stringify(this.progress));
            }
        }
    }
}