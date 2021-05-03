import { Component, OnInit } from '@angular/core';
import {UiChangeThemeService} from '../shared/services/ui-change-theme.service';
import {ChangeThemeIconAnimation} from './change-theme-icon-animation';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: ChangeThemeIconAnimation
})
export class HeaderComponent implements OnInit {

  constructor(private changeThemeService: UiChangeThemeService) { }

  ngOnInit(): void {
  }

  changeTheme(): void {
    this.changeThemeService.changeTheme();
  }

  get isDarkThemeUsed(): boolean {
    return this.changeThemeService.isDarkThemeUsed;
  }
}
