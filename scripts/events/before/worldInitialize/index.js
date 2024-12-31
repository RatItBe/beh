import { FoodBlockComponent } from "class/block/foodBlock";
import { CookingPot } from "class/block/cookingPot";

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
                FoodBlockComponent.eat(eventData);
            }
        }
    },
    {
        id: "fs:cooking_pot_block",
        code: {
            onPlayerInteract: (eventData)=>{
                let cookingPot = new CookingPot(eventData);
                cookingPot.interactCookingPot();
            },
            onPlayerDestroy: (eventData)=>{
                let cookingPot = new CookingPot(eventData);
                cookingPot.breakCookingPot();
            }
        }
    },
    {
        id: "fs:eating_pot_block",
        code: {
            onPlayerInteract: (eventData)=>{
                let cookingPot = new CookingPot(eventData);
                cookingPot.interactCompletePot();
            },
            onPlayerDestroy: (eventData)=>{
                let cookingPot = new CookingPot(eventData);
                cookingPot.breakCompletePot();
            }
        }
    }
];
