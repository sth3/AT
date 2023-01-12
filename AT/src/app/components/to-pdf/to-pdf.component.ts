import { ChangeDetectorRef, Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgModel, Validators } from '@angular/forms';
import { OrdersService } from '../../services/orders.service';
import { RecipeService } from '../../services/recipe.service';
import { OrderListModel, OrderModel } from '../../models/order.model';
import { RecipeModel } from '../../models/recipe.model';
import { ActivatedRoute, Router } from '@angular/router';


import { animate, style, transition, trigger } from '@angular/animations';
// declare var require: any;
// import * as pdfMake from "pdfmake/build/pdfmake";
// import * as pdfFonts from "pdfmake/build/vfs_fonts";
// const htmlToPdfmake = require("html-to-pdfmake");
// (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

import  jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-to-pdf',
  templateUrl: './to-pdf.component.html',
  styleUrls: ['./to-pdf.component.css'],
  animations: [
    trigger('grow', [ // Note the trigger name
      transition(':enter', [
        style({ height: '0', overflow: 'hidden' }),
        animate(500, style({ height: '*' }))
      ]),
      transition(':leave', [
        animate(500, style({ height: 0, overflow: 'hidden' }))
      ])
    ])
  ]
})
export class ToPDFComponent implements OnInit {
  editable = true;
  isNew!: boolean;
  order?: OrderModel;
  recipes: RecipeModel[] = [];
  allOrders: OrderListModel[] = [];
  selectedRecipe: RecipeModel | undefined;
  orderDueDate:string | undefined;

  form!: FormGroup;



  constructor(private router: Router, private r: ActivatedRoute,
    private ordersService: OrdersService,
    private recipeService: RecipeService,
    private changeDetectorRef: ChangeDetectorRef) { this.prepareForm(); }

  ngOnInit(): void {
    this.r.params.subscribe(params => {
      const no = params['id'];

      this.ordersService.getOrderByNo(no)
        .subscribe(order => {
          console.log('this order: ', order);
          console.log('this order: ', order['no']);
          this.orderDueDate = order['dueDate'];
          this.editable = false;
          this.isNew = false;
          this.order = order;
          this.prepareForm();

          this.recipeService.getRecipes()
            .subscribe(recipes => {
              console.log('recipes: ', recipes);
              this.recipes = recipes;
              this.selectedRecipe = this.recipes.find(r => r.no === this.order?.recipe.no);
              console.log('selected recipe: ', this.selectedRecipe);
              this.changeDetectorRef.detectChanges();
            })
        })
    })
    this.ordersService.getOrdersList()
      .subscribe(orders => this.allOrders = orders)
  }

  recipeSelected() {
    console.log('selected recipe: ', this.selectedRecipe);
    this.form.get('recipeNo')!.setValue(this.selectedRecipe?.no);
  }



  //@ViewChild('pdfTable')
  //pdfTable!: ElementRef;
  @ViewChild('invoice') invoiceElement!: ElementRef;
  // public downloadAsPDF() {
  //   // const pdfTable = this.pdfTable.nativeElement;
  //   // var html = htmlToPdfmake(pdfTable.innerHTML);
  //   // const documentDefinition = { content: html };
  //   // pdfMake.createPdf(documentDefinition).download();
  //   let div = this.pdfTable.nativeElement;

  //   var img:any;
  //   var filename;
  //   var newImage:any;


  //   domtoimage.toPng(div, { bgcolor: '#fff' })

  //     .then(function(dataUrl) {

  //       img = new Image();
  //       img.src = dataUrl;
  //       newImage = img.src;

  //       img.onload = function(){

  //       var pdfWidth = img.width;
  //       var pdfHeight = img.height;

  //         // FileSaver.saveAs(dataUrl, 'my-pdfimage.png'); // Save as Image

  //         var doc;

  //         if(pdfWidth > pdfHeight)
  //         {
  //           doc = new jsPDF('l', 'px', [pdfWidth , pdfHeight]);
  //         }
  //         else
  //         {
  //           doc = new jsPDF('p', 'px', [pdfWidth , pdfHeight]);
  //         }


  //         var width = doc.internal.pageSize.getWidth();
  //         var height = doc.internal.pageSize.getHeight();


  //         doc.addImage(newImage, 'PNG',  10, 10, width, height);
  //         filename = 'mypdf_' + '.pdf';
  //         doc.save(filename);

  //       };


  //     })}
  public openPDF(): void {
    html2canvas(this.invoiceElement.nativeElement, { scale: 3 }).then((canvas) => {
      const imageGeneratedFromTemplate = canvas.toDataURL('image/png');
      const fileWidth = 200;
      const generatedImageHeight =  (canvas.height * fileWidth) / canvas.width;
      let PDF = new jsPDF('p', 'mm', 'a4',);
      PDF.addImage(imageGeneratedFromTemplate, 'PNG', 0, 0, fileWidth, generatedImageHeight,);
      PDF.html(this.invoiceElement.nativeElement.innerHTML)
      PDF.save('Orders.pdf');
    });
  }

  private prepareForm() {
    this.form = new FormGroup({
      id: new FormControl(this.order?.id || '', [Validators.required,
      Validators.minLength(10), Validators.maxLength(10), this.validOrderIdValidator.bind(this)]),
      name: new FormControl(this.order?.name || '', [Validators.required,
      Validators.minLength(3), this.validOrderNameValidator.bind(this)]),
      customerName: new FormControl(this.order?.customerName || '', Validators.required),
      dueDate: new FormControl(this.order?.dueDate, Validators.required),
      recipeNo: new FormControl(this.order?.recipe.no || '', Validators.required),
      quantity: new FormControl(this.order?.quantity || null, Validators.required),
      idMixer: new FormControl(this.order?.idMixer, Validators.required),
      mixingTime: new FormControl(this.order?.mixingTime || null, Validators.required),
      idPackingMachine: new FormControl(this.order?.idPackingMachine, Validators.required),
      idEmptyingStationBag: new FormControl(this.order?.idEmptyingStationBag, Validators.required),
      operatorId: new FormControl(this.order?.operator.id || '001'),
      // todo get real used id/name here
      operatorName: new FormControl(this.order?.operator.username || 'admin')
    })
  }

  validOrderNameValidator(control: FormControl) {
    const value = control.value;
    const isValid = this.allOrders.every(o => o.name !== value
      || (this.order !== null && o.no === this.order?.no));
    console.log('is valid messsing me? ', isValid);
    return isValid ? null : { invalidOrderName: true };
  }

  validOrderIdValidator(control: FormControl) {
    const value = control.value;
    const isValid = this.allOrders.every(o => o.id !== value
      || (this.order !== null && o.no === this.order?.no));
    return isValid ? null : { invalidOrderId: true };
  }

  backToOrder() {
    this.router.navigate(['../../orders'], { relativeTo: this.r })
  }

}
