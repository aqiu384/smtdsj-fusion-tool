import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { FusionRow } from '../models/models';
import { Compendium } from '../models/compendium';
import { FusionChart } from '../models/fusion-chart';
import { calculateForwardFusions } from '../models/forward-fusion-calculator';

import { FusionDataService } from '../services/fusion-data.service';
import { CurrentDemonService } from '../services/current-demon.service';

@Component({
    selector: 'app-forward-fusion-table',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <app-fusion-table
            [headers]="headers"
            [rowData]="fusionRows | async"
            [laplaceOn]="fusionChart.isSubappOn('Laplace')">
        </app-fusion-table>
    `
})
export class ForwardFusionTableComponent implements OnInit, OnDestroy {
    static readonly HEADERS = {
        left: 'Ingredient 2',
        right: 'Result'
    };

    fusionRows: Observable<FusionRow[]>;
    compendium: Compendium;
    fusionChart: FusionChart;
    currentDemon: string;

    subscriptions: Subscription[] = [];
    headers = ForwardFusionTableComponent.HEADERS;

    constructor(
        private fusionDataService: FusionDataService,
        private currentDemonService: CurrentDemonService,
        private changeDetectorRef: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.subscriptions.push(
            this.fusionDataService.compendium.subscribe(compendium => {
                this.compendium = compendium;
                this.getForwardFusions();
            }));

        this.subscriptions.push(
            this.fusionDataService.fusionChart.subscribe(fusionChart => {
                this.fusionChart = fusionChart;
                this.getForwardFusions();
            }));

        this.subscriptions.push(
            this.currentDemonService.currentDemon.subscribe(name => {
                this.currentDemon = name;
                this.getForwardFusions();
            }));
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
    }

    getForwardFusions() {
        if (this.compendium && this.fusionChart && this.currentDemon) {
            this.changeDetectorRef.markForCheck();
            this.fusionRows = Observable.create(observer => {
                observer.next(calculateForwardFusions(this.currentDemon, this.compendium, this.fusionChart));
            });
        }
    }
}
