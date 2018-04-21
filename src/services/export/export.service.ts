import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Transfer } from 'ionic-native';

//Interfaces
import { DataContainer } from '../../components/chart/chart.interface';

declare var cordova: any;

@Injectable()
export class ExportService {

    constructor(
        private platform: Platform
    ) {

    }

    exportCanvasAsPng(chartCanvas: any, overlayCanvas: any) {
        let width = chartCanvas.width;
        let height = chartCanvas.height;
        let blackCanvas = document.createElement('canvas');
        blackCanvas.width = width;
        blackCanvas.height = height + 16;
        let ctx = blackCanvas.getContext("2d");
        ctx.save();
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, blackCanvas.width, blackCanvas.height);
        ctx.drawImage(chartCanvas, 0, 0);
        ctx.drawImage(overlayCanvas, 0, 0);
        ctx.textAlign = 'end';
        ctx.font = "16px Segoe UI";
        ctx.fillStyle = "#CCCCCC";
        ctx.fillText('waveformslive.com', width - 8, height + 8);
        let data = blackCanvas.toDataURL();
        ctx.restore();

        if (this.platform.is('cordova') && (this.platform.is('android') || this.platform.is('ios'))) {
            this.platform.ready().then(() => {
                const fileTransfer = new Transfer();
                //const imageLocation = `${cordova.file.applicationDirectory}www/assets/img/${data}`;
                fileTransfer.download(data, cordova.file.dataDirectory + 'file.png').then(
                    (entry) => {
                    },
                    (error) => {
                    }
                );
            });
        }
        else {
            let link = document.createElement("a");
            link.setAttribute("href", data);
            link.setAttribute("download", 'WaveFormsLiveChart.png');
            document.body.appendChild(link);
            link.click();
        }
    }

    exportGenericCsv(fileName: string, dataContainer: DataContainer[], seriesToDraw: number[], labels: CsvLabel[]) { 
        fileName = fileName + '.csv';
        let csvContent = 'data:text/csv;charset=utf-8,';
        let maxLength = dataContainer[seriesToDraw[0]].data.length;
        for (let i = 0; i < seriesToDraw.length; i++) {
            if (dataContainer[seriesToDraw[i]].data.length > maxLength) {
                maxLength = dataContainer[seriesToDraw[i]].data.length;
            }
            let seriesNum = seriesToDraw[i];
            csvContent += this.getInstrumentLabel(labels, seriesNum);
        }
        csvContent += '\n';
        for (let i = 0; i < maxLength; i++) {
            for (let j = 0; j < seriesToDraw.length; j++) {
                let seriesNum = seriesToDraw[j];
                if (dataContainer[seriesNum].data[i] != undefined) {
                    csvContent += dataContainer[seriesNum].data[i].join(',') + ',,';
                }
                else {
                    csvContent += ',,';
                }
            }
            csvContent += '\n';
        }
        let encodedUri = encodeURI(csvContent);
        let link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
    }

    exportBinary(fileName: string, arrayBuffer: ArrayBuffer) {
        //It's little endian
        fileName = fileName + '.raw';
        let blob = new Blob([arrayBuffer], { type: 'application/octet-stream' });
        let encodedUri = URL.createObjectURL(blob);
        let link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
    }

    private getInstrumentLabel(labels: CsvLabel[], seriesNum: number): string {
        for (let i = 0; i < labels.length; i++) {
            if (labels[i].channels.indexOf(seriesNum) !== -1) {
                seriesNum = seriesNum - labels[i].seriesNumberOffset + 1;
                return labels[i].instrument + ' Ch ' + seriesNum + ' ' + labels[i].xUnit + ',' + labels[i].instrument + ' Ch ' + seriesNum + ' ' + labels[i].yUnit + ',,';
            }
        }
        return 'Label Err';
    }


}

export interface CsvLabel {
    instrument: string,
    seriesNumberOffset: number,
    xUnit: string,
    yUnit: string,
    channels: number[]
}