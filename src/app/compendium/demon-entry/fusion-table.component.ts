import { Component, ChangeDetectionStrategy, ElementRef, Input, Renderer2 } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { RaceOrder } from '../models/constants';
import { FusionTableHeaders, FusionRow } from '../models/models';

import { PositionEdgesService } from '../sorted-table/position-edges.service';
import { SortedTableHeaderComponent, SortedTableComponent } from '../sorted-table/sorted-table.component';

@Component({
    selector: 'tr.app-fusion-table-row',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <td>{{ data.race1 }}</td>
        <td>{{ data.lvl1 }}</td>
        <td><a routerLink="/demons/{{ data.name1 }}">{{ data.name1 }}</a></td>
        <td>{{ data.race2 }}</td>
        <td>{{ data.lvl2 }}</td>
        <td><a routerLink="/demons/{{ data.name2 }}">{{ data.name2 }}</a></td>
    `
})
export class FusionTableRowComponent {
    @Input() data: FusionRow;
}

@Component({
    selector: 'tfoot.app-fusion-table-header',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <tr>
            <th class="navbar" colspan="3" routerLinkActive="active">
                <a routerLink="../reverse-fusions">Reverse Fusions</a>
            </th>
            <th class="navbar" colspan="3" routerLinkActive="active">
                <a routerLink="../forward-fusions">Forward Fusions</a>
            </th>
        </tr>
        <tr>
            <th *ngIf="laplaceOn" colspan="6">Laplace Subapp Enabled (Result Lvl +4)</th>
        </tr>
        <tr>
            <th colspan="3" [style.width.%]="50">{{ headers.left }}</th>
            <th colspan="3" [style.width.%]="50">{{ headers.right }}</th>
        </tr>
        <tr>
            <th class="sortable {{ sortDir(sortFuns[0]) }}" (click)="sortFun = sortFuns[0]">Race</th>
            <th class="sortable {{ sortDir(sortFuns[1]) }}" (click)="sortFun = sortFuns[1]">Lvl</th>
            <th class="sortable {{ sortDir(sortFuns[2]) }}" (click)="sortFun = sortFuns[2]">Name</th>
            <th class="sortable {{ sortDir(sortFuns[3]) }}" (click)="sortFun = sortFuns[3]">Race</th>
            <th class="sortable {{ sortDir(sortFuns[4]) }}" (click)="sortFun = sortFuns[4]">Lvl</th>
            <th class="sortable {{ sortDir(sortFuns[5]) }}" (click)="sortFun = sortFuns[5]">Name</th>
        </tr>
    `
})
export class FusionTableHeaderComponent extends SortedTableHeaderComponent<FusionRow> {
    static readonly SORT_FUNS: ((f1: FusionRow, f2: FusionRow) => number)[] = [
        (f1, f2) => (RaceOrder[f1.race1] - RaceOrder[f2.race1]) * 100 + f2.lvl1 - f1.lvl1,
        (f1, f2) => f1.lvl1 - f2.lvl1,
        (f1, f2) => f1.name1.localeCompare(f2.name1),
        (f1, f2) => (RaceOrder[f1.race2] - RaceOrder[f2.race2]) * 100 + f2.lvl2 - f1.lvl2,
        (f1, f2) => f1.lvl2 - f2.lvl2,
        (f1, f2) => f1.name2.localeCompare(f2.name2)
    ];

    @Input() headers: FusionTableHeaders;
    @Input() laplaceOn: boolean;
    sortFuns = FusionTableHeaderComponent.SORT_FUNS;

    constructor(private elementRef: ElementRef, private renderer: Renderer2) {
        super(elementRef, renderer, FusionTableHeaderComponent.SORT_FUNS[0]);
    }
}

@Component({
    selector: 'app-fusion-table',
    providers: [ PositionEdgesService ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <app-sticky-table-header>
            <tfoot #stickyHeader
                class="app-fusion-table-header sticky-header"
                [headers]="headers"
                [laplaceOn]="laplaceOn"
                (sortFunChanged)="sort()">
            </tfoot>
        </app-sticky-table-header>
        <table>
            <tfoot #hiddenHeader
                class="app-fusion-table-header"
                [style.visibility]="'collapse'"
                [headers]="headers"
                [laplaceOn]="laplaceOn">
            </tfoot>
            <tbody>
                <tr colspan="6" *ngIf="!rowData.length">
                    <td>No fusion recipes found</td>
                </tr>
                <tr *ngFor="let data of rowData"
                    class="app-fusion-table-row"
                    [style.backgroundColor]="data.notes ? 'darkgreen' : null"
                    [data]="data">
                </tr>
            </tbody>
        </table>
    `
})
export class FusionTableComponent extends SortedTableComponent<FusionRow> {
    @Input() headers: FusionTableHeaders;
    @Input() laplaceOn: boolean;
}
