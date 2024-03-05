import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-stokrehber',
  templateUrl: './stokrehber.component.html',
  styleUrls: ['./stokrehber.component.css']
})
export class StokrehberComponent  {

  @Output() secilenDeger = new EventEmitter<string>();
  aramaKriteri: string = '';
  aramaSonuclari: string[] = ['Değer1', 'Değer2', 'Değer3', 'Değer4']; // Örnek veri, gerçek veriye değiştirilmeli

  aramaYap() {
    // Gerçek veritabanından veya servisten arama yapılabilir
    this.aramaSonuclari = this.aramaKriteri
      ? this.aramaSonuclari.filter(deger => deger.toLowerCase().includes(this.aramaKriteri.toLowerCase()))
      : [];
  }

  secilenDegeriGonder(deger: string) {
    this.secilenDeger.emit(deger);
  }

}
