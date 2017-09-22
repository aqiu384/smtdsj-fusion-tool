import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { FUSION_SETTINGS_KEY, FUSION_SETTINGS_VERSION } from '../models/constants';
import { Compendium } from '../models/compendium';
import { FusionChart } from '../models/fusion-chart';

@Injectable()
export class FusionDataService {
    private _compendium = new Compendium();
    private _compendium$ = new BehaviorSubject(this._compendium);
    compendium = this._compendium$.asObservable();

    private _fusionChart = new FusionChart();
    private _fusionChart$ = new BehaviorSubject(this._fusionChart);
    fusionChart = this._fusionChart$.asObservable();

    constructor() {
        const settings = JSON.parse(localStorage.getItem(FUSION_SETTINGS_KEY));

        if (settings && settings.version && settings.version >= FUSION_SETTINGS_VERSION) {
            this.nextIncludedSubapps(settings.subapps);
        }

        window.addEventListener('storage', this.onStorageUpdated.bind(this));
    }

    nextIncludedSubapps(subapps: { [name: string]: boolean }) {
        localStorage.setItem(FUSION_SETTINGS_KEY, JSON.stringify({ version: FUSION_SETTINGS_VERSION, subapps }));
        this._fusionChart.includedSubapps = subapps;
        this._fusionChart$.next(this._fusionChart);
    }

    onStorageUpdated(e) {
        switch (e.key) {
            case FUSION_SETTINGS_KEY:
                this._fusionChart.includedSubapps = JSON.parse(e.newValue).subapps;
                this._fusionChart$.next(this._fusionChart);
                break;
            default:
                break;
        }
    }
}
