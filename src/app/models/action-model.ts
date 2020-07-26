export class ActionModel {
    collectionId: number
    gpio: number
    id: number
    name: string
    type: string
    userId: number

    constructor(id: number = -1) {
        this.id = id
    }

}
