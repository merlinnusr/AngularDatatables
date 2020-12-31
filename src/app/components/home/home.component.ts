import { Component, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { DataTablesModule } from 'angular-datatables';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  users: any;
  constructor(private http: HttpClient) {}
  someClickHandler(info: any): void {
    console.log(info);
  }
  ngOnInit(): void {
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 3,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post('/web/users/', dataTablesParameters, {
            headers: {
              'Content-type': 'application/json',
            },
          })
          .subscribe((resp) => {
            that.users = resp['data'];

            callback({
              recordsTotal: resp['recordsTotal'],
              recordsFiltered: resp['recordsFiltered'],
              data: [],
            });
          });
      },
      columns: [{ data: 'id' }, { data: 'name' }],
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        const self = this;
        // Unbind first in order to avoid any duplicate handler
        // (see https://github.com/l-lin/angular-datatables/issues/87)
        $('td', row).unbind('click');
        $('td', row).bind('click', () => {
          self.someClickHandler(data);
        });
        return row;
      },
    };
  }
}
