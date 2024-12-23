import { BlockPermutation } from "@minecraft/server";
import { foodBlock } from "data/food";
export class blockComponent {
    foodBlockInteract(eventData) {
        const { block, dimension, player } = eventData;
        if (!player) return;
        const food = foodBlock.find((f)=>f.blockID == block.typeId);
        if (!food) return;
        const state = block.permutation.getState(food.stateID);
        if (state == undefined) return;
        if (state - 1 >= 0) {
            block.setPermutation(block.permutation.withState(food.stateID, state - 1));
        } else {
            block.setPermutation(BlockPermutation.resolve("minecraft:air"));
        }
        if (food.effects) {
            for (const effect of food.effects){
                player.addEffect(effect.id, effect.duration, {
                    amplifier: effect.amplifier,
                    showParticles: effect.showParticles
                });
            }
        }
        if (food.eatNoise) {
            const sound = food.eatNoise;
            dimension.playSound(sound.id, block.center(), {
                volume: sound.volume,
                pitch: sound.pitch
            });
        }
        if (food.onEat) food.onEat(player);
    }
}
