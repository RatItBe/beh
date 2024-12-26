import { system, world, BlockPermutation, EquipmentSlot } from "@minecraft/server";
import { potRecipe } from 'data/potRecipe';

export function cookingPot(eventData) {
    const { block, player } = eventData;
    const equippable = player.getComponent("minecraft:equippable");
    const mainhand = equippable.getEquipment(EquipmentSlot.Mainhand);

    const posKey = `${block.dimension.id},${block.location.x},${block.location.y},${block.location.z}`
    let potLocations = world.getDynamicProperty("potLocations") || "";
    if (!potLocations[posKey]) {
        potLocations[posKey] = {
            dimension: block.dimension.id,
            location: { x: block.location.x, y: block.location.y, z: block.location.z },
            ingredients: [] // 재료를 넣는 배열 초기화
        };
        world.setDynamicProperty("potLocations", JSON.stringify(potLocations)); // 업데이트
    }
    
    const state = block.permutation.getState("fs:cooking_state");
    system.run(() => { console.warn(state) });
    if (state - 1 < 0) {
        
        const currentIngredients = potLocations[posKey].ingredients;
        const matchingRecipe = potRecipe.find(recipe =>
            JSON.stringify(recipe.ingredients) === JSON.stringify(currentIngredients)
        );
        block.setPermutation(BlockPermutation.resolve("fs:complete_pot_example"));
        if (matchingRecipe) {
            block.dimension.playSound("bubble.up", block.center(), {
                volume: 1,
                pitch: 0.9
            });
            const states = [0, 0, 0];
            let resultId = potRecipe.id
            for (let i=0; i<states.length; i++) {
                states[i] = resultId % 10;
                resultId = Math.floor(resultId / 10);
            }
            block.setPermutation(block.permutation.withState("fs:recipe_100", states[2]));
            block.setPermutation(block.permutation.withState("fs:recipe_10", state[1]));
            block.setPermutation(block.permutation.withState("fs:recipe_1", state[0]));
            delete potLocations[posKey];
            world.setDynamicProperty("potLocations", JSON.stringify(potLocations));
        }
        else {
            block.dimension.playSound("mob.husk.convert_to_zombie", block.center(), {
                volume: 1,
                pitch: 0.8
            });
        }
    }
    else if (mainhand) {
        if (state - 1 >= 0) {
            const ingredient = equippable.getEquipmentSlot(EquipmentSlot.Mainhand).typeId;
            potLocations[posKey].ingredients.push(ingredient);
            world.setDynamicProperty("potLocations", JSON.stringify(potLocations));
            block.setPermutation(block.permutation.withState("fs:cooking_state", state - 1));
            block.dimension.playSound("mob.dolphin.splash", block.center(), {
                volume: 1,
                pitch: 1.2
            });
        }
    }
}