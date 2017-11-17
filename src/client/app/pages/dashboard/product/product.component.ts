import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpRequestService, ParseSDKService, ParseUser, SharedService, Pagination } from '../../../shared/index';
import { Router } from '@angular/router';
declare var $: any;
/**
 * This class represents the lazy loaded ProductComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-product',
  templateUrl: 'product.component.html',
  styleUrls: ['product.component.css'],
})
export class ProductComponent implements OnInit {
  private listProduct: Array<any>;
  public listCategory: any;
  public currentCategoryId: any;
  public pagination: Pagination;
  public listPage: any = [];
  constructor(
    private sharedService: SharedService,
    private parse: ParseSDKService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    var self = this;
    this.pagination = new Pagination();
    this.pagination.page = 1;
    this.pagination.perPage = 2;
    this.pagination.enableLoading = true;
    this.pagination.enableMaxPageMode = true;
    this.pagination.maxPageInPagination = 5;
    this.pagination.getData = function (page: number, perPage: number) {
      return self.parse.cloud('getProductListWithCategory', {
        categoryId: self.currentCategoryId,
        limit: perPage,
        page: page
      })
    }
    this.pagination.getNumOfPage = function () {
      return self.parse.cloud('getCountProductWithCategory', {
        categoryId: self.currentCategoryId
      }).then(function (res: any) {
        return res.data;
      })
    }
  }

  ngOnInit() {
    var self = this;
    this.parse.cloud('getCategoryList', { limit: 10000, page: 1 }).then(function (res: any) {
      if (res && res.data) {
        self.listCategory = res.data;
        setTimeout(() => {
          $('.add-product-category').material_select(function (event: any) {
            console.log($(this));
          });
        }, 100);
      }
    }).catch(function (err: any) {
      console.log(err);
    });
    this.getPageNumber();
    this.getProduct(1);
  }

  getProduct(page: number) {
    var self = this;
    this.pagination.getPage(page).then(function (res: any) {
      self.listProduct = res.data;
      self.changeDetectorRef.detectChanges();
    }).catch(function(){
    })
  }

  getPageNumber() {
    var self = this;
    this.pagination.executeGetNumOfPage();
  }

  makePageList() {
    var self = this;
    self.listPage = [];
    if (self.pagination.page <= 3) {
      for (let i = 0; i < 5; i++) {
        if (i <= self.pagination.numOfPage)
          self.listPage.push(i + 1);
      }
    }
    else if (self.pagination.numOfPage - self.pagination.page <= 3) {
      for (let i = self.pagination.numOfPage; i > self.pagination.numOfPage - 5; i--) {
        self.listPage.unshift(i + 1);
      }
    } else {
      for (let i = self.pagination.page - 3; i <= self.pagination.page + 1; i++) {
        self.listPage.push(i + 1);
      }
    }
  }

  showProductDetails(args: any) {
    var index = args.currentTarget.children[0].innerText - 1;
    this.sharedService.setShareData('currentProduct', this.listProduct[index]);
    this.router.navigate(['dashboard/product/' + this.listProduct[index].id]);
  }

  onSelectCategory(event: any) {
    this.currentCategoryId = event;
    this.getPageNumber();
    this.getProduct(1);
  }

  onAddButtonTap(args: any) {
    this.router.navigate(['dashboard/product/new']);
  }

}
