import {
    AfterViewChecked,
    ChangeDetectionStrategy,
    Input,
    Output,
    EventEmitter,
    ElementRef,
    Renderer2,
    ViewChild,
} from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { PositionEdges } from './position-edges';
import { PositionEdgesService } from './position-edges.service';

export class SortedTableHeaderComponent<TData> {
    static readonly SortDirection = {
        None: 'none',
        Ascending: 'asc',
        Descending: 'desc'
    };

    @Input() borderWidth = 2;
    @Input() defaultSortAsync = true;
    @Output() sortFunChanged = new EventEmitter<(a: TData, b: TData) => number>();

    private sortAscFun: (a: TData, b: TData) => number;
    private sortAsc = this.defaultSortAsync;

    constructor(
        private elementRef2: ElementRef,
        private renderer3: Renderer2,
        defaultSortFun: (a: TData, b: TData) => number
    ) {
        this.sortAscFun = defaultSortFun;
    }

    sortDir(sortFun: (a: TData, b: TData) => number): string {
        return sortFun !== this.sortAscFun ? SortedTableHeaderComponent.SortDirection.None :
            this.sortAsc ? SortedTableHeaderComponent.SortDirection.Ascending :
            SortedTableHeaderComponent.SortDirection.Descending;
    }

    get colWidths(): number[] {
        const colWidths = [];
        const rows = this.elementRef2.nativeElement.children;

        for (const column of rows[rows.length - 1].children) {
            colWidths.push(column.clientWidth - this.borderWidth);
        }

        return colWidths;
    }

    @Input() set colWidths(colWidths: number[]) {
        const rows = this.elementRef2.nativeElement.children;
        const cols = rows[rows.length - 1].children;

        for (let i = 0; i < cols.length; i++) {
            this.renderer3.setStyle(cols[i], 'width', `${colWidths[i]}px`);
        }
    }

    get sortFun(): (a: TData, b: TData) => number {
        return this.sortAsc ? this.sortAscFun : (a, b) => this.sortAscFun(b, a);
    }

    @Input() set sortFun(sortFun: (a: TData, b: TData) => number) {
        this.sortAsc = this.sortAscFun === sortFun ? !this.sortAsc : true;
        this.sortAscFun = sortFun;
        this.sortFunChanged.emit(this.sortFun);
    }
}

export class SortedTableComponent<TData> implements AfterViewChecked {
    @ViewChild('stickyHeader') stickyHeader: SortedTableHeaderComponent<TData>;
    @ViewChild('hiddenHeader') hiddenHeader: SortedTableHeaderComponent<TData>;

    private allRowData: TData[] = [];

    ngAfterViewChecked() {
        if (this.stickyHeader && this.hiddenHeader) {
            this.stickyHeader.colWidths = this.hiddenHeader.colWidths;
        }
    }

    get rowData(): TData[] {
        return this.allRowData;
    }

    @Input() set rowData(rowData: TData[]) {
        this.allRowData = rowData;
        this.sort();
    }

    sort() {
        this.allRowData.sort(this.stickyHeader.sortFun);
    }
}
