import { Injectable } from '@angular/core';
import {MatSnackBarModule} from '@angular/material/snack-bar';
@Injectable()
export class PageService {
  constructor(
    public snackBar: MatSnackBarModule
  ) {

  }


  pageInfo(com_obj,pagedata) {
       com_obj.title.setTitle(pagedata.page_title);
      com_obj.meta.updateTag({name:'keywords',content:pagedata.meta_data.Keywords});
      com_obj.meta.updateTag({name:'description',content:pagedata.meta_data.description}); 
  }
snakeMessage(message,action) {
     
   // this.snackBar.open(message, '', {
     // duration: 5000
      //panelClass:extraClasses
    //});
}
}
