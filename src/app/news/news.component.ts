import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
} from '@angular/core';
import jsPDF from 'jspdf';
import * as pdfjsLib from 'pdfjs-dist';
import {
  PDFDocumentLoadingTask,
  PDFDocumentProxy,
  TextItem,
} from 'pdfjs-dist/types/src/display/api';

@Component({
  standalone: true,
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css'],
  imports: [CommonModule],
})
export class NewsComponent implements AfterViewInit {
  @ViewChildren('myCanvas', { read: ElementRef })
  canvasRefs?: QueryList<ElementRef>;
  loadingTask?: PDFDocumentLoadingTask;
  pdfDocument?: PDFDocumentProxy;
  pdfPages?: {
    number: number;
    data: {
      str: string;
      left: number;
      top: number;
      width: number;
      height: number;
      fontSize: number;
      fontFamily: string;
    }[];
  }[];
  newDoc = new jsPDF();

  constructor() {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.6.172/pdf.worker.min.js';

    pdfjsLib
      .getDocument('assets/files/Pistol License.pdf')
      //.getDocument('assets/files/BECU-Statement.pdf')
      //.getDocument('assets/files/Appointment Scheduled.pdf')
      .promise.then((pdf) => {
        this.pdfPages = [...Array(pdf._pdfInfo.numPages).keys()].map((i) => {
          return { number: i, data: [] };
        });
        this.pdfDocument = pdf;
      });
  }

  ngAfterViewInit(): void {
    this.canvasRefs?.changes.subscribe(() => {
      this.pdfPages?.forEach((data) => {
        this.pdfDocument?.getPage(data.number + 1).then((page) => {
          const viewport = page.getViewport({ scale: 1.7 });
          const canvas = this.canvasRefs?.get(data.number)?.nativeElement;

          canvas.height = viewport.height;
          canvas.width = viewport.width;

          const renderContext = {
            canvasContext: canvas.getContext('2d'),
            viewport,
          };

          page.getTextContent().then((textContent) => {
            for (let textItem of textContent.items) {
              textItem = textItem as TextItem;

              const tx = pdfjsLib.Util.transform(
                pdfjsLib.Util.transform(viewport.transform, textItem.transform),
                [1, 0, 0, -1, 0, 0]
              );

              const style = textContent.styles[textItem.fontName];
              //const fontSize = Math.sqrt(tx[2] * tx[2] + tx[3] * tx[3]);
              const fontSize = tx[0];
              //console.log(textItem.str, tx);

              if (style.ascent) {
                tx[5] -= fontSize * style.ascent;
              } else if (style.descent) {
                tx[5] -= fontSize * (1 + style.descent);
              } else {
                tx[5] -= fontSize / 2;
              }

              data.data.push({
                fontSize,
                fontFamily: style.fontFamily,
                str: textItem.str,
                height: textItem.height,
                width: textItem.width,
                left: tx[4],
                top: tx[5] - 2,
              });
            }
          });

          page.render(renderContext);
        });
      });
    });
  }

  createNewPdf() {
    //var doc = new jsPDF();
    //doc.text('Hello world!', 10, 10);
    //doc.save('hello-world.pdf');
    this.newDoc?.save();
  }
}
