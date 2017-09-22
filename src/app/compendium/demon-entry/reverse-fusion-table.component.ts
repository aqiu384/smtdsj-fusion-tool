import { Component, ChangeDetectionStrategy, ChangeDetectorRef, Input, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Compendium } from '../models/compendium';
import { FusionTypes } from '../models/constants';
import { FusionRow } from '../models/models';
import { FusionChart } from '../models/fusion-chart';
import { calculateReverseFusions } from '../models/reverse-fusion-calculator';

import { FusionDataService } from '../services/fusion-data.service';
import { CurrentDemonService } from '../services/current-demon.service';

@Component({
    selector: 'app-special-reverse-fusion-table',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <table>
            <thead>
                <tr>
                    <th class="navbar"
                        colspan="2"
                        routerLinkActive="active"
                        routerLink="../reverse-fusions"
                        [style.width.%]="50">
                        Reverse Fusions
                    </th>
                    <th class="navbar"
                        colspan="2"
                        routerLinkActive="active"
                        routerLink="../forward-fusions"
                        [style.width.%]="50">
                        Forward Fusions
                    </th>
                </tr>
                <tr>
                    <th colspan="4">Special Fusion Recipe</th>
                </tr>
                <tr>
                    <th>Race</th>
                    <th>Lvl</th>
                    <th>Name</th>
                </tr>
            </thead>
            <tbody>
                <tr *ngFor="let ingredient of ingredients">
                    <td>{{ ingredient.race1 }}</td>
                    <td>{{ ingredient.lvl1 }}</td>
                    <td colspan="2"><a routerLink="/demons/{{ ingredient.name1 }}">{{ ingredient.name1 }}</a></td>
                </tr>
            </tbody>
        </table>
    `
})
export class SpecialReverseFusionTableComponent {
    @Input() ingredients: FusionRow[];
}

@Component({
    selector: 'app-exception-reverse-fusion-table',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <table>
            <thead>
                <tr>
                    <th class="navbar"
                        routerLinkActive="active"
                        routerLink="../reverse-fusions"
                        [style.width.%]="50">
                        Reverse Fusions
                    </th>
                    <th class="navbar"
                        routerLinkActive="active"
                        routerLink="../forward-fusions"
                        [style.width.%]="50">
                        Forward Fusions
                    </th>
                </tr>
                <tr>
                    <th colspan="2">Special Fusion Condition</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td colspan="2" *ngIf="fusionType === 'accident'">Fusion Accident Only</td>
                    <td colspan="2" *ngIf="fusionType === 'password'">Password Only</td>
                </tr>
            </tbody>
        </table>
    `
})
export class ExceptionReverseFusionTableComponent {
    @Input() fusionType: string;
}

@Component({
    selector: 'app-reverse-fusion-table',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <ng-container *ngIf="results$ | async as results">
            <app-fusion-table *ngIf="results.type === 'normal'"
                [rowData]="results.data" [headers]="headers"
                [laplaceOn]="fusionChart.isSubappOn('Laplace')">
            </app-fusion-table>
            <app-special-reverse-fusion-table *ngIf="results.type === 'special'"
                [ingredients]="results.data">
            </app-special-reverse-fusion-table>
            <app-exception-reverse-fusion-table *ngIf="results.type === 'accident' || results.type === 'password'"
                [fusionType]="results.type">
            </app-exception-reverse-fusion-table>
        <ng-container>
    `
})
export class ReverseFusionTableComponent implements OnInit, OnDestroy {
    static readonly HEADERS = {
        left: 'Ingredient 1',
        right: 'Ingredient 2'
    };

    headers = ReverseFusionTableComponent.HEADERS;
    compendium: Compendium;
    fusionChart: FusionChart;
    currentDemon: string;

    results$: Observable<{ type: string, data: FusionRow[]}>;
    subscriptions: Subscription[] = [];

    constructor(
        private fusionDataService: FusionDataService,
        private currentDemonService: CurrentDemonService,
        private changeDetectorRef: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.subscriptions.push(
            this.fusionDataService.compendium.subscribe(compendium => {
                this.compendium = compendium;
                this.getReverseFusions();
            }));

        this.subscriptions.push(
            this.fusionDataService.fusionChart.subscribe(fusionChart => {
                this.fusionChart = fusionChart;
                this.getReverseFusions();
            }));

        this.subscriptions.push(
            this.currentDemonService.currentDemon.subscribe(name => {
                this.currentDemon = name;
                this.getReverseFusions();
            }));
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
    }

    getReverseFusions() {
        if (this.compendium && this.fusionChart && this.currentDemon) {
            this.changeDetectorRef.markForCheck();
            this.results$ = Observable.create(observer => {
                observer.next(calculateReverseFusions(this.currentDemon, this.compendium, this.fusionChart));
            });
        }
    }
}
