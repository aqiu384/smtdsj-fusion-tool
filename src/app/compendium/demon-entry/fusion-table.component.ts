import {
    Component,
    ChangeDetectionStrategy,
    Input,
    OnInit,
    AfterViewChecked,
    OnDestroy
} from '@angular/core';
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
            <th class="navbar"
                colspan="3"
                routerLinkActive="active"
                routerLink="../reverse-fusions"
                [style.width.%]="50">
                Reverse Fusions
            </th>
            <th class="navbar"
                colspan="3"
                routerLinkActive="active"
                routerLink="../forward-fusions"
                [style.width.%]="50">
                Forward Fusions
            </th>
        </tr>
        <tr *ngIf="laplaceOn">
            <th colspan="6">Laplace Subapp Enabled (Result Lvl +4)</th>
        </tr>
        <tr>
            <th colspan="3">{{ headers.left }}</th>
            <th colspan="3">{{ headers.right }}</th>
        </tr>
        <tr>
            <th class="sortable {{ sortDirClass(1) }}" (click)="nextSortFunIndex(1)">Race</th>
            <th class="sortable {{ sortDirClass(2) }}" (click)="nextSortFunIndex(2)">Lvl</th>
            <th class="sortable {{ sortDirClass(3) }}" (click)="nextSortFunIndex(3)">Name</th>
            <th class="sortable {{ sortDirClass(4) }}" (click)="nextSortFunIndex(4)">Race</th>
            <th class="sortable {{ sortDirClass(5) }}" (click)="nextSortFunIndex(5)">Lvl</th>
            <th class="sortable {{ sortDirClass(6) }}" (click)="nextSortFunIndex(6)">Name</th>
        </tr>
    `
})
export class FusionTableHeaderComponent extends SortedTableHeaderComponent {
    @Input() headers: FusionTableHeaders;
    @Input() laplaceOn: boolean;
}

@Component({
    selector: 'app-fusion-table',
    providers: [ PositionEdgesService ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <table appPositionSticky>
            <tfoot #stickyHeader appColumnWidths
                class="app-fusion-table-header sticky-header"
                [headers]="headers"
                [laplaceOn]="laplaceOn"
                [sortFunIndex]="sortFunIndex"
                (sortFunIndexChanged)="sortFunIndex = $event">
            </tfoot>
        </table>
        <table>
            <tfoot #hiddenHeader appColumnWidths
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
export class FusionTableComponent extends SortedTableComponent<FusionRow> implements AfterViewChecked {
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

    ngAfterViewChecked() {
        this.matchColWidths();
    }

    getSortFun(sortFunIndex: number): (a: FusionRow, b: FusionRow) => number {
        return FusionTableComponent.SORT_FUNS[sortFunIndex];
    }
}
