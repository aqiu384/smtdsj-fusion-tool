import {
    Component,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    ElementRef,
    Input,
    OnInit,
    OnDestroy,
    Renderer2
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import {
    BaseStats,
    ResistanceElements,
    RaceOrder,
    SkillElementOrder,
    ResistanceOrder,
    APP_TITLE
} from './models/constants';
import { Demon } from './models/models';
import { Compendium } from './models/compendium';

import { PositionEdgesService } from './sorted-table/position-edges.service';
import { SortedTableHeaderComponent, SortedTableComponent } from './sorted-table/sorted-table.component';
import { FusionDataService } from './services/fusion-data.service';

@Component({
    selector: 'tr.app-demon-table-row',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <td>{{ data.race }}</td>
        <td>{{ data.lvl }}</td>
        <td><a routerLink="/demons/{{ data.name }}">{{ data.name }}</a></td>
        <td *ngFor="let stat of data.stats">{{ stat }}</td>
        <td *ngFor="let resist of data.resists" class="resists {{ resist }}">{{ resist }}</td>
    `
})
export class DemonTableRowComponent {
    @Input() data: Demon;
}

@Component({
    selector: 'tfoot.app-demon-table-header',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <tr>
            <th colspan="3">Demon</th>
            <th colspan="7">Base Stats</th>
            <th colspan="8">Resistances</th>
        </tr>
        <tr>
            <th class="sortable {{ sortDir(sortFuns[0]) }}" (click)="sortFun = sortFuns[0]">Race</th>
            <th class="sortable {{ sortDir(sortFuns[1]) }}" (click)="sortFun = sortFuns[1]">Lvl</th>
            <th class="sortable {{ sortDir(sortFuns[2]) }}" (click)="sortFun = sortFuns[2]">Name</th>
            <th *ngFor="let pair of statColIndices"
                class="sortable {{ sortDir(sortFuns[pair.index]) }}"
                (click)="sortFun = sortFuns[pair.index]">
                {{ pair.stat }}
            </th>
            <th *ngFor="let pair of elemColIndices"
                class="sortable {{ sortDir(sortFuns[pair.index]) }}"
                (click)="sortFun = sortFuns[pair.index]">
                <div class="element-icon {{ pair.element }}"></div>
            </th>
        </tr>
    `
})
export class DemonTableHeaderComponent extends SortedTableHeaderComponent<Demon> {
    static readonly STAT_COL_INDICES = BaseStats.map((stat, i) => ({ stat, index: i + 3 }));
    static readonly ELEM_COL_INDICES = ResistanceElements.map((element, i) => ({ element, index: i + 10 }));
    static readonly SORT_FUNS: ((a: Demon, b: Demon) => number)[] = [
        (d1, d2) => (RaceOrder[d1.race] - RaceOrder[d2.race]) * 100 + d2.lvl - d1.lvl,
        (d1, d2) => d2.lvl - d1.lvl,
        (d1, d2) => d1.name.localeCompare(d2.name)
    ].concat(
        BaseStats.map((stat, index) =>
            (d1, d2) => d2.stats[index] - d1.stats[index]),
        ResistanceElements.map((element, index) =>
            (d1, d2) => ResistanceOrder[d2.resists[index]] - ResistanceOrder[d1.resists[index]])
    );

    statColIndices = DemonTableHeaderComponent.STAT_COL_INDICES;
    elemColIndices = DemonTableHeaderComponent.ELEM_COL_INDICES;
    sortFuns = DemonTableHeaderComponent.SORT_FUNS;

    constructor(private elementRef: ElementRef, private renderer: Renderer2) {
        super(elementRef, renderer, DemonTableHeaderComponent.SORT_FUNS[0]);
    }
}

@Component({
    selector: 'app-demon-list',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <app-sticky-table-header>
            <tfoot #stickyHeader
                class="app-demon-table-header sticky-header"
                (sortFunChanged)="sort()">
            </tfoot>
        </app-sticky-table-header>
        <table>
            <tfoot #hiddenHeader
                class="app-demon-table-header"
                [style.visibility]="'collapse'">
            </tfoot>
            <tbody>
                <tr *ngFor="let data of rowData"
                    class="app-demon-table-row"
                    [style.backgroundColor]="data.fusion === 'normal' ? null :
                        data.fusion === 'special' ? 'darkgreen' : 'maroon'"
                    [data]="data">
                </tr>
            </tbody>
        </table>
    `
})
export class DemonListComponent extends SortedTableComponent<Demon> { }

@Component({
    selector: 'app-demon-list-container',
    providers: [ PositionEdgesService ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <app-demon-list [rowData]="demons | async"></app-demon-list>
    `
})
export class DemonListContainerComponent implements OnInit, OnDestroy {
    demons: Observable<Demon[]>;
    subscriptions: Subscription[] = [];

    constructor(
        private title: Title,
        private fusionDataService: FusionDataService,
        private changeDetector: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.title.setTitle(`List of Demons - ${APP_TITLE}`);

        this.subscriptions.push(
            this.fusionDataService.compendium.subscribe(
                this.onCompendiumUpdated.bind(this)));
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
    }

    onCompendiumUpdated(compendium: Compendium) {
        this.changeDetector.markForCheck();
        this.demons = Observable.create(observer => {
            const demons = compendium.getAllDemons();
            observer.next(demons.slice(0, 50));
            setTimeout(() => observer.next(demons));
        });
    }
}
