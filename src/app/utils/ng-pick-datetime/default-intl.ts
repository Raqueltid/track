import { OwlDateTimeIntl } from 'ng-pick-datetime';
import { TranslateService } from '@ngx-translate/core';
import { UtilsService } from '../../services/utils/utils.service';
import { Inject } from '@angular/core';

export class DefaultIntl extends OwlDateTimeIntl {
    public cancelBtnLabel = '';
    public setBtnLabel = '';
    private currentLang;

    constructor(@Inject(TranslateService) private translateService, private utilsService: UtilsService) {
        super();
        this.getLang();
        this.translateService.onLangChange.subscribe(lang => {
            this.getLang();
        });
    }

    public getLang() {
      this.utilsService.languageCharged(this.translateService).subscribe(() => {
        console.log();
        this.cancelBtnLabel = this.translateService.get('CALENDAR_CANCEL')['value'];
        this.setBtnLabel = this.translateService.get('CALENDAR_SET')['value'];
      });
    }
}
