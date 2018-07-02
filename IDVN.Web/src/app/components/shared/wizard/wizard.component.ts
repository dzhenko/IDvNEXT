import { Component, AfterViewInit, ElementRef, Input, OnChanges, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'wizard',
    templateUrl: './wizard.component.html',
    styleUrls: ['./wizard.component.css']
})
export class WizardComponent implements AfterViewInit, OnChanges {
    @Input() public index: number = 0;
    @Output() public indexChange: EventEmitter<number> = new EventEmitter<number>();

    @Input() public steps: any[] = [];
    @Input() public enableTabChange: boolean = true;
    @Input() public enableForwardTabChange: boolean = true;
    @Input() public enableBackwardTabChange: boolean = true;
    @Input() public tabClass: string = 'nav nav-pills';
    @Input() public nextSelector: string = '.btn-next';
    @Input() public previousSelector: string = '.btn-previous';
    @Input() public finishSelector: string = '.btn-finish';
    @Input() public firstSelector: string = '.wizard li.first';
    @Input() public lastSelector: string = '.wizard li.last';

    @Input() public onInit: (tab, navigation, currentIndex) => void = null;
    @Input() public onTabShow: (tab, navigation, currentIndex) => void = null;

    @Input() public onTabClick: (tab, navigation, currentIndex, nextTab) => boolean = this.onWizardTabClick;

    @Input() public onShow: (tab, navigation, currentIndex) => void = null;
    @Input() public onNext: (tab, navigation, currentIndex) => void = null;
    @Input() public onPrevious: (tab, navigation, currentIndex) => void = null;
    @Input() public onLast: (tab, navigation, currentIndex) => void = null;
    @Input() public onFirst: (tab, navigation, currentIndex) => void = null;
    @Input() public onTabChange: (tab, navigation, currentIndex, nextIndex) => boolean = null;

    private wizard: any = null;

    constructor(private el: ElementRef) { }

    ngAfterViewInit() {
        this.wizard = ($(this.el.nativeElement).find('.wizard-card') as any).bootstrapWizard({
            tabClass: this.tabClass,
            nextSelector: this.nextSelector,
            previousSelector: this.previousSelector,
            firstSelector: this.firstSelector,
            lastSelector: this.lastSelector,

            onInit: (tab, navigation, currentIndex) => this.onWizardInit(tab, navigation, currentIndex),
            onTabShow: (tab, navigation, currentIndex) => this.onWizardTabShow(tab, navigation, currentIndex),

            onTabClick: (tab, navigation, currentIndex, nextTab) => this.onWizardTabClick(tab, navigation, currentIndex, nextTab),

            onShow: this.onShow,
            onNext: this.onNext,
            onPrevious: this.onPrevious,
            onLast: this.onLast,
            onFirst: this.onFirst,
            onTabChange: null,
        }).data('bootstrapWizard');
    }

    ngOnChanges(changes: any) {
        if (!changes) {
            return;
        }

        if (changes.index && this.wizard) {
            this.wizard.show(changes.index.currentValue);
        }
    }

    private onWizardInit(tab, navigation, currentIndex) {
        var $total = navigation.find('li').length;
        var $width = 100 / $total;
        navigation.find('li').css('width', $width + '%');

        if (this.onInit) {
            this.onInit(tab, navigation, currentIndex);
        }
    }

    private onWizardTabClick(tab, navigation, currentIndex, nextIndex): boolean {
        if (this.enableTabChange) {
            if (currentIndex < nextIndex) {
                if (this.enableForwardTabChange) {
                    this.index = nextIndex;
                    this.indexChange.emit(this.index);
                    return true;
                }
                else {
                    return false;
                }
            }
            else if (nextIndex < currentIndex) {
                if (this.enableBackwardTabChange) {
                    this.index = nextIndex;
                    this.indexChange.emit(this.index);
                    return true;
                }
                else {
                    return false;
                }
            }
        }
        else {
            return false;
        }
    }

    private onWizardTabShow(tab, navigation, currentIndex) {
        var $total = navigation.find('li').length;
        var $current = currentIndex + 1;

        var $wizard = navigation.closest('.wizard-card');

        // If it's the last tab then hide the last button and show the finish instead
        if ($current >= $total) {
            $($wizard).find(this.nextSelector).hide();
            $($wizard).find(this.finishSelector).show();
        } else {
            $($wizard).find(this.nextSelector).show();
            $($wizard).find(this.finishSelector).hide();
        }

        //update progress
        var move_distance = 100 / $total;
        move_distance = move_distance * (currentIndex) + move_distance / 2;

        $wizard.find($('.progress-bar')).css({ width: move_distance + '%' });

        $wizard.find($('.wizard-card .nav-pills li.active a .icon-circle')).addClass('checked');

        if (this.onTabShow) {
            this.onTabShow(tab, navigation, currentIndex);
        }
    };
}
