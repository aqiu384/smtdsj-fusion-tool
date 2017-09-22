import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';

import { APP_TITLE } from './models/constants';
import { FusionChart } from './models/fusion-chart';

import { FusionDataService } from './services/fusion-data.service';

@Component({
    selector: 'app-fusion-settings',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <table>
            <thead>
                <tr><th>Included Subapps</th></tr>
            </thead>
            <tbody>
                <tr *ngFor="let subapp of subapps">
                    <td>
                        <label>{{ subapp.name }}
                            <input type="checkbox"
                                [checked]="subapp.included"
                                (change)="toggleIncludedSubapp(subapp.name)">
                        </label>
                    </td>
                </tr>
            </tbody>
        </table>
    `
})
export class FusionSettingsComponent implements OnInit, OnDestroy {
    private _subapps: { [name: string]: boolean };

    fusionChart: FusionChart;
    subapps: { name: string, included: boolean }[];
    subscriptions: Subscription[] = [];

    constructor(
        private title: Title,
        private fusionDataService: FusionDataService,
        private changeDetectorRef: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.title.setTitle(`Fusion Settings - ${APP_TITLE}`);
        this.subscriptions.push(this.fusionDataService.fusionChart.subscribe(chart => {
            this.changeDetectorRef.markForCheck();
            this.fusionChart = chart;
            this._subapps = Object.assign({}, this.fusionChart.includedSubapps);
            this.subapps = Object.entries(this._subapps).map(([ name, included ]) => ({ name, included }));
        }));
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
    }

    toggleIncludedSubapp(name: string) {
        this._subapps[name] = !this._subapps[name];
        this.fusionDataService.nextIncludedSubapps(this._subapps);
    }
}
