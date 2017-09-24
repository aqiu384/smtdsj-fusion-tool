import {
    Directive,
    HostBinding,
    Input,
    ElementRef,
    OnInit,
    OnDestroy
} from '@angular/core';

import { Observable } from 'Rxjs/Observable';
import { Subscription } from 'Rxjs/Subscription';

import { PositionEdges } from './position-edges';
import { PositionEdgesService } from './position-edges.service';

@Directive({
    selector: '[appPositionSticky]'
})
export class PositionStickyDirective implements OnInit, OnDestroy {
    @HostBinding('class.position-sticky') cPositionSticky = true;
    @HostBinding('style.top.px') sTop = 0;

    private subscriptions: Subscription[] = [];
    private _edges: PositionEdges;

    constructor(
        private elementRef: ElementRef,
        private edgesService: PositionEdgesService,
    ) { }

    ngOnInit() {
        this.subscriptions.push(
            this.edgesService.parentEdges.subscribe(edges => {
                this.edges = edges;
            }));
    }

    ngOnDestroy() {
        for (const subcription of this.subscriptions) {
            subcription.unsubscribe();
        }
    }

    get edges(): PositionEdges {
        return Object.assign({}, this._edges, {
            top: this._edges.top + this.elementRef.nativeElement.getBoundingClientRect().height
        });
    }

    @Input() set edges(edges: PositionEdges) {
        this._edges = edges;
        this.sTop = edges.top;
        this.edgesService.nextEdges(this.edges);
    }
}
