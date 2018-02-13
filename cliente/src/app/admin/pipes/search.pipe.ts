import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({
    name: 'searchPipe'
})

@Injectable()

// Creamos un ipe para usar en el ngFor de un listado. Si existe el termino de busqueda(term)
// filtra el listado que nos llego de la api. Si no existe este termino nos devuelve el listado
// completo. Se utiliza en el list.components
// Hay que cargarlo en el module para poderlo utilizar!
// y en html lo usamos con el nombre que le pusimos en el @Pipe, en este caso pipe-search
export class SearchPipe implements PipeTransform {
    // items es la lista de animales que nos devuelve la api, term es el termino de busqueda., key es el atributo a comparar.
    transform(items: any, key: string , term: any): any {
        if (term === undefined) {
            return items;
        }
        // Por cada item de la lista items, lo deja en minuscula y comprueba si en el esta incluido
        // el termino de vbusqueda, si es asi lo devuelve.
        return items.filter(function (item) {
            return item[key].toLowerCase().includes(term.toLowerCase());
        });
    }
}
