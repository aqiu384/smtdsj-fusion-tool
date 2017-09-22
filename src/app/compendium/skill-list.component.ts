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

import { SkillElementOrder, InheritElementOrder, APP_TITLE } from './models/constants';
import { Skill } from './models/models';
import { Compendium } from './models/compendium';

import { PositionEdgesService } from './sorted-table/position-edges.service';
import { SortedTableHeaderComponent, SortedTableComponent } from './sorted-table/sorted-table.component';
import { FusionDataService } from './services/fusion-data.service';

@Component({
    selector: 'tr.app-skill-table-row',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <td><div class="element-icon {{ data.element }}">{{ data.element }}</div></td>
        <td>{{ data.name }}</td>
        <td [style.color]="data.cost ? null: 'transparent'">{{ data.cost }}</td>
        <td>{{ data.effect }}</td>
        <td [style.color]="data.power ? null: 'transparent'">{{ data.power }}</td>
        <td [style.color]="data.accuracy ? null: 'transparent'">{{ data.accuracy }}</td>
        <td><div class="element-icon {{ data.inherit }}">{{ data.inherit }}</div></td>
        <td [style.color]="data.rank ? null: 'transparent'">{{ data.rank }}</td>
        <td>
            <ul class="comma-list">
                <li *ngFor="let demon of data.learnedBy">
                    <a routerLink="/demons/{{ demon }}">{{ demon }}</a>
                </li>
            </ul>
        </td>
        <td>
            <ul class="comma-list">
                <li *ngFor="let demon of data.dsource">
                    <a routerLink="/demons/{{ demon }}">{{ demon }}</a>
                </li>
            </ul>
        </td>
    `
})
export class SkillTableRowComponent {
    @Input() data: Skill;
}

@Component({
    selector: 'tfoot.app-skill-table-header',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <tr>
            <th colspan="8">Skill</th>
            <th colspan="2">How to Acquire</th>
        </tr>
        <tr>
            <th class="sortable {{ sortDir(sortFuns[0]) }}" (click)="sortFun = sortFuns[0]">Element<span>--</span></th>
            <th class="sortable {{ sortDir(sortFuns[1]) }}" (click)="sortFun = sortFuns[1]">Name</th>
            <th class="sortable {{ sortDir(sortFuns[2]) }}" (click)="sortFun = sortFuns[2]">Cost<span>--</span></th>
            <th class="sortable {{ sortDir(sortFuns[3]) }}" [style.width.px]="200" (click)="sortFun = sortFuns[3]">Effect</th>
            <th class="sortable {{ sortDir(sortFuns[4]) }}" (click)="sortFun = sortFuns[4]">Power<span>--</span></th>
            <th class="sortable {{ sortDir(sortFuns[5]) }}" (click)="sortFun = sortFuns[5]">Accuracy<span>--</span></th>
            <th class="sortable {{ sortDir(sortFuns[6]) }}" (click)="sortFun = sortFuns[6]">Inherits<span>--</span></th>
            <th class="sortable {{ sortDir(sortFuns[7]) }}" (click)="sortFun = sortFuns[7]">Rank<span>--</span></th>
            <th class="sortable {{ sortDir(sortFuns[8]) }}" [style.width.px]="200" (click)="sortFun = sortFuns[8]">Learned By</th>
            <th class="sortable {{ sortDir(sortFuns[9]) }}" [style.width.px]="200" (click)="sortFun = sortFuns[9]">D-source</th>
        </tr>
    `,
    styles: [
        'span { visibility: hidden; }'
    ]
})
export class SkillTableHeaderComponent extends SortedTableHeaderComponent<Skill> {
    static readonly SORT_FUNS: ((d1: Skill, d2: Skill) => number)[] = [
        (d1, d2) => (SkillElementOrder[d1.element] - SkillElementOrder[d2.element]) * 10000 + d1.rank - d2.rank,
        (d1, d2) => d1.name.localeCompare(d2.name),
        (d1, d2) => d1.cost - d2.cost,
        (d1, d2) => d1.effect.localeCompare(d2.effect),
        (d1, d2) => d2.power - d1.power,
        (d1, d2) => d2.accuracy - d1.accuracy,
        (d1, d2) => InheritElementOrder[d1.inherit] - InheritElementOrder[d2.inherit],
        (d1, d2) => d2.rank - d1.rank,
        (d1, d2) => d2.learnedBy.length - d1.learnedBy.length,
        (d1, d2) => d2.dsource.length - d1.dsource.length,
    ];

    sortFuns = SkillTableHeaderComponent.SORT_FUNS;

    constructor(private elementRef: ElementRef, private renderer: Renderer2) {
        super(elementRef, renderer, SkillTableHeaderComponent.SORT_FUNS[0]);
    }
}

@Component({
    selector: 'app-skill-list',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <app-sticky-table-header>
            <tfoot #stickyHeader
                class="app-skill-table-header sticky-header"
                (sortFunChanged)="sort()">
            </tfoot>
        </app-sticky-table-header>
        <table>
            <tfoot #hiddenHeader
                class="app-skill-table-header"
                [style.visibility]="'collapse'">
            </tfoot>
            <tbody>
                <tr *ngFor="let data of rowData"
                    class="app-skill-table-row {{ data.unique ? 'skill unique' : null }}"
                    [data]="data">
                </tr>
            </tbody>
        </table>
    `
})
export class SkillListComponent extends SortedTableComponent<Skill> { }

@Component({
    selector: 'app-skill-list-container',
    providers: [ PositionEdgesService ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <app-skill-list [rowData]="skills | async"></app-skill-list>
    `
})
export class SkillListContainerComponent implements OnInit, OnDestroy {
    skills: Observable<Skill[]>;
    subscriptions: Subscription[] = [];

    constructor(
        private title: Title,
        private fusionDataService: FusionDataService,
        private changeDetector: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.title.setTitle(`List of Skills - ${APP_TITLE}`);

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
        this.skills = Observable.create(observer => {
            const skills = compendium.getAllSkills();
            observer.next(skills.slice(0, 50));
            setTimeout(() => observer.next(skills));
        });
    }
}
