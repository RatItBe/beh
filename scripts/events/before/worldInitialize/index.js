import { foodComponent } from "./components/food";

export class worldInitialize {
    static load(eventData) {
        this.loadBlockComponents(eventData);
    }
    static loadBlockComponents(eventData) {
        for (const comp of this.blockComponents){
            eventData.blockComponentRegistry.registerCustomComponent(comp.id, comp.code);
        }
    }
}

worldInitialize.blockComponents = [
    {
        id: "fs:food_block",
        code: {
            onPlayerInteract: (eventData)=>{
                foodComponent.eat(eventData);
            }
        }
    }
];
