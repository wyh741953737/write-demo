import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hello-every',
  templateUrl: './hello-every.component.html',
  styleUrls: ['./hello-every.component.css']
})
export class HelloEveryComponent implements OnInit {
  citys = [{ p: '浙江', c: '杭州'}, { p:'上海', c: '上海'}, {p: '福建', c: '厦门'}];
  car = 'A';
  flag = true;
  constructor() { }

  ngOnInit(): void {
  }

}
