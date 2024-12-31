import { BlockPermutation } from "@minecraft/server";
import { food } from "data/food";

export class foodComponent {
    static eat(eventData) {
        const { block, dimension, player } = eventData;
        if (!player) return;
        const foodBlock = food.find((f)=>f.blockID == block.typeId);
        if (!foodBlock) return;
        const state = block.permutation.getState(foodBlock.stateID);
        if (state == undefined) return;
        if (state - 1 >= 0) {
            block.setPermutation(block.permutation.withState(foodBlock.stateID, state - 1));
        } else {
            block.setPermutation(BlockPermutation.resolve("minecraft:air"));
        }
        if (foodBlock.sound) {
            const sound = foodBlock.sound;
            dimension.playSound(sound.id, block.center(), {
                volume: sound.volume,
                pitch: sound.pitch
            });
        }
    }
}
