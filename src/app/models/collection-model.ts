export class CollectionModel {
    id : number = -1;
    name: string = '';
    image: string = '';
    countAction: number = 0;
    typecCollection: string = "Default";

    constructor(name: string, id :number = -1) {
        this.name = name;
        this.id = id;
    }
}
