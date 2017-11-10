import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderComponent } from './order.component';
import { SharedModule } from '../../../shared/shared.module';
import { HttpRequestService } from '../../../shared/index';

@NgModule({
  imports: [SharedModule, CommonModule],
  declarations: [OrderComponent],
  exports: [OrderComponent]
})
export class OrderModule { }
