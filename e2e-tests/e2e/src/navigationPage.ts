import { Locator, Page } from "@playwright/test";
import { HelperBase } from "./helperBase";

export class NavigationPage extends HelperBase{

    readonly formLayoutsMenuTitle: Locator;
    readonly datepickerMenuTitle: Locator;
    readonly toastrMenuTitle: Locator;
    readonly tooltipMenuTitle: Locator;
    readonly smartTableMenuTitle: Locator;

    constructor(page: Page) {
        super(page);
        this.formLayoutsMenuTitle = page.getByText('Form Layouts');
        this.datepickerMenuTitle = page.getByText('Datepicker');
        this.toastrMenuTitle = page.getByText('Toastr');
        this.tooltipMenuTitle = page.getByText('Tooltip');
        this.smartTableMenuTitle = page.getByText('Smart Table');
    }

    async navigateToFormLayoutsPage(): Promise<void> {
        await this.expandNavigationGroupIfCollapsed('Forms');
        await this.formLayoutsMenuTitle.click();
        await this.waitForNumberOfSeconds(1);
    }

    async navigateToDatepickerPage(): Promise<void> {
        await this.expandNavigationGroupIfCollapsed('Forms');
        await this.datepickerMenuTitle.click();
    }

    async navigateToToastrPage(): Promise<void> {
        await this.expandNavigationGroupIfCollapsed('Modal & Overlays');
        await this.toastrMenuTitle.click();
    }

    async navigateToTooltipPage(): Promise<void> {
        await this.expandNavigationGroupIfCollapsed('Modal & Overlays');
        await this.tooltipMenuTitle.click();
    }

    async navigateToSmartTablePage(): Promise<void> {
        await this.expandNavigationGroupIfCollapsed('Tables & Data');
        await this.smartTableMenuTitle.click();
    }

    private async expandNavigationGroupIfCollapsed(groupName: string): Promise<void> {
        const group = this.page.getByTitle(groupName);
        const isExpanded = await group.getAttribute('aria-expanded');
        if (isExpanded === 'false') {
            await group.click();
        }
    }
}
