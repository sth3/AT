import {Injectable} from '@angular/core'
import {RecipeModel} from '../models/recipe.model'
import {OrderModel, OrderModelPacking} from '../models/order.model'

@Injectable({
  providedIn: 'root',
})
export class ExportService {
  constructor() {}

  /**
   * @author https://stackblitz.com/@anjiuidev/
   */
  downloadFile(data: any, headerList: string[], filename: string = 'export') {
    let csvData = this.convertToCSV(data, headerList)
    let blob = new Blob(['\ufeff' + csvData], {type: 'text/csv;charset=utf-8;'})
    let dwldLink = document.createElement('a')
    let url = URL.createObjectURL(blob)
    let isSafariBrowser =
      navigator.userAgent.indexOf('Safari') != -1 &&
      navigator.userAgent.indexOf('Chrome') == -1
    if (isSafariBrowser) {
      //if Safari open in new window to save file with random filename.
      dwldLink.setAttribute('target', '_blank')
    }
    dwldLink.setAttribute('href', url)
    dwldLink.setAttribute('download', filename + '.csv')
    dwldLink.style.visibility = 'hidden'
    document.body.appendChild(dwldLink)
    dwldLink.click()
    document.body.removeChild(dwldLink)
  }

  convertToCSV(objArray: any[] | any, headerList: string[]) {
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray
    let str = ''
    let row = 'Index;'

    for (let index in headerList) {
      row += headerList[index] + ';'
    }
    row = row.slice(0, -1)
    str += row + '\r\n'
    for (let i = 0; i < array.length; i++) {
      let line = i + 1 + ''
      for (let index in headerList) {
        let head = headerList[index]
        //console.log("🚀 ~ file: export.service.ts:45 ~ ExportService ~ convertToCSV ~ head:", head)
        
        if (
          array[i].hasOwnProperty(head) &&
          array[i][head] !== null &&
           (head === 'datetime'|| head === 'lastUpdate' || head === 'dueDate' )
        ) {

           let date = new Date(array[i][head])
          line += ';' + (date.toLocaleString() || '')          
          
        } else if (
          array[i].hasOwnProperty(head) &&
          array[i][head] !== null &&
           (head === 'station' )
        ) {
          let station : string = 'Nedefinované'
            if (array[i][head]==1) {
              station = 'Big Bag'
            }
            if (array[i][head]==2) {
              station = 'Tekuté komponenty'
            }
            if (array[i][head]==3) {
              station = 'ADS'
            }
            if (array[i][head]==4) {
              station = 'Makro komponenty'
            }
            if (array[i][head]==5) {
              station = 'Vrece'
            }
            
          line += ';' + (station || '')          
          
        }
        
        else if (
          array[i].hasOwnProperty(head) &&
          array[i][head] !== null &&
          typeof array[i][head] === 'string'
        ) {
          line += ';' + (array[i][head].trim() || '')          
        } else if (
          array[i].hasOwnProperty(head) &&
          array[i][head] !== null &&
          typeof array[i][head] === 'number'  &&
          head != 'no'
        ) {
          line += ';' + (Number(array[i][head].toFixed(3)).toLocaleString('sk-SK') || '')
         
        } else {
          line += ';' + (array[i][head] || '')
          
        }
      }
      str += line + '\r\n'
    }
    return str
  }

  convertRecipesForDownload(data: RecipeModel[]) {
    data.map((r) => {
      const recipe: any = r
      r.components.forEach((c, i) => {
        recipe['componentID' + (i + 1)] = c.id
        recipe['componentName' + (i + 1)] = c.name
        recipe['componentSP' + (i + 1)] = c.componentSP
      })
      return recipe
    })
    return data
  }

  getRecipesHeaders() {
    const headers = ['no', 'id', 'name', 'lastUpdate']
    for (let i = 1; i < 21; i++) {
      headers.push('componentID' + i)
      headers.push('componentName' + i)
      headers.push('componentSP' + i)
    }
    return headers
  }

  getOrdersHeaders() {
    const headers = [
      'no',
      'id',
      'name',
      'customerName',
      'dueDate',
      'lastUpdate',
      'operatorId',
      'idMixer',
      'mixingTime',
      'idPackingMachine',
      'createdAt',
      'idEmptyingStationBag',
      'volumePerDose',
      'recipeName',
    ]
    for (let i = 1; i < 21; i++) {
      headers.push('componentID' + i)
      headers.push('componentName' + i)
      headers.push('componentSP' + i)
    }

    return headers
  }

  convertOrdersForDownload(orders: OrderModelPacking[]) {
    console.log(orders)
    orders.map((r) => {
      const recipe: any = r
      recipe['recipeName'] = r.recipe.name
      r.recipe.components.forEach((c, i) => {
        recipe['componentID' + (i + 1)] = c.id
        recipe['componentName' + (i + 1)] = c.name
        recipe['componentSP' + (i + 1)] = c.componentSP
      })
      return recipe
    })
    return orders
  }
}
